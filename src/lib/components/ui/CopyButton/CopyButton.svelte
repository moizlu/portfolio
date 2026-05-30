<script lang="ts">
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";

    import type { HTMLButtonAttributes } from "svelte/elements";
    import { m } from "$lib/paraglide/messages";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    interface Props extends HTMLButtonAttributes {
        text: string | (() => string);
    }
    const { text, class: className, onclick: parentOnclick, children, ...props }: Props = $props();

    let copied = $state(false);

    const onclick = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {
        parentOnclick?.(event);

        window.navigator.clipboard.writeText((typeof text === "string") ? text : text());

        copied = true;
        setTimeout(() => {
            copied = false;
        }, 3000);
    }
</script>

<button title="{m.copy_text({ text: (typeof text === "string") ? text : "[非表示]" })}" {onclick} {...props} class={[className, "transition-all duration-300 flex justify-center items-center cursor-pointer hover:scale-105"]}>
    {@render children?.()}
    <div class="overflow-clip w-10 h-10 rounded-sm bg-base/50 backdrop-blur-sm">
        <div class={["w-fit h-fit transition-all duration-600 flex justify-center items-center gap-3", (copied) ? "-translate-x-13" : "translate-0"]}>
            <SvgIcon Svg={CopyIcon} size={40} class="w-10 h-10" />
            <SvgIcon Svg={CheckIcon} size={40} class="w-10 h-10" />
        </div>
    </div>
</button>
