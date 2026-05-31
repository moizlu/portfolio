<svelte:head>
    <title>プライバシーポリシー | moizlu</title>
</svelte:head>

<script lang="ts">
    import ArrowStickIcon from "$lib/assets/icons/arrow-stick.svelte";

    import { browser } from "$app/environment";

    import { getLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    import Header from "$lib/components/sections/Header";

    import Jp from "$lib/docs/privacy-policy/jp.md";
    import En from "$lib/docs/privacy-policy/en.md";
</script>

<main class="document py-15 w-full max-w-200 mx-auto px-4 ">
    <Header displaysNav={false} tapAvatarToReload={true} tapAvatarToSection="#contact" />

    {#if browser && document.referrer && document.referrer.startsWith(window.location.origin)}
        <button onclick={() => history.back()} class="z-1000 h-13 fixed bottom-2 left-2 p-2 cursor-pointer rounded-sm bg-label flex justify-center items-center text-base">
            <SvgIcon Svg={ArrowStickIcon} size={40} class="-rotate-90" />
            <p class="text-xl">{m.back()}</p>
        </button>
    {/if}

    <div class="w-full mx-auto prose xl:prose-xl
              prose-p:text-label prose-h1:text-label prose-h1:text-3xl prose-h2:text-label prose-h3:text-label prose-li:text-label prose-li:marker:text-label prose-ul:text-label prose-strong:text-label prose-table:text-label prose-th:text-label prose-a:text-label">
        {#if getLocale() === "ja"}
            <Jp />
        {:else}
            <En />
        {/if}
    </div>
</main>

<style>
    @reference "../layout.css";

    @layer components {
        .document {
            @apply text-xs;
        }
    }
</style>
