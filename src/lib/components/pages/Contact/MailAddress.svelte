<script lang="ts">
    import MailIcon from "$lib/assets/icons/mail.svelte";
    import JumpIcon from "$lib/assets/icons/jump.svelte";
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";

    // import { turnstileState } from "$lib/state/state.svelte";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    let addr: string | null = $state(null);
    let isCopied = $state(false);

    const genAddr = () => {
        const parts = ["contact", "moizlu", "com"];
        return `${parts[0]}@${parts[1]}.${parts[2]}`;
    }

    const onDisplayMailButtonClick = () => {
        if (!mailAddrElement) { return; }

        if (mailAddrElement.textContent === addr) {
            const a = document.createElement('a');
            a.href = `mailto:${addr}`;
            a.click();
        } else {
            addr = genAddr();
            mailAddrElement.textContent = addr;
        }
    }

    const onMailCopyButtonClick = () => {
        if (!mailAddrElement) { return; }

        if (!addr) {
            addr = genAddr();
            mailAddrElement.textContent = addr;
        }
        window.navigator.clipboard.writeText(addr);

        isCopied = true;
        setTimeout(() => {
            isCopied = false;
        }, 3000);
    }

    let mailAddrElement: HTMLParagraphElement | undefined = $state(undefined);
</script>

<div class="m-2 w-full h-10 flex-center gap-2">
    <button onclick={onDisplayMailButtonClick} class="w-52 h-full p-1 flex justify-start items-center button-general cursor-pointer">
        {#if addr}
            <SvgIcon Svg={JumpIcon} size={30} class="" />
        {:else}
            <SvgIcon Svg={MailIcon} size={30} class="" />
        {/if}
        <p bind:this={mailAddrElement} class="">メールアドレスを表示</p>
    </button>
    <button onclick={onMailCopyButtonClick} title="copy email" class="p-1 h-full flex-center button-general cursor-pointer overflow-clip">
        <div class={["transition-all duration-600 flex-col-center", (isCopied) ? "-translate-y-4" : "translate-y-4"]}>
            <SvgIcon Svg={CopyIcon} size={30} />
            <SvgIcon Svg={CheckIcon} size={30} />
        </div>
        <p>コピー</p>
    </button>
</div>

<p class="m-1 text-xs text-center">添付ファイルがある場合や<br class="2xs:hidden">フォームが送信できない時は、<br class="sm:hidden">こちらに直接メールをお送りください。</p>
