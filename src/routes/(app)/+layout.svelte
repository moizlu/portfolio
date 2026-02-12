<script lang="ts">
	import { theme } from '$lib/state';
	theme.theme

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import Header from '$lib/components/sections/Header';
	import Footer from '$lib/components/sections/Footer';
  	import { sectionState } from '$lib/state/state.svelte';
  	import type { SectionName } from '$lib/types';

	let { children } = $props();

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

<Header />
<div class="w-full mb-20">
	{@render children()}
</div>
<Footer />
