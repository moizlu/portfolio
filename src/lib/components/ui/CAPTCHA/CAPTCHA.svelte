<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { dev } from "$app/environment";
    import { env } from "$env/dynamic/public";

    import { captchaStore } from "$lib/store";

    let widgetId: string | undefined | null = $state(undefined);

    const onSuccess = () => {
        captchaStore.verified = true;
    }

    const onReset = () => {
        captchaStore.verified = false;
    }

    onMount(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).turnstile) {
            throw new Error("Cloudflare Turnstile has not loaded.");
        }

        if (dev) {
            console.log("[注意]開発環境のためTurnstileが無効化されています。");
        } else {
            widgetId = turnstile.render('#turnstile-container', {
                sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
                callback: onSuccess,
                "expired-callback": onReset,
                "error-callback": onReset
            });
        }
    });
</script>

{#if dev}
    <label onchange={(e) => captchaStore.verified = (e.target as HTMLInputElement).checked} class="toggle-switch flex">
        <input type="checkbox">
        <p class="">CAPTCHA</p>
    </label>
{:else}
    <div id="turnstile-container"></div>
{/if}
