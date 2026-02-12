<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/state';
	theme.theme

	import { dev } from '$app/environment';

	import SplashScreen from '$lib/components/sections/SplashScreen';
	import { DialogEntrypoint } from '$lib/components/ui/Dialog';

	let { children } = $props();
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

<div class="w-full">
	{@render children()}
</div>
