<script lang="ts">
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";

    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    // if (browser) {
    //     if (page.status === 404) {
    //         goto('/');
    //     }
    // }
</script>

<div class="w-full h-dvh flex-col-center gap-2">
    <h1>{page.status}</h1>
    {page.url.pathname}
    {#if page.status === 404}
        <p class="text-center">URLが見つかりませんでした。<br>入力ミスが無いか確認してください。</p>
    {/if}

    <a href="/" title="back to root" class="w-60 p-2 flex justify-start items-center rounded-full button-general">
        <SvgIcon Svg={ArrowIcon} size={30} class="rotate-270 text-label" />
        <p class="flex-1 text-center">ホームに戻る</p>
    </a>
</div>
