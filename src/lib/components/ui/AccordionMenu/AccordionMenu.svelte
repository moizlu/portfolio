<script lang="ts">
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";

    import { slide } from "svelte/transition";
    import type { Snippet } from "svelte";
    import type { ClassValue } from "svelte/elements";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    interface Props {
        isOpened?: boolean;
        header: Snippet | string;
        children: Snippet;
        class?: ClassValue;
        onchange?: (isOpened: boolean) => void;
    }
    let { isOpened = $bindable(false), header, children, class: className, onchange }: Props = $props();

    const onclick = () => {
        isOpened = !isOpened;
        onchange?.(isOpened);
    };
</script>

<div class={className}>
    <button {onclick} class="w-full flex justify-between items-center">
        {#if typeof header === 'string'}
            <p class="text-lg font-bold">{header}</p>
        {:else}
            {@render header()}
        {/if}
        <SvgIcon Svg={ArrowIcon} size={20} class={[(!isOpened) && "rotate-180"]} />
    </button>

    {#if isOpened}
        <div transition:slide={{axis: 'y', duration: 300}} class="w-full h-full">
            {@render children()}
        </div>
    {/if}
</div>
