<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        isOpened?: boolean;
        isModal?: boolean;
    }
    let { isOpened = $bindable(false), isModal = false, children, onclick: parentOnClick, onkeydown: parentOnKeydown }: Props = $props();

    let backgroundElement: HTMLDivElement | undefined = $state(undefined);

    const onclick = (event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }) => {
        if (parentOnClick) {
            parentOnClick(event);
        }
        if (!isModal && (event.target === backgroundElement)) {
            isOpened = false;
        }
    }
    const onkeydown = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement; }) => {
        if (parentOnKeydown) {
            parentOnKeydown(event);
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            backgroundElement?.click();
        }
    };

</script>

{#if isOpened}
    <div role="button" tabindex="0" bind:this={backgroundElement} {onclick} {onkeydown} transition:fade={{ duration: 150 }} class="z-12 fixed top-0 left-0 w-dvw h-dvh flex-center bg-base/30 backdrop-blur-sm">
        {@render children?.()}
    </div>
{/if}
