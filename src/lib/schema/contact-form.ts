import { z } from "zod";


export const maxLength: Readonly<Record<string, number>> = {
    name:      50,
    email:    100,
    subject:  100,
    message: 3000
};

export const schema = z.object({
    name: z.string().trim().min(1, "お名前を入力してください。").max(maxLength.name, "お名前は50文字以内で入力してください。"),
    email: z.email("有効なメールアドレスを入力してください。").trim().max(maxLength.email, "メールアドレスは100文字以内で入力してください。"),
    subject: z.string().trim().max(maxLength.subject, "件名は100文字以内で入力してください。").optional(),
    message: z.string().trim().min(1, "お問い合わせ内容を入力してください。").max(maxLength.message, "内容は3000文字以内で入力してください。"),
    // agreed: z.string().or(z.undefined()).refine((value) => value === 'on', "プライバシーポリシーに同意する必要があります。")
    agreed: z.literal('on', "プライバシーポリシーに同意する必要があります。").or(z.boolean().refine((value) => value === true, "プライバシーポリシーに同意する必要があります。"))
});
