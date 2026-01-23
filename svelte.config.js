import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),

		csp: {
			mode: "nonce",
			directives: {
				'default-src': ['self'],
				'script-src': ['self', "https://challenges.cloudflare.com https://static.cloudflareinsights.com", 'unsafe-inline'],
				'style-src': ['self', "https://fonts.googleapis.com", 'unsafe-inline'],
				'font-src': ['self', "https://fonts.gstatic.com"],
				'frame-src': ['self', "https://challenges.cloudflare.com"],
				'img-src': ['self', 'data:', 'https:']
			}
		}
	}
};

export default config;
