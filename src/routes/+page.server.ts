import { TURNSTILE_SECRET_KEY, RESEND_API_KEY } from '$env/static/private';

import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

import { z } from "zod";
import escape from "lodash/escape";
import { Resend } from "resend";
import { ratelimit } from "$lib/server/ratelimit";

const resend = new Resend(RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください。").max(50, "お名前は50文字以内で入力してください。"),
  email: z.email("有効なメールアドレスを入力してください。"),
  subject: z.string().min(1, "件名を入力してください。").max(100, "件名は100文字以内で入力してください。"),
  message: z.string().min(1, "お問い合わせ内容を入力してください。").max(2000, "内容は2000文字以内で入力してください。"),
});

const generateEMailAddress = () => {
    const parts = ["contact", "moizlu", "com"];
    return `${parts[0]}@${parts[1]}.${parts[2]}`
}

export const actions: Actions = {
    default: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const ip = getClientAddress();
        const token = formData.get("cf-turnstile-response") as string;

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string
        };

        const { remaining } = await ratelimit.getRemaining(ip);
        if (remaining === 0) {
            return fail(429, { data, error: "レート制限にかかりました。", email: generateEMailAddress() });
        }

        const validationResult = contactSchema.safeParse(data);

        if (!validationResult.success) {
            return fail(400, {
                data,
                error: z.treeifyError(validationResult.error).properties,
            });
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: TURNSTILE_SECRET_KEY,
                response: token,
            }),
        });
        const { success } = await verifyResponse.json();
        if (!success) {
            return fail(400, { data, error: "Bot認証に失敗しました。" });
        }

        try {
            const { error } = await resend.emails.send({
                from: '問い合わせフォーム <contact-form@moizlu.com>',
                to: ['contact@moizlu.com'],
                subject: escape(data.subject),
                text: `名前: ${escape(data.name)}\nEmail: ${escape(data.email)}\n内容:\n${escape(data.message)}`
            });
            const { error: autoReplayError } = await resend.emails.send({
                from: "もいずる <contact-form@moizlu.com>",
                to: [data.email],
                subject: "【自動送信】お問い合わせありがとうございます(もいずる)",
                text: `${escape(data.name)}様

もいずるです。

この度はフォームよりお問い合わせいただき、誠にありがとうございます。
メッセージは正常に送信されました。
お問い合わせ内容を確認の上、必要があれば改めて連絡用のメールアドレス(contact@moizlu.com)よりご連絡させていただきます。
返信を要する内容にもかかわらず数日以内に返信がない場合、またはお急ぎの場合は、お手数ですが連絡用のメールアドレスに直接ご連絡いただくかXアカウント(@moizlu)のダイレクトメッセージへご連絡をお願いいたします。

このメールに心当たりがない場合は無視してください。
万が一連続して届く場合は連絡用メールアドレスまたはXのDMよりご連絡ください。

X: https://x.com/moizlu
連絡用メールアドレス: contact@moizlu.com
――――――――――――――――――
もいずる/moizlu
Website: https://moizlu.com/
Email：contact@moizlu.com
――――――――――――――――――
※これは自動送信専用のメールアドレスです。
返信される場合は、混同を防ぐために前述した連絡用メールアドレスをご利用ください。
`
            });

            if (error || autoReplayError) {
                return fail(500, { data, error: "メールの送信に失敗しました。", email: generateEMailAddress() });
            }
        } catch (error) {
            return fail(500, { error: error, email: generateEMailAddress() });
        }

        await ratelimit.getRemaining(ip);

        return { success: true };
    }
};