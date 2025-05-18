<script lang="ts">
	import '../app.css';

	import Header from '$lib/components/parts/Header/Header.svelte';

	let { children } = $props();
</script>

<div class="bg-zinc-300 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-300 font-primary
			transition-all duration-500
">
	<Header />
	{@render children()}
</div>
