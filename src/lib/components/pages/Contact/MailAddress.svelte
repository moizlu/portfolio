<script lang="ts">
    import MailIcon from "$lib/assets/icons/mail.svelte";
    import JumpIcon from "$lib/assets/icons/jump.svelte";
    import CopyIcon from "$lib/assets/icons/copy.svelte";

    import { turnstileState } from "$lib/state/state.svelte";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    let addr: string | null = $state(null);

    const genAddr = () => {
        const parts = ["contact", "moizlu", "com"];
        return `${parts[0]}@${parts[1]}.${parts[2]}`;
    }

    const onDisplayMailButtonClick = () => {
        if (!mailAddrElement || !turnstileState.isVerified) { return; }

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
        if (!mailAddrElement || !turnstileState.isVerified) { return; }

        if (!addr) {
            addr = genAddr();
            mailAddrElement.textContent = addr;
        }
        window.navigator.clipboard.writeText(addr);
    }

    let mailAddrElement: HTMLParagraphElement | undefined = $state(undefined);
</script>

<div class="m-2 flex-center gap-2">
    <button onclick={onDisplayMailButtonClick} disabled={!turnstileState.isVerified} class="w-52 p-1 flex justify-start items-center button-general cursor-pointer">
        {#if addr}
            <SvgIcon Svg={JumpIcon} size={30} class="" />
        {:else}
            <SvgIcon Svg={MailIcon} size={30} class="" />
        {/if}
        <p bind:this={mailAddrElement}>メールアドレスを表示</p>
    </button>
    <button onclick={onMailCopyButtonClick} title="copy email" disabled={!turnstileState.isVerified} class="p-1 flex-center button-general cursor-pointer">
        <SvgIcon Svg={CopyIcon} size={30} />
        <p>コピー</p>
    </button>
</div>

<p class="m-1 text-xs text-center">添付ファイルがある場合やフォームが送信できない時は、<wbr>こちらに直接メールをお送りください。<br><span class={["text-sm", (turnstileState.isVerified) && "invisible"]}>(Bot認証を通過すると使用可能になります。)</span></p>
