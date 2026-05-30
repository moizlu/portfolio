<script lang="ts">
    import SendIcon from "$lib/assets/icons/send.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";
    import CrossIcon from "$lib/assets/icons/close.svelte";
    import WarningIcon from "$lib/assets/icons/warning.svelte";

    import type { PageProps } from "../../../../routes/$types";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { resolve } from "$app/paths";

    import { enhance } from "$app/forms";
    import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";

    import LoadingAnimation from "$lib/components/ui/LoadingAnimation";
    import SvgIcon from "$lib/components/ui/SvgIcon";
    import { captchaStore, modalWindow } from "$lib/store";
    import { formActionStore as actionStore } from "$lib/store";
    import { contactForm } from "$lib/schema";
    import CAPTCHA from "$lib/components/ui/CAPTCHA";
    import type { Fields } from "$lib/schema/contact-form";

    import MailAddress from "./MailAddress.svelte";
    const { form }: PageProps = $props();

    // フォーム関連の情報
    const formStore = $state({
        name: { value: '', touched: false},
        email: { value: '', touched: false},
        subject: { value: '', touched: false},
        message: { value: '', touched: false},
        agreed: { value: false, touched: false}
    });

    let savedFormStore: Fields = $state({ name: "", email: "", subject: "", message: "", agreed: false });

    let initialized = $state(false);

    // 入力フィールドのバリデーション
    let validator = $derived(contactForm.schema.safeParse(Object.fromEntries(Object.entries(formStore).map(([key, obj]) => [key, obj.value])), { reportInput: true }));

    // バリデーションエラーを`{ フィールド名: メッセージ }`の形に整形
    let validationError = $derived.by(() => {
        if (validator.error) {
            return Object.fromEntries(Object.entries(validator.error.issues).map(([, issue]) => [issue.path[0], issue.message]))
        }

        return undefined;
    });

    // 送信結果を分類
    let submissionResult: "SUCCESS" | "WARNING" | "ERROR" = $derived.by(() => {
        if (form?.success) { return "SUCCESS"; }
        if (form?.error === "FAILED_REPLY_SENDING") {
            return "WARNING";
        }
        return "ERROR"
    });

    // 結果に表示するアイコンの情報
    let submittedIcon = $derived.by(() => {
        switch (submissionResult) {
            case "SUCCESS":
                return { icon: CheckIcon, color: "text-success" }
            case "WARNING":
                return { icon: WarningIcon, color: "text-warning" }
            default:
                return { icon: CrossIcon, color: "text-danger" }
        }
    });

    const onChangeField = (name: keyof Fields) => {
        return (event: Event & { currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement); }) => {
            if (name === "agreed") {
                savedFormStore.agreed = (event.currentTarget as HTMLInputElement).checked;
            } else {
                savedFormStore[name] = event.currentTarget.value;
            }
        }
    }

    // フィールドに触った判定(バリデーションを表示する)
    const setTouched = (name: keyof Fields) => {
        return (event: Event & { currentTarget: EventTarget & (HTMLInputElement | HTMLTextAreaElement); }) => {
            formStore[name].touched = true;
            onChangeField(name)(event);
        }
    }

    // バリデーションを表示するかどうか
    const isDisplayError = (field: keyof Fields) => {
        return formStore[field].touched && validationError?.[field];
    }

    // 送信ボタンが押された時
    const onSubmitClick = () => {
        // 送信ボタンを押した時点でプライバシーポリシーに同意した扱いになる
        formStore.agreed.value = true;

        // 全てのフィールドのバリデーション表示を有効にする
        for (const key of Object.keys(formStore) as Array<keyof typeof formStore>) {
            formStore[key].touched = true;
        }
    }

    // 送信スタート
    const onSubmissionStart = () => {
        modalWindow.open({
            contents: submittingModal,
            lock: true,
            window: {
                controls: false,
                mode: "window"
            }
        })
    }

    // 終了
    const onSubmissionEnded = () => {
        if (actionStore.type === "success") {
            for (const key of Object.keys(formStore) as Array<keyof typeof formStore>) {
                formStore[key].touched = false;
                if (key === "agreed") {
                    savedFormStore.agreed = false;
                } else {
                    savedFormStore[key] = "";
                }
            }
        }
    }

    $effect(() => {
        if (!initialized) { return; }
        localStorage.setItem("contact-form-fields", JSON.stringify(savedFormStore));
    })

    onMount(() => {
        try {
            savedFormStore = JSON.parse(localStorage.getItem("contact-form-fields") ?? "");
            for (const key of Object.keys(formStore) as Array<keyof typeof formStore>) {
                formStore[key].value = savedFormStore[key] ?? "";
            }
        } catch { /***/ }

        initialized = true;
    });
