<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { dev } from '$app/environment';

	import { getLocale } from "$lib/paraglide/runtime";

	import ModalWindowEntrypoint from '$lib/components/ui/ModalWindow';
	import SplashScreen from '$lib/components/sections/SplashScreen';

	let { children } = $props();

	$effect(() => {
		const lang = getLocale();
		document.documentElement.lang = lang
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

<ModalWindowEntrypoint />
<SplashScreen />

{@render children()}

<!-- <div style="display:none">
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
		>{locale}</a>
	{/each}
</div> -->
