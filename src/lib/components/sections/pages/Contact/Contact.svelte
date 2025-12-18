<script lang="ts">
    import mailIcon from "$lib/assets/icons/contact.svelte";
    import copyIcon from "$lib/assets/icons/copy.svelte";
    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

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
        <div class="flex-center">
            <SvgIcon Svg={mailIcon} size={40} />
            <h3 class="text-lg sm:text-3xl">メール(Bot防止のため非表示)</h3>

            <button type="button" title="コピー" onclick={onEmailCopyClicked} class="transition-all duration-300 cursor-pointer m-2 p-2 rounded-full bg-turn-on/30 hover:bg-turn-on/50 active:bg-turn-on/70 shadow-black shadow-md/50">
                <SvgIcon Svg={copyIcon} size={40} />
            </button>
        </div>
<!-- 
        <form bind:this={formElement} class="flex-col-center">
            <div class="form-item items-start md:items-center">
                <label for="form-name" class="form-label">
                    <p class="flex justify-between items-center text-xl">お名前{@render requiredBadge()}</p>
                </label>
                <input id="form-name" type="text" required bind:this={formItems[0]} class="input-general m-2 w-80 sm:w-100">
            </div>
            <div class="form-item items-start md:items-center">
                <label for="form-address" class="form-label">
                    <p class="flex justify-between items-center text-xl">メールアドレス{@render requiredBadge()}</p>
                </label>
                <input id="form-address" type="email" required bind:this={formItems[1]} class="input-general m-2 w-80 sm:w-100">
            </div>
            <div class="form-item items-start md:items-center">
                <label for="form-title" class="form-label">
                    <p class="flex justify-between items-center text-xl">件名<span class="text-sm"></span></p>
                </label>
                <input id="form-title" type="text" bind:this={formItems[2]} class="input-general m-2 w-80 sm:w-100">
            </div>
            <div class="form-item items-start">
                <label for="form-content" class="form-label mt-5">
                    <p class="flex justify-between items-center text-xl">お問い合わせ内容{@render requiredBadge()}</p>
                </label>
                <textarea id="form-content" required bind:this={formItems[3]} class="input-general m-2 text-start w-80 sm:w-100 h-100 scroll-auto"></textarea>
            </div>
            <button type="button" onclick={onSubmitButtonClicked} class="button-general m-2 p-2 w-80 sm:w-100 bg-turn-on/30">送信</button>
            <p class="text-center">｢moizlu.com｣からのメールが受信できるように<br class="block sm:hidden">設定をお願いします。</p>
        </form>
    </div> -->
</section>

<style>
    @reference "../../../../../routes/layout.css";

    @layer components {
        .form-item {
            @apply max-md:flex-col flex justify-between;
        }

        .form-label {
            @apply w-full md:w-60;
        }
    }
</style>