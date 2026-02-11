<script lang="ts">
    import SendIcon from "$lib/assets/icons/send.svelte";
    import { onMount } from "svelte";
    import SvgIcon from "$lib/components/ui/SvgIcon";
    import { turnstileState } from "$lib/state/state.svelte";

    const LONG_PRESS_THRESHOLD = 500;

    let submitButtonElement: HTMLButtonElement | undefined = $state(undefined);
    let pressingAnimationElement: HTMLDivElement | undefined = $state(undefined);

    let longPressTimerId: NodeJS.Timeout | undefined = $state(undefined);

    const onpointerdown = () => {
        if (!submitButtonElement || !pressingAnimationElement) { return; }

        pressingAnimationElement.style.transitionDuration = `${LONG_PRESS_THRESHOLD}ms`;
        pressingAnimationElement.style.translate = "-31% 0";

        longPressTimerId = setTimeout(() => {
            submitButtonElement?.click();
        }, LONG_PRESS_THRESHOLD);
    }
    const onpointerup = () => {
        if (!submitButtonElement || !pressingAnimationElement) { return; }

        clearTimeout(longPressTimerId);
        pressingAnimationElement.style.transitionDuration = "300ms";
        pressingAnimationElement.style.translate = "-85% 0";
    }
    const onpointerleave = () => {
        if (!submitButtonElement || !pressingAnimationElement) { return; }
        if (!window.matchMedia("(any-hover: hover)").matches) {
            onpointerup();
        }
    }

    onMount(() => {
        if (!pressingAnimationElement) { throw new Error("アニメーション用の要素が見つかりません。"); }
        pressingAnimationElement.style.transitionDuration = `${LONG_PRESS_THRESHOLD}ms`;
        pressingAnimationElement.style.translate = "-85% 0";
    });
</script>

<button type="submit" title="send form" disabled={!turnstileState.isVerified} bind:this={submitButtonElement} class="sr-only"></button>

<button type="button" {onpointerdown} {onpointerup} {onpointerleave} title="send form" disabled={!turnstileState.isVerified} oncontextmenu={(e) => e.preventDefault()} class=" group button-general p-2 enabled:bg-turn-on/30 enabled:hover:bg-turn-on/50 active:bg-turn-on/70">
    <div class="w-50 flex flex-col justify-center items-end gap-2">
        <div class="px-1 w-full bg-label/50 overflow-clip rounded-full inset-shadow-black inset-shadow-sm">
            <div bind:this={pressingAnimationElement} class="transition-all w-[150%] bg-base rounded-full flex justify-end items-center outline-base outline-0 -outline-offset-1 shadow-black shadow-md/100">
                <SvgIcon Svg={SendIcon} size={40} autoChangeByTheme={false} class="fill-label" />
            </div>
        </div>
        <p class="w-full text-center text-xl">長押しで送信</p>
    </div>
</button>
