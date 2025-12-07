<script lang="ts">
    import light from "$lib/assets/icons/light/theme.svg";
    import dark from "$lib/assets/icons/dark/theme.svg";

    import { getTheme, setTheme } from '$lib/utils/theme.svelte';
    import Icon from '$lib/components/ui/Icon/Icon.svelte';

    const onclick = () => {
        setTheme(getTheme() === "dark" ? "light" : "dark");
    }
</script>

<button {onclick} class="" id="theme-button">
    <Icon lightSrc={light} darkSrc={dark} alt="theme" size={30} />
</button>
