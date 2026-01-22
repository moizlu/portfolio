<script lang="ts">
    import Home from "$lib/components/sections/pages/Home/Home.svelte";
    import About from "$lib/components/sections/pages/About/About.svelte";
    import Works from "$lib/components/sections/pages/Works/Works.svelte";
    import Contact from "$lib/components/sections/pages/Contact/Contact.svelte";

    import type { PageProps } from "./$types";

    const pageProps: PageProps = $props();
</script>

<main>
    <Home />
    <About />
    <Works />
    <Contact {...pageProps as any} />
</main>
