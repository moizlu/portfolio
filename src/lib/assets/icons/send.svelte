<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        size?: number;
        class?: ClassValue;
    }
    const { size,  class: className }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} class={className}>
    <path d="M160-220v-520l616.92 260L160-220Zm40-60 474-200-474-200v155.38L393.85-480 200-435.38V-280Zm0 0v-400 400Z"/>
</svg>