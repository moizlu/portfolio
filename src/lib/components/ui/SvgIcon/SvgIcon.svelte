<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    import type { SvgComponent } from "$lib/types";

    export interface Props {
        Svg: SvgComponent;
        size: number;
        autoChangeByTheme?: boolean;
        class?: ClassValue;
    }
    const { Svg, size, autoChangeByTheme = true, class: className }: Props = $props();
</script>

<Svg {size} class={[className, (autoChangeByTheme) ? "transition-all duration-300 fill-label" : ""]} />
