<script lang="ts">
    import CloseIcon from "$lib/assets/icons/close.svelte";

    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    // import type { Component, Snippet } from "svelte";
    import { m } from "$lib/paraglide/messages";

    import { isComponent } from "$lib/utils";
    import { modalWindow } from "$lib/store/modal-window.store.svelte";
    import type { ClassValue } from "svelte/elements";

    import SvgIcon from "../SvgIcon";

    let containerElement: HTMLDivElement | undefined = $state(undefined);
    let windowElement: HTMLDivElement | undefined = $state(undefined);

    const onkeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            containerElement?.click();
        }
    }

    const onclick = (event: MouseEvent) => {
        if (!modalWindow.data?.lock && (event.target === containerElement)) {
            modalWindow.close();
        }
    }

    const backgroundEffects = $derived({
        blur: modalWindow.data?.backgroundEffects === true || (typeof modalWindow.data?.backgroundEffects === 'object' && modalWindow.data.backgroundEffects?.blur),
        contrast: modalWindow.data?.backgroundEffects === true || (typeof modalWindow.data?.backgroundEffects === 'object' && modalWindow.data.backgroundEffects?.contrast),
    })

    const windowSettings = $derived({
        mode: (modalWindow.data?.window === true) ? 'window' : (typeof modalWindow.data?.window === 'object') ? modalWindow.data.window?.mode : 'window',
        controls: modalWindow.data?.window === true || (typeof modalWindow.data?.window === 'object' && modalWindow.data.window?.controls),
        square: typeof modalWindow.data?.window === 'object' && modalWindow.data.window?.square,
    });

    const optionalBackgroundStyle: (ClassValue | undefined | boolean)[] = $derived([
        modalWindow.data?.class,
        backgroundEffects.blur && "md:backdrop-blur-sm",
        backgroundEffects.contrast && "bg-base/20"
    ]);

    const windowStyle: Record<string, ClassValue | undefined | boolean> = $derived({
        window: ["bg-base md:max-h-200 md:m-10 md:border-label/5 md:border-2 md:rounded-sm", (windowSettings.square) ? "md:max-w-200" : "md:max-w-300"],
        fullscreen: "bg-base",
        none: ""
    });

    onMount(() => {
        const onModalWindowOpen = () => {
            // setTimeout(() => {
                if (!windowElement || !containerElement) { return; }
                containerElement.animate([
                    { opacity: 0 }, { opacity: 1 }
                    // { backdropFilter: "blur(0px)", opacity: 0 }, { backdropFilter: "blur(5px)", opacity: 1 }
                ], {
                    duration: 300, delay: 0, iterations: 1, fill: "both", easing: "ease"
                }).play();
                windowElement.animate([
                    { translate: "0 10rem", opacity: 0 }, { translate: "0 0", opacity: 1 }
                ], {
                        duration: 300, delay: 100, iterations: 1, fill: "both", easing: "ease"
                    }).play();
            // }, 50);
        };
        const onModalWindowClose = () => {
            // setTimeout(() => {
                if (!windowElement || !containerElement) { return; }
                windowElement.animate([
                    { translate: "0 0", opacity: 1 }, { translate: "0 10rem", opacity: 0 }
                ], {
                    duration: 300, delay: 0, iterations: 1, fill: "both", easing: "ease",
                }).play();

                containerElement.animate([
                    { opacity: 1 }, { opacity: 0 }
                ], {
                    duration: 300, delay: 100, iterations: 1, fill: "both", easing: "ease"
                }).play();
            // }, 50);
        };

        document.addEventListener('modalWindowOpen', onModalWindowOpen);
        document.addEventListener('modalWindowClose', onModalWindowClose);

        return () => {
            document.removeEventListener('modalWindowOpen', onModalWindowOpen);
            document.removeEventListener('modalWindowClose', onModalWindowClose);
        }
    });
</script>

{#snippet renderContents()}
    {#if modalWindow.data}
        {#if isComponent(modalWindow.data.contents)}
            <modalWindow.data.contents />
        {:else}
            {@render modalWindow.data.contents()}
        {/if}
    {/if}
{/snippet}

<!-- {#if modalWindow.data} -->
<div bind:this={containerElement} transition:fade={{duration: 3000}} role="button" tabindex="0" {onkeydown} {onclick} class={[
    "z-1002 fixed top-0 left-0 w-full h-dvh flex justify-center items-center opacity-0",
    (modalWindow.opened) ? "pointer-events-auto" : "pointer-events-none", ...optionalBackgroundStyle]}>
    <div bind:this={windowElement} role="dialog" aria-modal="true" class={[
        "transition-all duration-300 relative w-full h-full flex justify-center items-center opacity-0",
        (windowSettings.mode === 'window') && windowStyle.window, (windowSettings.mode === 'fullscreen') && windowStyle.fullscreen, (windowSettings.mode === 'none') && windowStyle.none]}
    >
        {#if modalWindow.data?.title}
            <div class={["z-100 absolute top-0 left-0 w-full h-15 rounded-sm bg-base/50"]}>
                {#if typeof modalWindow.data.title === "string"}
                    <p class="w-full h-full flex justify-center items-center text-xl md:text-2xl font-bold">{modalWindow.data.title}</p>
                {:else if isComponent(modalWindow.data.title)}
                    <modalWindow.data.title />
                {:else}
                    {@render modalWindow.data.title()}
                {/if}
            </div>
        {/if}
        {#if windowSettings.controls}
            <button title={m.close()} onclick={() => modalWindow.close()} class="z-100 transition-all duration-300 absolute top-0 right-0 bg-base/50 m-1 rounded-sm cursor-pointer hover:scale-110">
                <SvgIcon Svg={CloseIcon} size={50} />
            </button>
        {/if}
        {@render renderContents()}
    </div>
</div>
<!-- {/if} -->

<style>
</style>
