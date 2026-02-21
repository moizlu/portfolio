<script lang="ts">
    import { dev } from "$app/environment";
    import { onDestroy, onMount } from "svelte";

    import { env } from "$env/dynamic/public";

    import { turnstileState } from "$lib/state/state.svelte";

    let widgetId: string | undefined | null = $state(undefined);

    const handleSuccess = () => {
        turnstileState.isVerified = true;
    }

    const handleReset = () => {
        turnstileState.isVerified = false;
    }

    onMount(() => {
        if (!(window as any).turnstile) { throw new Error("Cloudflare Turnstileが読み込まれていません。") }

        if (dev) {
            console.log("[注意] 開発環境のためTurnstileが無効化されています。");
        } else {
            widgetId = turnstile.render('#turnstile-container', {
                sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
                callback: handleSuccess,
                "expired-callback": handleReset,
                "error-callback": handleReset
            });
        }
    });

    onDestroy(() => {
        if (!dev && widgetId && turnstile) {
            turnstile.remove('#turnstile-container');
        }
    });
</script>

{#if dev}
    <label class="m-2 flex-center gap-2 toggle-button">
        <input type="checkbox" onchange={(e) => turnstileState.isVerified = (e.target as HTMLInputElement).checked}>
        <p>[Turnstileのウィジェット]</p>
    </label>
{:else}
    <div id="turnstile-container"></div>
{/if}
