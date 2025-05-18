<script lang="ts">
    interface Props {
        isOpen: boolean;
        children?: any;
    }
    let { isOpen = $bindable(), children }: Props = $props();

    let backgroundElement: HTMLDivElement | undefined = $state(undefined);

    const onclick = (e: Event) => {
        if (!backgroundElement) { return; }

        if (e.target === backgroundElement) {
            isOpen = false;
        }
    };
</script>

<div class={[`transition-opacity duration-200
            fixed top-0 left-0 w-full h-full
            bg-zinc-900 blur-2xl
            `, isOpen ? "opacity-75" : "opacity-0 pointer-events-none"]}
    >
</div>

{#if children}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
     <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="transition-opacity duration-200
                fixed top-0 left-0 w-full h-full
                "
            bind:this={backgroundElement}
            onclick={onclick}
    >
        {@render children()}
    </div>
{/if}
