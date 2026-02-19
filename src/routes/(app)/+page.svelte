<script lang="ts">
    import type { PageProps } from "./$types";
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";

    import Home from "$lib/components/pages/Home";
    import About from "$lib/components/pages/About";
    import Works from "$lib/components/pages/Works";
    import Contact from "$lib/components/pages/Contact";

    import { sectionState } from '$lib/state/state.svelte';
  	import type { SectionName } from '$lib/types';

    const props: PageProps = $props();

	// 404の後に遷移した時、初期化処理をやり直す必要があるためここに配置
	$effect(() => {
		const sectionElements = Array.from(document.querySelectorAll('article'));
		const index = sectionState.getIndex(sectionState.activeSection);

		sectionElements.map((element) => {
			if (sectionState.getIndex(element.id.split('-')[0] as SectionName) <= index) {
				element.classList.add("section-fadeIn");
			} else {
				element.classList.remove("section-fadeIn");
			}
		});
	})

	onMount(() => {
		if (!window.location.hash && window.location.pathname === '/') {
			goto("#home", { noScroll: true, keepFocus: true });
		}
	});
</script>

<main>
    <Home />
    <About />
    <Works />
    <Contact {...props as any} />
</main>
