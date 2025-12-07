<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        size?: number;
        class?: ClassValue;
    }
    const { size,  class: className }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} class={className}>
    <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/>
</svg>