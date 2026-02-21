import { env } from "$env/dynamic/private";

import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

import { z } from "zod";
import { Resend } from "resend";
import { contactForm } from "$lib/schema";
import { checkLimit } from "$lib/server/ratelimit";
import { customAlphabet } from "nanoid";

const resend = new Resend(env.RESEND_API_KEY);

const nanoid = customAlphabet("34679ACDEFGHJKLMNPQRTUVWXY", 10);

const sha256 = async (text: string) => {
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}

export const actions: Actions = {
    submitContactForm: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const ip = getClientAddress();
        const turnstileToken = formData.get("cf-turnstile-response") as string;
        const rawData = Object.fromEntries(formData.entries());

        // 内容のバリデーション
        const validationResult = contactForm.schema.safeParse(rawData);
        if (!validationResult.success) {
            return fail(400, { rawData, error: "フォームの入力内容に不備があります。", validationError: z.treeifyError(validationResult.error).properties });
        }
        const data = validationResult.data;

        // CAPTCHA認証
        if (!turnstileToken || typeof turnstileToken !== 'string') {
            return fail(400, { rawData, error: "Bot認証に失敗しました。" });
        }
        try {
            const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: env.TURNSTILE_SECRET_KEY,
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

        const emailHash = await sha256(data.email + env.HASH_PEPPER);
        const ipHash = await sha256(ip + env.HASH_PEPPER);

        // レート制限
        const [emailLimitResult, ipLimitResult, globalLimitResult] = await Promise.all([
            checkLimit('email', `ratelimit:portfolio_contact_email:${emailHash}`),
            checkLimit('ip', `ratelimit:portfolio_contact_ip:${ipHash}`),
            checkLimit('global', "ratelimit:portfolio_contact_global")
        ])
        if (!emailLimitResult.success || !ipLimitResult.success || !globalLimitResult.success) {
            if (!globalLimitResult.success) {
                console.warn(`[問い合わせフォーム]全体の送信制限が掛かっています。`);
            }
            return fail(429, { error: "試行回数が多すぎるか、\nサーバーが混み合っています。\n時間をおいてお試しいただくか、ページ下部のメールアドレスから直接お問い合わせください。" });
        }

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

        const id = nanoid();
        const ticketId = `REQ-${now.toISOString().split('T')[0].replace(/-/g, '')}-${id.slice(0, 5)}-${id.slice(5)}`;

        // メール送信
        // 自動送信メールだけが成功するとまずいので順番に送信する
        try {
            const adminMail = await resend.emails.send({
                from: '問い合わせフォーム <contact-form@moizlu.com>',
                to: 'form@moizlu.com',
                replyTo: data.email,
                subject: `[フォーム]${(data.subject === '' || data.subject === undefined) ? `${data.message.slice(0, 30)}${data.message.length > 30 ? '...' : ''}` : data.subject}`,
                text: `受付日時: ${jstDate} (JST)\n受付番号: ${ticketId}\n名前: ${data.name}\nEmail: ${data.email}\n件名: ${data.subject ?? "[なし]"}\n内容:\n${data.message}`
            });

            if (adminMail.error) {
                console.error(`[問い合わせフォーム]管理者へのメール送信に失敗。受付番号: ${ticketId}, エラーコード: ${adminMail.error.message}`);
                return fail(500, { data, error: `フォームの送信に失敗しました。\nお手数ですが、再度送信いただくかページ下部のメールアドレスより直接お問い合わせください。` });
            }

            const userMail = await resend.emails.send({
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
件名           : ${(data.subject === '' || data.subject === undefined) ? "[なし]" : data.subject}
お問い合わせ内容:\n${sanitize(data.message).slice(0, 500)}${data.message.length > 500 ? '...' : ''}
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

            if (userMail.error) {
                console.error(`[問い合わせフォーム]自動送信メールの送信に失敗。受付番号: ${ticketId}, エラーコード: ${userMail.error.message}`);
                await resend.emails.send({
                    from: '問い合わせフォーム <contact-form@moizlu.com>',
                    to: 'form@moizlu.com',
                    replyTo: data.email,
                    subject: `[フォーム]エラー: 自動送信メールの送信に失敗: ${ticketId}`,
                    text: `受付番号: ${ticketId} について、自動送信メールの送信に失敗しました。\n枠を使い切っていなければメールアドレスを間違えている可能性あり。`
                });

                return { success: true, warning: `自動送信メールの送信に失敗しました。\nメールアドレスが正しいかご確認ください。\nメールアドレスが正しい場合は再送は不要です。\nその場合、お手数ですが受付番号をお控えいただくとやり取りがスムーズになります。`, ticketId: ticketId };
            }
        } catch (error) {
            console.error(`[問い合わせフォーム]メール送信中にエラーが発生。受付番号: ${ticketId}, エラー: ${error instanceof Error ? error.message : String(error)}`);
            return fail(500, { data, error: "不明なエラーが発生しました。\nお手数ですが、再送いただくかページ下部のメールアドレスより直接お問い合わせください。" })
        }

        console.info(`[問い合わせフォーム]問い合わせを正常に送信。受付番号: ${ticketId}`)
        return { success: true, ticketId: ticketId };
    }
}
