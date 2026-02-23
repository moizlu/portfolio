<script lang="ts">
    import LoadingIcon from "$lib/assets/icons/loading.svelte";
    import SendIcon from "$lib/assets/icons/send.svelte";
    import CheckCircleIcon from "$lib/assets/icons/check-circle.svelte";
    import CrossCircleIcon from "$lib/assets/icons/cross-circle.svelte";
    import JumpIcon from "$lib/assets/icons/jump.svelte";
    import InfoIcon from "$lib/assets/icons/info.svelte";
    import WarningIcon from "$lib/assets/icons/warning.svelte";

    import { dev } from "$app/environment";
    import type { PageProps } from "../../../../routes/(app)/$types";
    import { enhance } from "$app/forms";

    import CopyButton from "$lib/components/ui/CopyButton";
    import SvgIcon from "$lib/components/ui/SvgIcon";
    import Turnstile from "$lib/components/ui/Turnstile";
    import MailAddress from "./MailAddress.svelte";
    import { dialog } from "$lib/components/ui/Dialog";
    import { slide } from "svelte/transition";
    import { turnstileState } from "$lib/state/state.svelte";
    import { contactForm } from "$lib/schema";

    const { form }: PageProps & {
        form?: {
            data: {
                name: string,
                email: string,
                subject: string,
                message: string,
                agreed: boolean
            },

            error?: string,
            warning?: string,
            ticketId?: string,

            validationError?: {
                name?: { errors: string[] },
                email?: { errors: string[] },
                subject?: { errors: string[] },
                message?: { errors: string[] },
                agreed?: { errors: string[] },
            }
        }
    } = $props();

    const actionState = $state({
        isSubmitting: false,
        status: undefined as number | undefined,
        type: 'none' as "error" | "success" | "redirect" | "failure" | "none"
    });

    let formValues = $state({
        name: '',
        email: '',
        subject: '',
        message: '',
        agreed: true
    });

    let formItemsTouched = $state({
        name: false,
        email: false,
        subject: false,
        message: false,
        agreed: false,
        submitButtonClicked: false
    });

    let validation = $derived(contactForm.schema.safeParse(formValues, { reportInput: true }));
    let validationError = $derived.by(() => {
        if (validation.error) {
            return validation.error.issues;
        }

        return undefined;
    });

    const onSubmitButtonClick = () => {
        for (const key in formItemsTouched) {
            formItemsTouched[key as keyof typeof formItemsTouched] = true;
        }
    }

    const onStartFormSubmission = () => {
        dialog.activate({
            id: "submitting-form",
            content: submittingForm,
            isDrawWindow: false,
            isModal: true,
            requireContrast: true
        });
    }
    const onEndFormSubmission = () => {
        dialog.deactivate("submitting-form");

        if (actionState.type === 'success') {
            for (const key in formItemsTouched) {
                formItemsTouched[key as keyof typeof formItemsTouched] = false;
            }
        }

        if (!dev) {
            turnstile.reset('#turnstile-container');
        }

        dialog.activate({
            id: "submission-ended",
            content: formSubmissionEnded,
            isDrawWindow: true,
            isModal: true,
            requireContrast: true
        })
    }

    const getValidationError = (key: 'name' | 'email' | 'subject' | 'message' | 'agreed') => {
        if (validationError) {
            const error = validationError.find((e) => e.path[0] === key)?.message;
            if (error) {
                return error;
            }
        }
        if (form?.validationError?.[key]) {
            const  error = form.validationError[key].errors[0];
            return error;
        }

        return "";
    }

    const setTouched = (key: keyof typeof formItemsTouched) => {
        return () => {
            formItemsTouched[key] = true;
        }
    }
</script>

