<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        size?: number;
        class?: ClassValue;
    }
    const { size,  class: className }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} class={className}>
    <path d="M240-200h147.69v-235.38h184.62V-200H720v-360L480-741.54 240-560v360Zm-40 40v-420l280-211.54L760-580v420H532.31v-235.38H427.69V-160H200Zm280-310.77Z"/>
</svg>