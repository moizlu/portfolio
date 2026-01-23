<script lang="ts">
	// overflow-hidden

	import './layout.css';
	import favicon from '$lib/assets/logo.svg';

	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';

	import DialogEntrypoint from '$lib/components/ui/Dialog/DialogEntrypoint.svelte';
	import SplashScreen from '$lib/components/sections/SplashScreen/SplashScreen.svelte';
	import Header from '$lib/components/sections/Header/Header.svelte';
	import Footer from '$lib/components/sections/Footer/Footer.svelte';
  	import { theme } from '$lib/state';

	theme.init();

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

		theme.init();
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

	<!-- <meta http-equiv="content-security-policy" content="
		default-src 'self';
		script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com 'unsafe-inline';
		style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
		font-src 'self' https://fonts.gstatic.com;
		frame-src 'self' https://challenges.cloudflare.com;
		img-src 'self' data: https:;
	"> -->

    <title>ポートフォリオ | moizlu</title>
</svelte:head>

<DialogEntrypoint />
<SplashScreen />

<Header />
<div class="max-md:mb-[90px] md:mt-[70px]">
	{@render children()}
</div>
<Footer />
