<script lang="ts">
    // import mailIcon from "$lib/assets/icons/contact.svelte";
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import LoadingIcon from "$lib/assets/icons/loading.svelte";
    import CheckCircleIcon from "$lib/assets/icons/check-circle.svelte";
    import CrossCircle from "$lib/assets/icons/cross-circle.svelte";

    import SendIcon from "$lib/assets/icons/send.svelte";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";
    import type { PageProps } from "../../../../../routes/$types";
    import { slide } from "svelte/transition";

    import { dev } from "$app/environment";
    import { enhance } from "$app/forms";

    import { theme } from "$lib/state";
    import { dialog } from "$lib/components/ui/Dialog";
  import { onMount } from "svelte";

    const { form }: PageProps & {
        form?: {
            data: {
                name: string,
                email: string,
                subject: string,
                message: string
            }
        }
    } = $props();

    let isSending: boolean = $state(false);
    let status: number | undefined = $state(undefined);
    let resultType: "error" | "success" | "redirect" | "failure" | "none" = $state("none");

    onMount(() => {
        dialog.activate({
            content: submitFailedDialog,
            id: "submit-complete",
            isModal: true,
            isDrawWindow: true,
        })
    })
</script>

{#snippet submitDialog()}
    <div class="flex-col-center">
        <SvgIcon Svg={LoadingIcon} size={100} class="animate-spin" />
        <p class="text-2xl">送信中......</p>
    </div>
{/snippet}

<!-- 送信成功 -->
{#snippet submitCompleteDialog()}
    <div class="w-full flex flex-col justify-between items-center gap-2">
        <div class="flex-col-center">
            <SvgIcon Svg={CheckCircleIcon} size={200} autoChangeByTheme={false} class="fill-success" />
            <p class="text-2xl">送信が完了しました。</p>
        </div>
        <button onclick={() => dialog.deactivate()} class="px-10 p-2 button-general bg-turn-on/50 hover:bg-turn-on/30 active:bg-turn-on/10">
            <p>OK</p>
        </button>
    </div>
{/snippet}

<!-- 送信失敗 -->
{#snippet submitFailedDialog()}
    <div class="w-full flex flex-col justify-between items-center gap-2">
        <div class="flex-col-center">
            <SvgIcon Svg={CrossCircle} size={200} autoChangeByTheme={false} class="fill-danger" />
            <p class="text-2xl">送信に失敗しました。</p>
        </div>
        {#if resultType === "failure"}
            {#if status === 400}
                {#if typeof form?.error === 'string'}
                    <p>{form?.error}</p>
                {:else}
                    <p>入力内容に誤りがあります。</p>
                {/if}
            {:else}
                    {#if form?.email}
                        <p class="text-center">お手数ですが、再試行するか<br>以下のメールアドレスから直接ご連絡を<br>お願いします。</p>
                        <div class="flex-center gap-4">
                            <a href={`mailto:${form.email}`} class="button-general p-2">{form.email}</a>
                            <button type="button" title="copy" onclick={() => window.navigator.clipboard.writeText(form.email as unknown as string)} class="cursor-pointer">
                                <SvgIcon Svg={CopyIcon} size={40} />
                            </button>
                        </div>
                    {:else}
                        <p class="text-center">サーバーとの通信に失敗しました。<br>ネットワーク環境を確認してください。</p>
                    {/if}
            {/if}
        {:else if resultType === "error"}
            <p class="text-center">サーバーとの通信に失敗しました。<br>ネットワーク環境を確認してください。</p>
        {/if}
        <button onclick={() => dialog.deactivate()} class="px-10 p-2 button-general bg-turn-on/50 hover:bg-turn-on/30 active:bg-turn-on/10">
            <p>OK</p>
        </button>
    </div>
{/snippet}

<section id="contact" class="h-screen scroll-mb-[70px] md:scroll-mt-[70px] pt-3 pb-300 flex flex-col justify-start items-center">
    <h1>お問い合わせ</h1>
    <div class="flex-col-center">
        <form method="POST" use:enhance={() => {
            dialog.activate({
                id: "form-submit",
                content: submitDialog,
                isDrawWindow: false,
                isModal: true
            })
            isSending = true;

            return async ({ result, update }) => {
                isSending = false;
                resultType = result.type;
                status = result.status;

                dialog.deactivate();
                switch (resultType) {
                    case 'success':
                        dialog.activate({
                            content: submitCompleteDialog,
                            id: "submit-complete",
                            isModal: true,
                            isDrawWindow: true,
                        });
                        break;
                    case 'failure':
                    case 'error':
                        dialog.activate({
                            content: submitFailedDialog,
                            id: "submit-filed",
                            isModal: true,
                            isDrawWindow: true,
                        });
                }

                await update({ reset: false });
            }
        }}
        class="flex-col-center gap-2">
            <label class="w-full flex max-md:flex-col justify-between items-start gap-2">
                <div class="flex-1 w-full flex justify-between items-center md:mt-1 required-form-label text-xl">
                    <p class="flex-1 flex justify-between items-center">
                        お名前
                        <span class="text-sm">(50文字以内)</span>
                    </p>
                </div>

                <div class="flex-col-center">
                    <input type="text" name="name" maxlength={50} required value={form?.data?.name ?? ""} placeholder="" class="w-80 md:w-110">
                    {#if (form?.error as any)?.name}
                        <p transition:slide={{duration:300}} class="text-danger">{(form?.error as any)?.name.errors[0]}</p>
                    {/if}
                </div>
            </label>
            <label class="w-full flex max-md:flex-col justify-between items-start gap-2">
                <div class="flex-1 w-full flex justify-between items-center md:mt-1 required-form-label text-xl">
                    <p class="flex-1 flex justify-between items-center">
                        メールアドレス
                        <span class="text-sm">(100文字以内)</span>
                    </p>
                </div>
                <div class="flex-col-center">
                    <input type="email" name="email" maxlength={100} required value={form?.data?.email ?? ""} placeholder="" class="w-80 md:w-110">
                    {#if (form?.error as any)?.email}
                        <p transition:slide={{duration:300}} class="text-danger">{(form?.error as any)?.email.errors[0]}</p>
                    {/if}
                </div>
            </label>
            <label class="w-full flex max-md:flex-col justify-between items-start gap-2">
                <div class="flex-1 w-full flex justify-between items-center md:mt-1 required-form-label text-xl">
                    <p class="flex-1 flex justify-between items-center">
                        件名
                        <span class="text-sm">(100文字以内)</span>
                    </p>
                </div>
                <div class="flex-col-center">
                    <input type="text" name="subject" maxlength={100} required value={form?.data?.subject ?? ""} placeholder="" class="w-80 md:w-110">
                    {#if (form?.error as any)?.subject}
                        <p transition:slide={{duration:300}} class="text-danger">{(form?.error as any)?.email.subject[0]}</p>
                    {/if}
                </div>
            </label>
            <label class="w-full flex max-md:flex-col justify-between items-start gap-2">
                <div class="flex-1 flex justify-between items-center md:mt-1 required-form-label text-xl">
                    <p class="flex-1 flex justify-between items-center">
                        お問い合わせ内容
                        <span class="text-sm">(2000文字以内)</span>
                    </p>
                </div>
                <div class="flex-col-center">
                    <textarea name="message" rows={10} maxlength={2000} required value={form?.data?.message ?? ""} class="w-80 md:w-110 resize-y"></textarea>
                    {#if (form?.error as any)?.message}
                        <p transition:slide={{duration:300}} class="text-danger">{(form?.error as any)?.email.message[0]}</p>
                    {/if}
                </div>
            </label>

            {#if dev}
                <p>[Turnstileのウィジェット]</p>
            {:else}
                <div class="cf-turnstile" data-sitekey={PUBLIC_TURNSTILE_SITE_KEY} data-theme={theme.init()}></div>
            {/if}

            <button type="submit" class="p-2 w-40 flex justify-start items-center button-general bg-turn-on/50 hover:bg-turn-on/30 active:bg-turn-on/10">
                <SvgIcon Svg={SendIcon} size={40} />
                <p class="flex-1 text-center text-xl">送信</p>
            </button>

            <!-- <pre>{JSON.stringify(form, null, 2)}</pre> -->
        </form>
    </div>
</section>

<style>
    @reference "../../../../../routes/layout.css";

    @layer components {
        .required-form-label::after {
            @apply p-1 m-1 text-sm rounded-md content-['必須'] bg-danger/50;
        }
    }

    /* @layer components {
        .form-item {
            @apply max-md:flex-col flex justify-between;
        }

        .form-label {
            @apply w-full md:w-60;
        }
    } */
</style>
