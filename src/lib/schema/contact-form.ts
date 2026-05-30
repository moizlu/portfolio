import { z } from 'zod';
import { m } from "$lib/paraglide/messages"

export const maxLength: Readonly<Record<string, number>> = {
    name:      50,
    email:    100,
    subject:  100,
    message: 3000
};

export type Fields = {
    name?: string;
    email: string;
    message: string;
    agreed: boolean;
    subject?: string | undefined;
}

export const schema = z.object({
    name: z.string().trim().max(maxLength.name, m.form_error_name_too_long()).optional(),
    email: z.email(m.form_error_invalid_email()).trim().max(maxLength.email, m.form_error_email_too_long()),
    subject: z.string().trim().max(maxLength.subject, m.form_error_subject_too_long()).optional(),
    message: z.string().trim().min(1, m.form_error_require_inquiry()).max(maxLength.message, m.form_error_inquiry_too_long()),
    // agreed: z.string().or(z.undefined()).refine((value) => value === 'on', "プライバシーポリシーに同意する必要があります。")
    agreed: z.literal("true", m.form_error_require_agree_privacy_policy()).transform(() => true)
});
