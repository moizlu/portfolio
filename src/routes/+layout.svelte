<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo.svg';

	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';

	initTheme();

	import SplashScreen from '$lib/components/sections/SplashScreen/SplashScreen.svelte';
	import Header from '$lib/components/sections/Header/Header.svelte';
	import Footer from '$lib/components/sections/Footer/Footer.svelte';
  	import { initTheme } from '$lib/utils/theme.svelte';


	let { children } = $props();

	onMount(() => {
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (e) => {
				e.preventDefault();

				const targetId = anchor.getAttribute('href')!.substring(1);
				const targetElement = document.getElementById(targetId);

				if (targetElement) {
					targetElement.scrollIntoView();

					replaceState(page.url, {});
				}
			});
		});

		initTheme();
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

    <title>ポートフォリオ | moizlu</title>
</svelte:head>

<SplashScreen />

<Header />
<div class="mb-[70px] md:mt-[70px]">
	{@render children()}
</div>
<Footer />
