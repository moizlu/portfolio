<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    import HomeIcon from "$lib/assets/icons/home.svelte";

    type IconType = typeof HomeIcon;

    export interface Props {
        Svg: IconType;
        size: number;
        autoChangeByTheme?: boolean;
        class?: ClassValue;
    }
    const { Svg, size, autoChangeByTheme = true, class: className }: Props = $props();
</script>

<Svg {size} class={[className, (autoChangeByTheme) ? "transition-all duration-300 fill-label" : ""]} />
