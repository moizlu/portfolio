<script lang="ts">
    import logo from "$lib/assets/logo.svg";

    import Nav from "./Nav.svelte";
    import ThemeButton from "./ThemeButton.svelte";

    import { isModalOpened } from "$lib/state.svelte";
</script>

<a href="#home" class={["z-1000 fixed top-0 left-0 m-5 md:m-1", (isModalOpened()) && "pointer-events-none"]}>
    <img src={logo} alt="logo" class="pointer-events-none w-10 sm:w-15 h-full drop-shadow-black drop-shadow-sm/100">
</a>

<header class="z-10 fixed bottom-0 md:top-0 left-0 w-full h-[90px] md:h-[70px] max-md:pb-4 p-2 flex justify-start md:justify-end items-center bg-base/50 backdrop-blur-sm shadow-black shadow-md/25">
    <div class="max-md:w-full max-md:ml-2 flex justify-between md:justify-center items-center gap-2">
        <Nav />
        <ThemeButton />
    </div>
</header>
