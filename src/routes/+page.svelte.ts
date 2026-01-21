import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

import { Resend } from "resend";

import { TURNSTILE_SECRET_KEY, RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const token = formData.get("cf-turnstile-response") as string;
        const name = formData.get('name') as string
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

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
            return fail(400, { error: "CAPTCHAの認証に失敗しました。" });
        }

        try {
            const { error } = await resend.emails.send({
                from: 'Contact Form <onboarding@resend.dev>', // 認証済みドメインに変更
                to: ['contact@moizlu.com'],
                subject: `[お問い合わせ] ${name}様より`,
                html: `<p>名前: ${name}</p><p>Email: ${email}</p><p>内容: ${message}</p>`
            });

            if (error) {
                return fail(500, { error: "メールの送信に失敗しました。" });
            }
        } catch (error) {
            return fail(500, { error: error });
        }
    }
};