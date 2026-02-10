import { TURNSTILE_SECRET_KEY, RESEND_API_KEY } from "$env/static/private";

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

export const actions: Actions = {
    submitContactForm: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const ip = getClientAddress();
        const turnstileToken = formData.get("cf-turnstile-response") as string;

        // レート制限
        const { remaining: rateRemaining } = await ratelimit.getRemaining(ip);
        if (rateRemaining === 0) {
            return fail(429, { error: "試行回数が多すぎます。\n時間をおいてお試しください。" });
        }

        // フォームのデータを取得
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string
        };

        // 内容のバリデーション
        const validationResult = contactSchema.safeParse(data);

        if (!validationResult.success) {
            return fail(400, { data, error: "フォームの入力内容に不備があります。", validationError: z.treeifyError(validationResult.error).properties });
        }

        // CAPTCHA認証
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: TURNSTILE_SECRET_KEY,
                response: turnstileToken,
                remoteip: ip
            }),
        });
        const { success: verifySuccess } = await verifyResponse.json();
        if (!verifySuccess) {
            return fail(400, { data, error: "Bot認証に失敗しました。" });
        }

        ratelimit.limit(ip);

        // メール送信
        try {
            // フォームの内容を送信
            const { error: sendFormError } = await resend.emails.send({
                from: '問い合わせフォーム <contact-form@moizlu.com>',
                to: ['contact@moizlu.com'],
                subject: escape(data.subject),
                text: `名前: ${data.name}\nEmail: ${data.email}\nIPアドレス: ${getClientAddress()}\n内容:\n${data.message}`
            });

            if (sendFormError) {
                return fail(500, { data, error: `${sendFormError.message}` });
            }

            // 受理メール
            const { error: sendAutoReplayError } = await resend.emails.send({
                from: "もいずる <contact-form@moizlu.com>",
                to: [data.email],
                subject: "【自動送信】お問い合わせありがとうございます(もいずる)",
                text: `\
${data.name}様

もいずるです。

この度はフォームよりお問い合わせいただき、誠にありがとうございます。
メッセージは正常に送信されました。
お問い合わせ内容を確認の上、必要があれば改めて連絡用のメールアドレス(contact@moizlu.com)よりご連絡させていただきます。
返信を要する内容にもかかわらず数日以内に返信がない場合、またはお急ぎの場合は、お手数ですが連絡用のメールアドレスに直接ご連絡いただくかXアカウント(@moizlu)のダイレクトメッセージよりご連絡をお願いいたします。

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
返信される場合は前述した連絡用メールアドレスをご利用ください。\
`
            });

            if (sendAutoReplayError) {
                return fail(500, { data, error: `フォームの送信には成功しましたが、\n自動返信メールの送信に失敗しました。\nエラーコード: ${sendAutoReplayError.message}` });
            }
        } catch (e) {
            return fail(500, { data, error: e })
        }

        return { success: true };
    }
}
