<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/state';
	theme.theme

	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import SplashScreen from '$lib/components/sections/SplashScreen';
	import { DialogEntrypoint } from '$lib/components/ui/Dialog';
	import Header from '$lib/components/sections/Header';
	import Footer from '$lib/components/sections/Footer';
  	import { sectionState } from '$lib/state/state.svelte';
  	import { sectionIndexes, type SectionName } from '$lib/types';

	let { children } = $props();

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

<svelte:head>
	<link rel="icon" href={favicon} />

	<meta property="og:url" content="https://moizlu.com/" />
	<meta property="og:type" content="profile" />
	<meta property="og:title" content="ポートフォリオ | moizlu" />
	<meta property="og:image" content="https://moizlu.com/ogp.png" />
	<meta property="og:site_name" content="ポートフォリオ | moizlu" />
	<meta property="og:description" content="ポートフォリオ | moizlu" />

	<meta http-equiv="content-security-policy" content="
		default-src 'self';
		script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com 'unsafe-inline';
		style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
		font-src 'self' https://fonts.gstatic.com;
		frame-src 'self' https://challenges.cloudflare.com;
		img-src 'self' data: https:;
	">

	{#if dev}
		<title>[開発鯖]ポートフォリオ | moizlu</title>
	{:else}
		<title>ポートフォリオ | moizlu</title>
	{/if}
</svelte:head>

<SplashScreen />

<DialogEntrypoint />

<Header />
<div class="w-full mt-5 mb-15">
	{@render children()}
</div>
<Footer />
