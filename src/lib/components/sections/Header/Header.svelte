<script>
    import favicon from "$lib/assets/favicon.svg";

    import { browser } from "$app/environment";

    import { dialog } from "$lib/components/ui/Dialog";

    import Nav from "./Nav.svelte";
    import ThemeButton from "./ThemeButton.svelte";
</script>

<div class={["z-100 opacity-50 md:opacity-100 fixed top-0 left-0", (dialog.isOpened || (browser && (window.location.pathname !== '/'))) && "pointer-events-none"]}>
    <a href="/#home" title="logo">
        <img src={favicon} width={10} height={10} alt="logo" class="m-1 w-13 h-13 drop-shadow-black drop-shadow-md/100" />
    </a>
</div>

<header class={["transition-all duration-300 z-10 fixed bottom-0 md:top-0 left-0 w-full h-fit pointer-events-none", (browser && (window.location.pathname !== '/')) && "invisible"]}>
    <div class="w-full h-30 md:h-20 flex justify-end items-center pointer-events-auto">
        <!-- {#if  browser && window.location.pathname === '/'} -->
            <Nav />
        <!-- {/if} -->
        <ThemeButton />
    </div>
</header>
