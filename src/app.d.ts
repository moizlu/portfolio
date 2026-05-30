/// <reference types="@types/cloudflare-turnstile" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties
		}

		declare module '*.md' {
			import { Component } from 'svelte';
			const component: Component;
			export default component;
		}

		declare module '*.svx' {
			import { Component } from 'svelte';
			const component: Component;
			export default component;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
