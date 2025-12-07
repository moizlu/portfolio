<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        size?: number;
        class?: ClassValue;
    }
    const { size,  class: className }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} class={className}>
    <path d="m 102.805,-315.115 372.31,-372.31 372.31,372.31 -42.54,42.54 -329.77,-329.77 -329.77,329.77 z" />
</svg>