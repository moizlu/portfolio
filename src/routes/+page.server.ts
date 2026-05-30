import { env } from "$env/dynamic/private";

import { fail, type ActionFailure, type Actions } from "@sveltejs/kit";

import { z } from "zod";
import { Resend } from "resend";
import { customAlphabet } from "nanoid";

import { checkLimits } from "$lib/server/ratelimit";
import { contactForm } from "$lib/schema";
import type { FormActionTypes } from "$lib/types";
import type { Fields } from "$lib/schema/contact-form";

type FailureData = { error: FormActionTypes.ErrorType, detail?: FormActionTypes.ErrorContentType, ticketId?: string };
type FormSubmissionFailure = ActionFailure<FailureData>;

// ランダムなIDを生成するやつ
const nanoid = customAlphabet("34679ACDEFGHJKLMNPQRTUVWXY", 10);

// SHA-256形式のハッシュを生成
const sha256 = async (text: string) => {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest({ name: "SHA-256" }, data );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

// 受付番号生成
const generateTickedId = (now: Date) => {
    const day = now.toISOString().split("T")[0].replace(/-/g, "");
    const id = nanoid();

    return `REQ-${day}-${id.slice(0, 5)}-${id.slice(5)}`;
}

// 受信したデータをスキーマと照合
const validateFields = (rawData: Record<string, unknown>): z.ZodSafeParseResult<contactForm.Fields> => {
    return contactForm.schema.safeParse(rawData);
}

// CAPTCHA認証
const checkCaptcha = async (token: unknown, ip: string): Promise<FormSubmissionFailure | true> => {
    if (typeof token !== "string") {
        console.error(`Turnstileのトークンが不正です: ${token}`);
        return fail(500, { error: "FAILED_CAPTCHA" });
    }

    try {
        // 検証
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: env.TURNSTILE_SECRET_KEY,
                response: token,
                remoteip: ip
            }),
            signal: AbortSignal.timeout(5000)
        });

        const json = await response.json() as Record<string, unknown>;

        // レスポンスがおかしいとき
        if (!('success' in json)) {
            console.error(`Turnstileからの応答が異常です: successプロパティが含まれていません。`);
            return fail(500, { error: "FAILED_CAPTCHA" });
        }

        // 失敗した時
        if (!json.success) {
            return fail(400, { error: "FAILED_CAPTCHA" });
        }
    } catch (error) {
        // 通信失敗など
        console.error(`Turnstileでの認証時に例外が発生しました: ${error}`);
        return fail(500, { error: "FAILED_CAPTCHA" });
    }

    return true;
}

// レート制限チェック
const checkRatelimit = async (email: string, ip: string) => {
    const hashedEmail = await sha256(email + env.HASH_PEPPER);
    const hashedIP = await sha256(ip + env.HASH_PEPPER);

    return await checkLimits({
        email: `ratelimit:portfolio_contact_email:${hashedEmail}`,
        ip: `ratelimit:portfolio_contact_ip:${hashedIP}`
    })
}