</script>

<!-- 残りの文字素数を表示 -->
{#snippet displayRemainingCharNum(length: number, max: number)}
    <p class="w-full -mt-2 text-right text-xs">{length}/{max}{m.characters()}</p>
{/snippet}

<!-- バリデーションエラー -->
{#snippet displayValidationError(field: keyof Fields)}
    <p class={["h-4 text-danger", (isDisplayError(field)) ? "opacity-100" : "opacity-0"]}>
        {validationError?.[field]}
    </p>
{/snippet}

<!-- 送信中に表示するモーダル -->
{#snippet submittingModal()}
    <div class="flex flex-col justify-center items-center">
        {#if actionStore.submitting} <!-- 送信中 -->
            <LoadingAnimation />
            <p class="text-2xl">{m.sending()}...</p>
        {:else} <!-- 完了 -->
            <div transition:fade={{duration: 300}} class="flex flex-col justify-center items-center gap-5">
                {#if submissionResult === "SUCCESS"}
                    <h1>送信成功</h1>
                {:else}
                    <h1>送信失敗</h1>
                {/if}

                <SvgIcon Svg={submittedIcon.icon} size={200} class={submittedIcon.color} />

                <!-- 結果 -->
                <div class="text-center text-xs md:text-sm px-4">
                    {#if getLocale() === "ja"}
                        {#if submissionResult === "SUCCESS"}
                            <p class="mb-3">送信に成功しました。</p>
                            <p>お問い合わせありがとうございます。</p>
                        {:else}
                            {#if form?.error === "INVALID_FIELD_VALUE"}
                                <p class="mb-3">フォームの入力内容に不備があります。</p>
                                <p>お手数ですが、もう一度お試しいただくか、メールアドレス/DMよりご連絡ください。</p>
                            {:else if form?.error === "FAILED_CAPTCHA"}
                                <p class="mb-3">CAPTCHA(Bot認証)に失敗しました。</p>
                                <p>お手数ですが、もう一度お試しいただくか、メールアドレス/DMよりご連絡ください。</p>
                            {:else if form?.error === "FAILED_INQUIRY_SENDING"}
                                <p class="mb-3">お問い合わせの送信に失敗しました。</p>
                                <p>お手数ですが、もう一度お試しいただくか、メールアドレス/DMよりご連絡ください。</p>
                            {:else if form?.error === "FAILED_REPLY_SENDING"}
                                <p class="mb-3">お問い合わせの送信には成功しましたが、入力されたアドレスへの自動送信メールの送信に失敗しました。</p>
                                <p>メールアドレスをご確認ください。</p>
                                <p class="mb-3">間違っている場合は正しいメールアドレスで再送をお願いいたします。</p>
                                <p>合っている場合、再送は不要です。</p>
                                <p>その場合、お手数ですが受付番号を控えていただくと今後のやりとりがスムーズになります。</p>
                            {:else if form?.error === "REACHED_RATE_LIMIT"}
                                <p class="mb-3">レート制限に達しました。</p>
                                <p>お手数ですが、時間をおいてお試しいただくか、メールアドレス/DMよりご連絡ください。</p>
                            {:else}
                                <p class="mb-3">サーバーとの通信に失敗しました。</p>
                                <p>お手数ですが、インターネット接続を確認したうえでもう一度お試しいただくか、メールアドレス/DMよりご連絡ください。</p>
                            {/if}
                        {/if}
                    {:else}
                        {#if submissionResult === "SUCCESS"}
                            <p class="mb-3">Your message has been sent successfully.</p>
                            <p>Thank you for your inquiry.</p>
                        {:else}
                            {#if form?.error === "INVALID_FIELD_VALUE"}
                                <p class="mb-3">There is an error in the form submission.</p>
                                <p>Apologize for the inconvenience.<br>Please try again, or contact me via email or DM.</p>
                            {:else if form?.error === "FAILED_CAPTCHA"}
                                <p class="mb-3">You failed the CAPTCHA (bot verification).</p>
                                <p>Apologize for the inconvenience.<br>Please try again, or contact me via email or DM.</p>
                            {:else if form?.error === "FAILED_INQUIRY_SENDING"}
                                <p class="mb-3">It was unable to send your inquiry.</p>
                                <p>Apologize for the inconvenience.<br>Please try again, or contact me via email or DM.</p>
                            {:else if form?.error === "FAILED_REPLY_SENDING"}
                                <p class="mb-3">Your inquiry was successfully submitted,<br>but it was unable to send the automatic confirmation email to the address you provided.</p>
                                <p>Please check your email address.</p>
                                <p class="mb-3">If the email address is incorrect, please resend it using the correct one.</p>
                                <p>If this is correct, there is no need to resend it.</p>
                                <p>In that case, please make a note of your reference number; this will help ensure a smooth process moving forward.</p>
                            {:else if form?.error === "REACHED_RATE_LIMIT"}
                                <p class="mb-3">You have reached the rate limit.</p>
                                <p>Apologize for the inconvenience. Please try again later, or contact us via email or DM.</p>
                            {:else}
                                <p class="mb-3">Communication with the server failed.</p>
                                <p>Apologize for the inconvenience.<br>Please try again, or contact me via email or DM.</p>
                            {/if}
                        {/if}
                    {/if}
                </div>

                <!-- 閉じるボタン -->
                <button onclick={() => { modalWindow.close() }} class="transition-all duration-300 w-50 flex justify-center items-center bg-label text-base cursor-pointer rounded-lg hover:scale-110">
                    <SvgIcon Svg={CheckIcon} size={50} />
                    <p class="flex-1 text-2xl">OK</p>
                </button>
            </div>
        {/if}
    </div>
{/snippet}

<section id="contact" class="min-h-dvh bg-base-accent py-20 flex flex-col justify-center items-center px-4">
    <h1>{m.contact()}</h1>

    {#if getLocale() === "ja"}
        <p class="mb-7">以下のフォーム、メールアドレス、またはX(<a title="X(Twitter)" href="https://moiz.lu/x" target="_blank" class="inline-link">@moizlu ↗</a>)のDMよりご連絡ください。</p>
    {:else}
        <p class="mb-7">Please contact me via the form below, email address, or direct message to X(<a title="X(Twitter)" href="https://moiz.lu/x" target="_blank" class="inline-link">@moizlu</a>).</p>
    {/if}

    <MailAddress />

    <h2>{m.contact_form()}</h2>

    <!-- フォーム本体 -->
    <form method="POST" action="?/submitContactForm" use:enhance={() => {
        actionStore.submitting = true;
        onSubmissionStart();

        return async ({ result, update }) => {
            // modalWindow.close();
            setTimeout(() => {
                actionStore.submitting = false;
            }, 1000)
            actionStore.status = result.status;
            actionStore.type = result.type;
            onSubmissionEnded();

            if (actionStore.type !== "error") {
                await update({ reset: true });
            }
        };
    }} class="w-full max-w-150 flex flex-col justify-center items-center gap-4">

        <!-- 名前 -->
        <div>
            <h3>{m.your_name()}</h3>
            <label class={["text-field", (isDisplayError("name")) && "validation-error"]}>
                <input bind:value={formStore.name.value} name="name" type="text" onblur={setTouched("name")} oninput={setTouched("name")} />
            </label>
            {@render displayRemainingCharNum(formStore.name.value.length, contactForm.maxLength.name)}
            {@render displayValidationError("name")}
        </div>
        <!-- 件名 -->
        <div>
            <h3>{m.subject()}</h3>
            <label class={["text-field", (isDisplayError("subject")) && "validation-error"]}>
                <input bind:value={formStore.subject.value} name="subject" type="text" onblur={setTouched("subject")} oninput={setTouched("subject")} />
            </label>
            {@render displayRemainingCharNum(formStore.subject.value.length, contactForm.maxLength.subject)}
            {@render displayValidationError("subject")}
        </div>
        <!-- メアド -->
        <div>
            <h3>{m.email_address()}</h3>
            <label class={["text-field", (isDisplayError("email")) && "validation-error"]}>
                <input bind:value={formStore.email.value} name="email" type="email" onblur={setTouched("email")} onchange={onChangeField("email")} required />
            </label>
            {@render displayRemainingCharNum(formStore.email.value.length, contactForm.maxLength.email)}
            {@render displayValidationError("email")}
        </div>
        <!-- 内容 -->
        <div>
            <h3>{m.inquiry_details()}</h3>
            <label class={["text-field", (isDisplayError("message")) && "validation-error"]}>
                <textarea bind:value={formStore.message.value} rows={10} name="message" onblur={setTouched("message")} oninput={setTouched("message")} class="resize-y" required ></textarea>
            </label>
            {@render displayRemainingCharNum(formStore.message.value.length, contactForm.maxLength.message)}
            {@render displayValidationError("message")}
        </div>

        <input type="hidden" name="agreed" value="true" required> <!-- プライバシーポリシーへの同意 -->

        <!-- CAPTCHAエラーの位置合わせ用コンテナ -->
        <div class="relative">
            <CAPTCHA />
            <!-- 多分手動でチェックしないとだめなので、認証出来たら任意フィールドに変更して対応 -->
            <input type="checkbox" value={captchaStore.verified} class="absolute bottom-0 left-[50%] pointer-events-none" required={!captchaStore.verified} />
        </div>

        <p class={["h-4 text-danger", (formStore.agreed.touched && !captchaStore.verified) ? "opacity-100" : "opacity-0"]}>{m.require_captcha()}</p>

        <!-- {@render displayValidationError("agreed")} -->

        <p class="text-sm text-center">送信完了後、@moizlu.comのアドレスから<br class="sm:hidden">受付メールを送信させていただきます。
            <!-- <br>迷惑メールボックスを含めてご確認ください。 -->
            <br><span class="text-xs text-center">届かない場合はメールアドレスをご確認の上、お手数ですが再送するかメールアドレスより直接お問い合わせください。</span>
        </p>

        <p class="text-xs text-center">送信ボタンを押すことで
            <a target="_blank" href={resolve("/privacy-policy")} class="inline-link">プライバシーポリシー↗</a>
            に同意したものとみなされます。<br>なお、ご記入いただいた個人情報は、お問い合わせへの対応および本人確認以外には使用しません。</p>

        <button type="submit" title={m.submit_form()} onclick={onSubmitClick} class="group transition-all duration-200 w-50 p-2 flex justify-center items-center text-2xl bg-label text-base rounded-xl cursor-pointer shadow-black shadow-md/50 hover:shadow-none">
            <SvgIcon Svg={SendIcon} size={40} class="" />
            <p class="flex-1">{m.send()}</p>
        </button>
    </form>
</section>

<style>
    @reference "../../../../routes/layout.css";

    @layer components {
        form > div:has(label) {
            @apply w-full flex flex-col gap-2;
        }

        form > div > label > input, textarea {
            @apply w-full;
        }

        form > div:has(input, textarea) > h3 {
            @apply w-50 text-xl;
        }

        form > div:has(input:required, textarea:required) > h3 {
            @apply relative after:content-["*"] after:absolute after:top-0 after:right-0 after:text-danger after:text-5xl;
        }

        /* クラスにするとうまく出来ない */

        .validation-error {
            @apply ring-danger ring-2 rounded-sm;
        }
    }

    form > div:has(input:optional, textarea:optional) > h3 {
        @apply relative after:content-["任意|Optional"] after:absolute after:top-1 after:right-0 after:bg-label/50 after:text-base after:text-xs after:p-1 after:rounded-sm;
    }

</style>
