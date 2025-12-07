<script lang="ts">
    import mailIcon from "$lib/assets/icons/contact.svelte";
    import copyIcon from "$lib/assets/icons/copy.svelte";
    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

    const mailParts = [
        "contact",
        "moizlu",
        "com"
    ];

    const onEmailCopyClicked = () => {
        navigator.clipboard.writeText(`${mailParts[0]}@${mailParts[1]}.${mailParts[2]}`);
    };
</script>

<section id="contact" class="h-screen scroll-mb-[70px] md:scroll-mt-[70px] pt-3 flex flex-col justify-start items-center">
    <h1>連絡先</h1>
    <!-- 仮 -->
    <div class="flex-col-center">
        <div class="flex-center">
            <SvgIcon Svg={mailIcon} size={40} />
            <h3 class="text-lg sm:text-3xl">メール(Bot防止のため非表示)</h3>

            <button type="button" title="コピー" onclick={onEmailCopyClicked} class="transition-all duration-300 cursor-pointer m-2 p-2 rounded-full bg-turn-on/30 hover:bg-turn-on/50 active:bg-turn-on/70 shadow-black shadow-md/50">
                <SvgIcon Svg={copyIcon} size={40} />
            </button>
        </div>
    </div>
</section>