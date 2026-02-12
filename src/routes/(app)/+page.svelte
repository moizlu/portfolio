<script lang="ts">
    import type { PageProps } from "./$types";

    import Home from "$lib/components/pages/Home";
    import About from "$lib/components/pages/About";
    import Works from "$lib/components/pages/Works";
    import Contact from "$lib/components/pages/Contact";

    const props: PageProps = $props();
</script>

<main>
    <Home />
    <About />
    <Works />
    <Contact {...props as any} />
</main>
