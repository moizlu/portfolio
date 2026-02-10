<script lang="ts">
    import { fade } from "svelte/transition";

    import { dialog } from "$lib/components/ui/Dialog";

    let containerElement: HTMLDivElement | undefined = $state(undefined);

    const onContainerClicked = (event: MouseEvent) => {
        if (!dialog.data.isModal && (event.target === containerElement)) {
            dialog.deactivate();
        }
    };
</script>

{#if dialog.isOpened}
    <div role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter') { containerElement?.click(); } }} bind:this={containerElement} onclick={onContainerClicked} transition:fade={{duration: 150}} class={["z-99 fixed w-full h-full top-0 left-0 flex-center backdrop-blur-xl", (dialog.data.requireContrast) && "bg-base/50"]}>
        <div class={[(dialog.data.isDrawWindow) && "mx-2 w-full max-w-80 p-4 rounded-3xl bg-base shadow-lg/75"]}>
            {@render dialog.data.content?.()}
        </div>
    </div>
{/if}
