<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        size?: number;
        class?: ClassValue;
    }
    const { size,  class: className }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} class={className}>
    <path d="M200-160v-420l280-211.54L760-580v420H552.31v-255.38H407.69V-160H200Z"/>
</svg>