<script lang="ts">
    import DarkIcon from "$lib/assets/icons/dark.svelte";
    import LightIcon from "$lib/assets/icons/light.svelte";

    import { theme } from "$lib/state";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    // import LightTheme from "$lib/assets/icons/light/theme.svg";

    const onclick = () => {
        theme.theme = (theme.theme === 'dark') ? 'light' : 'dark';
    }
</script>

<button {onclick} title="theme" class="rounded-full m-1 p-1 sm:m-2 w-10 h-10 cursor-pointer overflow-clip bg-base/25 backdrop-blur-2xl">
    <div class={["transition-all duration-300 flex-col-center", (!(theme.theme === 'dark')) && "-translate-y-9"]}>
        <SvgIcon Svg={DarkIcon} size={40} class="w-9 h-9" />
        <SvgIcon Svg={LightIcon} size={40} class="w-9 h-9" />
    </div>
</button>
