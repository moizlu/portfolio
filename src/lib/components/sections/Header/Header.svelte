<script lang="ts">
    import avatar from "$lib/assets/icons/avatar.svg";

    import { onMount } from "svelte";

    import Nav from "./Nav.svelte";

    import ChangeLangButton from "$lib/components/ui/ChangeLangButton";
    import ChangeThemeButton from "$lib/components/ui/ChangeThemeButton";

    let headerElement: HTMLElement | undefined = $state(undefined);

    interface Props {
        displaysNav?: boolean;
        tapAvatarToNewTab?: boolean;
    }
    const { displaysNav = true, tapAvatarToNewTab = false }: Props = $props();

    onMount(() => {
        const onSplashHidden = () => {
            if (!headerElement) { return; }

            headerElement.animate([
                { translate: "0 -2rem", opacity: 0 },
                { translate: "0 0", opacity: 1 },
                // { transform: "translateY(-80%)" }
            ], {
                duration: 100,
                delay: 100,
                iterations: 1,
                fill: "both",
                easing: "ease"
            }).play();
        }

        document.addEventListener('splashHidden', onSplashHidden);

        return () => {
            document.removeEventListener('splashHidden', onSplashHidden);
        }
    });
</script>

<header bind:this={headerElement} class="fixed top-0 left-0 px-2 w-full h-15 flex justify-between items-center gap-3 bg-base/50 backdrop-blur-sm z-100">
     <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a target={(tapAvatarToNewTab) ?"_blank" : "_self"} href="/">
        <img src={avatar} alt="avatar" class="h-10 w-10 drop-shadow-black drop-shadow-lg/50">
    </a>
    <div class="flex justify-center items-center gap-3">
        <div class="hidden md:block w-px h-10 bg-label"></div>
        <ChangeLangButton />
        <div class="w-px h-10 bg-label"></div>
        <ChangeThemeButton />
    </div>
</header>

{#if displaysNav}
    <Nav />
{/if}
