<script lang="ts">
    import LoadingIcon from "$lib/assets/icons/loading.svelte";
    import SendIcon from "$lib/assets/icons/send.svelte";
    import CheckCircleIcon from "$lib/assets/icons/check-circle.svelte";
    import CrossCircleIcon from "$lib/assets/icons/cross-circle.svelte";

    import type { PageProps } from "../../../../routes/(app)/$types";
    import { enhance } from "$app/forms";

    import SvgIcon from "$lib/components/ui/SvgIcon";
    import Turnstile from "$lib/components/ui/Turnstile";
    import MailAddress from "./MailAddress.svelte";
    import { dialog } from "$lib/components/ui/Dialog";
    import { slide } from "svelte/transition";
    import { turnstileState } from "$lib/state/state.svelte";

    const { form }: PageProps & {
        form?: {
            data: {
                name: string,
                email: string,
                subject: string,
                message: string
            },

            error?: string,

            validationError?: {
                name?: { errors: string[] }
                email?: { errors: string[] }
                subject?: { errors: string[] }
                message?: { errors: string[] }
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
        message: ''
    });

    const maxLength: Readonly<Record<string, number>> = {
        name:      50,
        email:    100,
        subject:  100,
        message: 2000
    };

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

        turnstile.reset('#turnstile-container');

        dialog.activate({
            id: "submission-ended",
            content: formSubmissionEnded,
            isDrawWindow: true,
            isModal: true,
            requireContrast: true
        })
    }
</script>

{#snippet formSubmissionCompleted()}
    <SvgIcon Svg={CheckCircleIcon} size={100} autoChangeByTheme={false} class="fill-success" />
    <p class="text-2xl">送信が完了しました。</p>
    <button onclick={() => dialog.deactivate()} class="p-2 flex justify-start items-center button-general button-bg-turn-on cursor-pointer">
        <SvgIcon Svg={CheckCircleIcon} size={30} />
        <p class="flex-1 text-center">OK</p>
    </button>
{/snippet}

{#snippet formSubmissionFailed()}
    <SvgIcon Svg={CrossCircleIcon} size={100} autoChangeByTheme={false} class="fill-danger" />
    <p class="text-2xl">送信に失敗しました。</p>
    <p class="text-xs">エラーコード: {actionState.status}</p>
    <p class="text-md">{form?.error}</p>

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
    <p class="text-xs">{Math.max(maxLength - currentLength, 0)}/{maxLength}文字</p>
    <!-- <div class="flex-center text-xs">
        <p>{}</p>
        <p class="text-right">/{maxLength}文字</p>
    </div> -->
{/snippet}

<section id="contact" class="min-h-screen h-fit flex flex-col justify-start items-center whitespace-pre">
    <article id="contact-content" class="mt-5 mb-50 w-full section-default flex flex-col justify-start items-center">
        <h1>お問い合わせ</h1>

        <MailAddress />

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

                await update({ reset: true });
            };
        }} class="my-2 w-[95%] max-w-150 flex-col-center gap-4">

            <!-- 名前欄  -->
            <label>
                <p class="required-form-label">お名前</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="text" name="name" placeholder="例: 田中太郎" maxlength={maxLength.name} bind:value={formValues.name} required>
                        {@render displayRemainingCharNum(maxLength.name, formValues.name.length)}
                    </div>
                    {#if form?.validationError?.name}
                        <p transition:slide={{duration:300, axis: 'y'}} class="text-danger">{form?.validationError?.name?.errors[0]}</p>
                    {/if}
                </div>
            </label>
            <!-- メアド -->
            <label>
                <p class="required-form-label">メールアドレス</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="email" name="email" placeholder="例: example@example.com" maxlength={maxLength.email} bind:value={formValues.email} required>
                        {@render displayRemainingCharNum(maxLength.email, formValues.email.length)}
                    </div>
                    {#if form?.validationError?.email}
                        <p transition:slide={{duration:300, axis: 'y'}} class="text-danger">{form?.validationError?.email.errors[0]}</p>
                    {/if}
                </div>
            </label>
            <!-- 件名 -->
            <label>
                <p class="required-form-label">件名</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <input type="text" name="subject" maxlength={maxLength.subject} bind:value={formValues.subject} required>
                        {@render displayRemainingCharNum(maxLength.subject, formValues.subject.length)}
                    </div>
                    <!-- form?.error.email.errors[0] -->
                    {#if form?.validationError?.subject}
                        <p transition:slide={{duration:300, axis: 'y'}} class="text-danger">{form?.validationError?.subject.errors[0]}</p>
                    {/if}
                </div>
            </label>
            <!-- 本文 -->
            <label>
                <p class="required-form-label">お問い合わせ内容</p>
                <div class="w-full flex-col-center">
                    <div class="input-box">
                        <textarea name="message" rows={10} maxlength={maxLength.message} bind:value={formValues.message} required class="resize-y w-full"></textarea>
                        {@render displayRemainingCharNum(maxLength.message, formValues.message.length)}
                    </div>
                    {#if form?.validationError?.message}
                        <p transition:slide={{duration:300, axis: 'y'}} class="text-danger">{form?.validationError?.message?.errors[0]}</p>
                    {/if}
                </div>
            </label>

            <Turnstile />

            <p class="text-center text-xs">送信完了後、@moizlu.comのアドレスから<br class="sm:hidden">自動返信メールを送信させていただきます。
                <br>迷惑メールボックスを含めてご確認ください。
                <br>数分経っても届かない場合は再送が可能です。<br class="sm:hidden">(ただし、レート制限がございますので<br class="2xs:hidden">ご注意ください。)
                <br>エラーが解消しない場合、<br class="2xs:hidden">上のボタンから直接メールをお送りください。</p>

            <button type="submit" title="send form" disabled={!turnstileState.isVerified} class="group button-general p-2 enabled:bg-turn-on/30 enabled:hover:bg-turn-on/50 active:bg-turn-on/70">
                <div class="w-50 flex justify-start items-center">
                    <SvgIcon Svg={SendIcon} size={40} />
                    <p class="flex-1 text-center text-xl">送信</p>
                </div>
            </button>
        </form>
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

        .required-form-label {
            @apply m-1 text-nowrap text-lg max-sm:w-full max-w-100 sm:w-80 flex justify-between items-center;
        }
        .required-form-label::after {
            @apply p-1 m-1 text-sm rounded-md content-['必須'] bg-danger/50;
        }

        .input-box {
            @apply w-full flex flex-col justify-center items-end;
        }
    }
</style>
