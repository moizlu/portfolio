import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

import { z } from "zod";
import escape from "lodash/escape";
import { Resend } from "resend";

import { TURNSTILE_SECRET_KEY, RESEND_API_KEY } from '$env/static/private';

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
    default: async ({ request }) => {
        const formData = await request.formData();
        const token = formData.get("cf-turnstile-response") as string;

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string
        };

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
            return fail(400, { data, error: "CAPTCHAの認証に失敗しました。" });
        }

        try {
            const { error } = await resend.emails.send({
                from: 'Contact Form <contact@form.moizlu.com>',
                to: ['contact@moizlu.com'],
                subject: escape(data.subject),
                html: `<p>名前: ${escape(data.name)}</p><p>Email: ${escape(data.email)}</p><p>内容: ${escape(data.message)}</p>`
            });

            if (error) {
                return fail(500, { data, error: "メールの送信に失敗しました。", email: generateEMailAddress() });
            }
        } catch (error) {
            return fail(500, { error: error, email: generateEMailAddress() });
        }

        return { success: true }
    }
};