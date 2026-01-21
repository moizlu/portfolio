<script lang="ts">
    // import mailIcon from "$lib/assets/icons/contact.svelte";
    // import copyIcon from "$lib/assets/icons/copy.svelte";
    // import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

    import { enhance } from "$app/forms";

    import { getTheme } from "$lib/utils/theme.svelte";

    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";

    let formElement: HTMLFormElement | undefined = undefined;
    let formItems: (HTMLInputElement | HTMLTextAreaElement | undefined)[] = [];

    const mailParts = [
        "contact",
        "moizlu",
        "com"
    ];
    const onEmailCopyClicked = () => {
        navigator.clipboard.writeText(`${mailParts[0]}@${mailParts[1]}.${mailParts[2]}`);
    };

    const onSubmitButtonClicked = () => {
        if (!formElement) { return; }

        let error = false;

        for (let item of formItems) {
            if (!item) { continue; }

            if (item.required && !item.value) {
                error = true;
                break;
            }

            switch (item.type) {
                case 'email':
                case '':
            };
        }

        // formElement.submit();
    };
</script>

{#snippet requiredBadge()}
    <span class="text-sm bg-danger/50 px-2 py-1 rounded-full">必須</span>
{/snippet}

<section id="contact" class="h-screen scroll-mb-[70px] md:scroll-mt-[70px] pt-3 pb-300 flex flex-col justify-start items-center">
    <h1>お問い合わせ</h1>
    <!-- 仮 -->
    <div class="flex-col-center">
        <!-- <div class="flex-center">
            <SvgIcon Svg={mailIcon} size={40} />
            <h3 class="text-lg sm:text-3xl">メール(Bot防止のため非表示)</h3>

            <button type="button" title="コピー" onclick={onEmailCopyClicked} class="transition-all duration-300 cursor-pointer m-2 p-2 rounded-full bg-turn-on/30 hover:bg-turn-on/50 active:bg-turn-on/70 shadow-black shadow-md/50">
                <SvgIcon Svg={copyIcon} size={40} />
            </button>

        </div> -->

        <form method="POST" use:enhance>
            <input type="text" name="name" required placeholder="名前">
            <input type="text" name="email" required placeholder="メアド">
            <input type="text" name="message" required placeholder="内容">

            <div class="cf-turnstile" data-sitekey={PUBLIC_TURNSTILE_SITE_KEY} data-theme={getTheme()}></div>

            <button type="submit">送信</button>
        </form>
    </div>
</section>

<style>
    @reference "../../../../../routes/layout.css";

    /* @layer components {
        .form-item {
            @apply max-md:flex-col flex justify-between;
        }

        .form-label {
            @apply w-full md:w-60;
        }
    } */
</style>