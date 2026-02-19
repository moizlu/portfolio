<script lang="ts">
	import { theme } from '$lib/state';
	theme.theme

	import Header from '$lib/components/sections/Header';
	import Footer from '$lib/components/sections/Footer';

	let { children } = $props();
</script>

<Header />
<div class="w-full mb-20">
	{@render children()}
</div>
<Footer />
