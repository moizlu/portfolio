<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";

    import SvgIcon from "../SvgIcon";

    interface Props extends HTMLButtonAttributes {
        text: string;
    }
    const { text, class: className, ...props }: Props = $props();

    let isCopied = $state(false);

    const onclick = () => {
        window.navigator.clipboard.writeText(text);

        isCopied = true;
        setTimeout(() => {
            isCopied = false;
        }, 3000);
    }
</script>

<button title="copy" {onclick} {...props} class={[className, "overflow-clip w-13 h-13 rounded-full button-general button-bg-default flex-center"]}>
    <div class={["transition-all duration-600 flex-center gap-4", (isCopied) ? "-translate-x-6" : "translate-x-6"]}>
        <SvgIcon Svg={CopyIcon} size={30} class=" w-8 h-8" />
        <SvgIcon Svg={CheckIcon} size={30} class="w-8 h-8" />
    </div>
</button>
