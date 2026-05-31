<svelte:head>
    <title>プライバシーポリシー | moizlu</title>
</svelte:head>

<script lang="ts">
    import ArrowStickIcon from "$lib/assets/icons/arrow-stick.svelte";

    import { getLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    import Header from "$lib/components/sections/Header";

    import Jp from "$lib/docs/privacy-policy/jp.md";
    import En from "$lib/docs/privacy-policy/en.md";
</script>

<main class="document py-15 w-full max-w-200 mx-auto px-4 prose xl:prose-xl
             prose-p:text-label prose-h1:text-label prose-h1:text-3xl prose-h2:text-label prose-h3:text-label prose-li:text-label prose-li:marker:text-label prose-ul:text-label prose-strong:text-label prose-table:text-label prose-th:text-label prose-a:text-label">
    <Header displaysNav={false} tapAvatarToReload={true} tapAvatarToSection="#contact" />

    <button onclick={() => history.back()} class="z-1000 fixed -top-3 left-30 cursor-pointer flex justify-center items-center">
        <SvgIcon Svg={ArrowStickIcon} size={50} class="text-label -rotate-90" />
        <p>{m.back()}</p>
    </button>

    {#if getLocale() === "ja"}
        <Jp />
    {:else}
        <En />
    {/if}
</main>

<style>
    @reference "../layout.css";

    @layer components {
        .document {
            @apply text-xs;
        }
    }
</style>
