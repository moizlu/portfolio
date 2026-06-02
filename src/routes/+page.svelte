<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import { m } from "$lib/paraglide/messages";

    import Header from "$lib/components/sections/Header";
    import Footer from "$lib/components/sections/Footer";
    import Controls from "$lib/components/sections/Controls";

    import Home from "$lib/components/pages/Home";
    import Profile from "$lib/components/pages/Profile";
    import Skill from "$lib/components/pages/Skill";
    import Works from "$lib/components/pages/Works";
    import Contact from "$lib/components/pages/Contact";

    import { greet } from "$lib/utils";

    import { sectionStore } from "$lib/store";
    import { sectionIndexes, type SectionName } from "$lib/types";

    const props: PageProps = $props();

    onMount(() => {
        const hash = window.location.hash;
        if ((hash !== "") && (hash in sectionIndexes)) {
            sectionStore.goto(hash as SectionName);
        }

        greet();
    });
</script>

<svelte:head>
	<title>{m.official_website()} | moizlu</title>
</svelte:head>

<!--
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button onclick={() => {
        if (getLocale() === "ja") {
            setLocale("en");
        } else {
            setLocale("ja");
        }
    }}>
    しねしねきえろ
</button> -->

<Controls />
<Header />

<main class="w-full ">
    <Home />
    <Profile />
    <Skill />
    <Works />
    <Contact {...props} />
</main>

<Footer />