// URLの無害化
const obfuscateUrls = (str: string) => {
    return str.replace(/\./g, '[.]').replace(/:\/\//g, '[://]');
};

// メール送信
const sendEmail = async (fields: Fields, jstDate: string, ticketId: string): Promise<FormSubmissionFailure | true> => {
    try {
        const resend = new Resend(env.RESEND_API_KEY);

        // 自動送信メールだけ送られるとまずいので順番に送信する

        // 問い合わせメール本体
        const inquiryMail = await resend.emails.send({
            from: "問い合わせフォーム <contact-form@moizlu.com>",
            to: "inqury-from-form@moizlu.com",
            replyTo: fields.email,
            subject: `[フォーム]${(fields.subject === '' || fields.subject === undefined) ?
                `${fields.message.slice(0, 30)}${fields.message.length > 30 ? '...' : ''}`
                : fields.subject}`,
            text: `受付日時: ${jstDate}(JST)
受付番号: ${ticketId}
名前: ${fields.name ?? "[なし]"}
Email: ${fields.email}
件名: ${fields.subject ?? "[なし]"}
内容:
${fields.message}`
        });

        if (inquiryMail.error) {
            console.error(`問い合わせメールの送信に失敗。エラーコード: ${inquiryMail.error.message}`);
            return fail(500, { error: "FAILED_INQUIRY_SENDING" });
        }

        // 自動送信メール
        const replyMail = await resend.emails.send({
                    from: "もいずる|moizlu <noreply@moizlu.com>",
                    to: fields.email,
                    replyTo: 'me@moizlu.com',
                    subject: "【自動送信】お問い合わせありがとうございます(もいずる)",
                    text: `\
※このメールは｢moizlu.com｣のお問い合わせフォームに入力されたメールアドレスに自動で送信されています。

この度はもいずる(moizlu)の問い合わせフォームよりお問い合わせいただき、誠にありがとうございます。

お問い合わせを正常に受け付けました。

お問い合わせ内容を拝見し、改めてご連絡させていただきます。
※内容によっては、お返事にお時間をいただく場合や返信を控えさせていただく場合がございます。あらかじめご了承ください。

==================
■受付内容 ※セキュリティのため、URLの可能性がある箇所を加工したうえで内容の一部のみを表示しています。
==================
受付日時       : ${jstDate} (JST)
受付番号       : ${ticketId}
お名前         : ${(fields.name) ? `${obfuscateUrls(fields.name)} 様` : "[なし]"}
件名           : ${(fields.subject === '' || fields.subject === undefined) ? "[なし]" : obfuscateUrls(fields.subject)}
お問い合わせ内容:\n${obfuscateUrls(fields.message).slice(0, 500)}${fields.message.length > 500 ? '...' : ''}
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
`})
        if (replyMail.error) {
            console.error(`自動送信メールの送信に失敗。受付番号: ${ticketId} エラーコード: ${replyMail.error.message}`);
            return fail(500, { error: "FAILED_REPLY_SENDING", ticketId: ticketId });
        }
    } catch (error) {
        console.error(`メール送信処理中にエラーが発生。受付番号: ${ticketId}, エラー: ${error}`);
        return fail(500, { error: "FAILED_INQUIRY_SENDING" });
    }

    return true;
}

// Form Actions
export const actions: Actions = {
    // 問い合わせフォーム
    submitContactForm: async ({ request, getClientAddress }): Promise<
        FormSubmissionFailure | { success: boolean, ticketId: string }
        > => {
        // return { success: true, ticketId: "ticketId" }
        const formData = await request.formData();                    // 受信したデータ
        const ip = getClientAddress();                                // IPアドレス
        const turnstileToken = formData.get("cf-turnstile-response"); // Turnstileのトークン
        const rawFields = Object.fromEntries(formData.entries());     // フォームの生のフィールド
        const now = new Date();                                       // 現在時刻
        const jstDate = now.toLocaleString('ja-JP', {                 // 日本標準時
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const ticketId = generateTickedId(now); // 受付番号

        // フィールドのバリデーション
        const validationResult = validateFields(rawFields);
        if (!validationResult.success) {
            return fail(400, { error: "INVALID_FIELD_VALUE" });
        }
        const fields = validationResult.data;

        // CAPTCHA認証
        const captchaResult = await checkCaptcha(turnstileToken, ip);
        if (captchaResult !== true) {
            return captchaResult;
        }

        // レート制限
        const rateLimitResult = await checkRatelimit(fields.email, ip);
        if (!rateLimitResult["email"]) { // メアドの制限にかかったとき
            return fail(429, { error: "REACHED_RATE_LIMIT", detail: "EMAIL" });
        } else if (!rateLimitResult["ip"]) { // IPアドレスの制限にかかったとき
            return fail(429, { error: "REACHED_RATE_LIMIT", detail: "IP" });
        } else if (!rateLimitResult["global"]) { // 全体の送信回数の制限にかかったとき
            return fail(429, { error: "REACHED_RATE_LIMIT", detail: "GLOBAL" });
        }

        const sendingMailResult = await sendEmail(fields, jstDate, ticketId);
        if (sendingMailResult !== true) {
            return sendingMailResult;
        }

        console.info(`問い合わせを正常に送信。受付番号: ${ticketId}`);

        return { success: true, ticketId: ticketId }
    }
}