{#snippet formSubmissionCompleted()}
    {#if form?.warning}
        <SvgIcon Svg={WarningIcon} size={100} autoChangeByTheme={false} class="fill-warning" />
    {:else}
        <SvgIcon Svg={CheckCircleIcon} size={100} autoChangeByTheme={false} class="fill-success" />
        <p class="text-2xl">送信が完了しました。</p>
        <p class="text-sm">お問い合わせありがとうございます。</p>
        <p></p>
    {/if}
    {#if form?.warning}
        <p class="text-md whitespace-pre-line">{form.warning}</p>
    {/if}

    {#if form?.ticketId}
        <p class="text-sm">受付番号{(form?.warning) ? "" : "(メールでもお知らせしています)"}</p>
        <div class="-mt-4 -mb-3 flex-center">
            <p class="text-xs">{form.ticketId}</p>
            <CopyButton text={form.ticketId} class="scale-75" />
        </div>
    {/if}

    <button onclick={() => dialog.deactivate()} class="p-2 flex justify-start items-center button-general button-bg-turn-on cursor-pointer">
        <SvgIcon Svg={CheckCircleIcon} size={30} />
        <p class="flex-1 text-center">OK</p>
    </button>
{/snippet}

{#snippet formSubmissionFailed()}
    <SvgIcon Svg={CrossCircleIcon} size={100} autoChangeByTheme={false} class="fill-danger" />
    <p class="text-2xl">送信に失敗しました。</p>
    {#if actionState.type === 'failure'}
        <p class="text-xs">エラーコード: {actionState.status}</p>
        <p class="text-md whitespace-pre-line">{form?.error}</p>
    {:else if actionState.type === 'error'}
        <p class="text-center text-md">サーバーに接続できませんでした。<br>ネットワーク接続を確認してください。</p>
    {:else}
        <p class="text-center text-md">不明なエラーが発生しました。</p>
    {/if}

    <button onclick={() => dialog.deactivate()} class="p-2 flex justify-start items-center button-general button-bg-turn-on cursor-pointer">
        <SvgIcon Svg={CheckCircleIcon} size={30} />
        <p class="flex-1 text-center">OK</p>
    </button>
{/snippet}

{#snippet submittingForm()}
    <!-- <div transition:slide={{duration: 300, axis: 'y'}} class="flex-col-center gap-2"> -->
    <div class="flex-col-center gap-2">
        <SvgIcon Svg={LoadingIcon} size={100} class="animate-spin" />
        <p class="text-2xl">送信中...</p>
    </div>
{/snippet}

{#snippet formSubmissionEnded()}
    <div transition:slide={{duration: 300, axis: 'y'}} class="flex-col-center gap-2">
        {#if actionState.type === 'success'}
            {@render formSubmissionCompleted()}
        {:else}
            {@render formSubmissionFailed()}
        {/if}
    </div>
{/snippet}

{#snippet displayRemainingCharNum(maxLength: number, currentLength: number)}
    <p class="text-[15px] -mb-2">{currentLength}/{maxLength}文字</p>
    <!-- <div class="flex-center text-xs">
        <p>{}</p>
        <p class="text-right">/{maxLength}文字</p>
    </div> -->
{/snippet}

{#snippet renderValidationErrorText(text: string)}
    <div class={["w-full h-5 flex justify-start items-center", (text) ? "visible" : "invisible"]}>
        <SvgIcon Svg={InfoIcon} size={20} autoChangeByTheme={false} class="fill-danger" />
        <p class="text-danger text-xs 2xs:text-sm">{text}</p>
    </div>
{/snippet}

<section id="contact" class="min-h-screen h-fit flex flex-col justify-start items-center whitespace-pre-line">
    <article id="contact-content" class="mt-5 mb-50 w-full section-default flex flex-col justify-start items-center">
        <h1>お問い合わせ</h1>

        <h2 class="mt-5">フォーム</h2>

        <form method="POST" action="?/submitContactForm" use:enhance={() => {
            actionState.isSubmitting = true;
            onStartFormSubmission();

            return async ({ result, update }) => {
                dialog.deactivate();
                actionState.isSubmitting = false;
                actionState.status = result.status;
                actionState.type = result.type;
                onEndFormSubmission();

                if (actionState.type !== 'error' && !form?.warning) {
                    await update({ reset: true });
                }
            };
        }} class="my-2 w-[95%] max-w-150 flex-col-center gap-4">

            <!-- 名前欄  -->
            <label>
                <p class="required-form-label">お名前</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="text" name="name" autocomplete="name" placeholder="例: 田中太郎" onblur={setTouched('name')} oninput={setTouched('name')} bind:value={formValues.name} required class={[(formItemsTouched.name && getValidationError('name')) && "invalid-input-label"]}>
                        {@render displayRemainingCharNum(contactForm.maxLength.name, formValues.name.length)}
                    </div>
                    {@render renderValidationErrorText(formItemsTouched.name ? getValidationError('name') : "")}
                </div>
            </label>
            <!-- メアド -->
            <label>
                <p class="required-form-label">メールアドレス</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="email" name="email" autocomplete="email" placeholder="例: example@example.com" onblur={setTouched('email')} bind:value={formValues.email} required class={[(formItemsTouched.email && getValidationError('email')) && "invalid-input-label"]}>
                        {@render displayRemainingCharNum(contactForm.maxLength.email, formValues.email.length)}
                    </div>
                    {@render renderValidationErrorText(formItemsTouched.email ? getValidationError('email') : "")}
                </div>
            </label>
            <!-- 件名 -->
            <label>
                <p class="optional-form-label">件名</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="text" name="subject" placeholder="例: xxのお仕事の依頼" onblur={setTouched('subject')} oninput={setTouched('subject')} bind:value={formValues.subject} class={[(formItemsTouched.subject && getValidationError('subject')) && "invalid-input-label"]}>
                        {@render displayRemainingCharNum(contactForm.maxLength.subject, formValues.subject.length)}
                    </div>
                    {@render renderValidationErrorText(formItemsTouched.subject ? getValidationError('subject') : "")}

                </div>
            </label>
            <!-- 本文 -->
            <label>
                <p class="required-form-label">お問い合わせ内容</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <textarea name="message" rows={10} onblur={setTouched('message')} oninput={setTouched('message')} bind:value={formValues.message} required class={["resize-y w-full ", (formItemsTouched.message && getValidationError('message')) && "invalid-input-label"]}></textarea>
                        {@render displayRemainingCharNum(contactForm.maxLength.message, formValues.message.length)}
                    </div>
                    {@render renderValidationErrorText(formItemsTouched.message ? getValidationError('message') : "")}

                </div>
            </label>

            <p class="text-sm text-center">送信完了後、@moizlu.comのアドレスから<br class="sm:hidden">受付メールを送信させていただきます。
                <br>迷惑メールボックスを含めてご確認ください。
                <br><span class="text-xs text-center">届かない場合はメールアドレスをご確認の上、お手数ですが再送するかページ下部のメールアドレスから直接お問い合わせください。</span>
            </p>
            <!-- <p class="text-center text-xs">
                エラーが発生した場合、または送信に成功したにもかかわらず数分経っても届かない場合はメールアドレスをご確認の上、<br>お手数ですが再送するかページ下部のメールアドレスから直接お問い合わせください。
            </p> -->

            <div class="w-fit flex-col-center">
                <Turnstile />
                <input aria-hidden={true} type="checkbox" bind:checked={turnstileState.isVerified} required class="sr-only">
                {@render renderValidationErrorText((formItemsTouched.submitButtonClicked && !turnstileState.isVerified) ? "Bot認証が必要です。" : "")}
            </div>

            <!-- <div class="w-fit flex-col-center">
                <label class="checkbox-general p-5 w-max flex max-sm:flex-row justify-center items-center rounded-full border-label border after:ml-2 after:2xs:ml-5 text-xs sm:text-lg">
                            <input name="agreed" type="checkbox" onkeydown={(e) => { if (e.key === 'Enter') { formValues.agreed = !formValues.agreed }}} onblur={setTouched('agreed')} oninput={setTouched('agreed')} bind:checked={formValues.agreed} class={[(formItemsTouched.agreed && getValidationError('agreed')) && "invalid-input-label"]} required>
                        <a href="/privacy-policy" target="_blank" class="ml-2 flex-center inline-link">
                            <p>プライバシーポリシー</p>
                        <SvgIcon Svg={JumpIcon} size={20} />
                        </a>
                        <p>に同意する</p>
                </label>
                {@render renderValidationErrorText(formItemsTouched.agreed ? getValidationError('agreed') : "")}
            </div> -->
            <input name="agreed" type="checkbox" bind:checked={formValues.agreed} class="hidden" aria-hidden={true} required>
            <div class={[(getValidationError('agreed') === "") && "hidden"]}>
                {@render renderValidationErrorText(formItemsTouched.agreed ? getValidationError('agreed') : "")}
            </div>

            <p class="text-xs text-center">
                送信ボタンを押すことで<a href="/privacy-policy" target="_blank" class="inline-flex justify-center items-center inline-link">プライバシーポリシー<SvgIcon Svg={JumpIcon} size={20} /></a>に同意したものとみなされます。
                <br>なお、ご記入いただいた個人情報は、お問い合わせへの対応および本人確認以外には使用しません。
            </p>

            <!-- <p class="w-dvw text-center text-xs md:text-lg">送信ボタンを押すと即座に送信されます。<br>入力内容に誤りがないか、今一度ご確認ください。</p> -->
            <button type="submit" title="プライバシーポリシーに同意して送信" onclick={onSubmitButtonClick} class="group rounded-full button-general p-4 bg-label text-base hover:bg-label/80 active:bg-label/60">
                <div class="w-50 flex justify-start items-center">
                    <SvgIcon Svg={SendIcon} size={40} autoChangeByTheme={false} class="fill-base" />
                    <p class="flex-1 text-center text-xl">送信</p>
                </div>
            </button>
        </form>

        <div class="mt-10 p-2 border-label border rounded-2xl flex-col-center">
            <h3 class="">メールアドレス</h3>

            <MailAddress />
        </div>
    </article>
</section>

<style>
    @reference "../../../../routes/layout.css";

    @layer components {
        input {
            @apply w-full max-w-100;
        }

        label {
            @apply w-full max-sm:max-w-100 flex max-sm:flex-col justify-between items-center sm:items-start;
        }

        .invalid-input-label {
            @apply ring-2 ring-danger;
        }

        .optional-form-label {
            @apply m-1 text-nowrap text-lg max-sm:w-full max-w-100 sm:w-80 flex justify-between items-center;
        }

        .optional-form-label::after {
            @apply mx-1 mt-1 p-1 text-sm text-center content-['任意'] text-label bg-label/15 rounded-sm;
        }

        .required-form-label {
            @apply m-1 text-nowrap text-lg max-sm:w-full max-w-100 sm:w-80 flex justify-between items-center;
        }
        .required-form-label::after {
            @apply mx-1 w-5 h-5 -mt-3 text-4xl text-center content-['*'] text-danger/75;
        }

        .input-box {
            @apply w-full flex flex-col justify-center items-end;
        }
    }
</style>
