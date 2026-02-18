import { TURNSTILE_SECRET_KEY, RESEND_API_KEY } from "$env/static/private";

import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

import { z } from "zod";
import { Resend } from "resend";
import { ratelimit } from "$lib/server/ratelimit";

const resend = new Resend(RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください。").max(50, "お名前は50文字以内で入力してください。"),
  email: z.email("有効なメールアドレスを入力してください。"),
  subject: z.string().trim().min(1, "件名を入力してください。").max(100, "件名は100文字以内で入力してください。"),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください。").max(2000, "内容は2000文字以内で入力してください。"),
});

export const actions: Actions = {
    submitContactForm: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const ip = getClientAddress();
        const turnstileToken = formData.get("cf-turnstile-response") as string;
        const rawData = Object.fromEntries(formData.entries());

        // レート制限
        const { remaining: rateRemaining } = await ratelimit.getRemaining(ip);
        if (rateRemaining === 0) {
            return fail(429, { error: "試行回数が多すぎます。\n時間をおいてお試しください。" });
        }

        // CAPTCHA認証
        if (!turnstileToken || typeof turnstileToken !== 'string') {
            return fail(400, { error: "Bot認証に失敗しました。" });
        }
        try {
            const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                    remoteip: ip
                }),
                signal: AbortSignal.timeout(5000)
            });
            const { success: verifySuccess } = await verifyResponse.json();
            if (!verifySuccess) {
                return fail(400, { rawData, error: "Bot認証に失敗しました。" });
            }
        } catch {
            return fail(500, { error: "認証サーバーとの通信に失敗しました。" });
        }

        // 内容のバリデーション
        const validationResult = contactSchema.safeParse(rawData);
        if (!validationResult.success) {
            return fail(400, { rawData, error: "フォームの入力内容に不備があります。", validationError: z.treeifyError(validationResult.error).properties });
        }
        const data = validationResult.data;
        // data.name.replace(/[\r\n]/g, '');
        // data.subject.replace(/[\r\n]/g, '');

        ratelimit.limit(ip); // レートをカウント

        const sanitize = (str: string) => {
            return str.replace(/\./g, '[.]').replace(/:\/\//g, '[://]');
        };

        const now = new Date();
        const jstDate = now.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const ticketId = `#${now.toISOString().split('T')[0]}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

        // メール送信
        try {
            const [adminMail, userMail] = await Promise.allSettled([
                resend.emails.send({
                    from: '問い合わせフォーム <contact-form@moizlu.com>',
                    to: 'form@moizlu.com',
                    replyTo: data.email,
                    subject: `[フォーム]${data.subject}`,
                    text: `受付日時: ${jstDate} (JST)\n受付番号: ${ticketId}\n名前: ${data.name}\nEmail: ${data.email}\nIPアドレス: ${ip}\n内容:\n${data.message}`
                }),
                resend.emails.send({
                    from: "もいずる|moizlu <noreply@moizlu.com>",
                    to: data.email,
                    replyTo: 'me@moizlu.com',
                    subject: "【自動送信】お問い合わせありがとうございます(もいずる)",
                    text: `\
※このメールは｢moizlu.com｣のお問い合わせフォームに入力されたメールアドレスに自動で送信されています。

この度はもいずる(moizlu)の問い合わせフォームよりお問い合わせいただき、誠にありがとうございます。

お問い合わせを正常に受け付けました。

お問い合わせ内容を拝見し、改めてご連絡させていただきます。
※内容によっては、お返事にお時間をいただく場合や返信を控えさせていただく場合もございます。あらかじめご了承ください。

==================
■受付内容 ※セキュリティ保護及び悪用対策のため、URLを無効化したうえで内容の一部のみを表示しています。
==================
受付日時       : ${jstDate} (JST)
受付番号       : ${ticketId}
お名前         : ${data.name}
件名           : ${data.subject}
お問い合わせ内容:\n${sanitize(data.message).substring(0, 500)}${data.message.length > 500 ? '...' : ''}
==================

■数日経っても返信がない場合
システムトラブルの可能性があります。
お手数ですが、以下のいずれかの方法で再度ご連絡いただけますと幸いです。

- Email: me@moizlu.com
- X(旧Twitter): @moizlu (https://x.com/moizlu)

このメールに心当たりがない場合は、恐れ入りますが破棄をお願いいたします。
万が一連続して届く場合は連絡用メールアドレスまたはXのDMよりご連絡ください。

※本メールは自動送信専用アドレスからお送りしていますが、このメールに返信いただくと私(me@moizlu.com)へ届きます。

――――――――――――――――――
もいずる / moizlu
Links  : https://moiz.lu/
Web    : https://moizlu.com/
Email  ： me@moizlu.com
――――――――――――――――――\
`
                })
            ]);

            if ((adminMail.status === 'rejected') || (adminMail.status === 'fulfilled' && adminMail.value.error)) {
                // 論理的にerrorがnullで表示されることは無いはず
                return fail(500, { data, error: `フォームの送信に失敗しました。${(adminMail.status === 'fulfilled') && `\nエラーコード: ${adminMail.value.error?.message}`}` });
            }

            if ((userMail.status === 'rejected') || (userMail.status === 'fulfilled' && userMail.value.error)) {
                // 論理的にerrorがnullで表示されることは無いはず
                return { success: true, warning: `自動返信メールの送信に失敗したため\nメールが届かない場合がございますが、\n対応は不要です。${(userMail.status === 'fulfilled') && `\nエラーコード: ${userMail.value.error?.message}`}` };
            }
        } catch {
            return fail(500, { data, error: "不明なエラーが発生しました。" })
        }

        return { success: true };
    }
}
