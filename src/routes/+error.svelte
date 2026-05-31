<script lang="ts">
	import { page } from '$app/state';
    import Header from '$lib/components/sections/Header';
  import { getLocale } from '$lib/paraglide/runtime';

    const errorMessageJp: Record<number, string> = {
        404: "ページが見つかりませんでした。",
        500: "サーバー側でエラーが発生しました。"
    }
</script>

<main class="w-full h-full flex flex-col justify-center items-center
before:transition-all before:duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url(/images/room2.webp)] before:bg-cover before:bg-center before:brightness-170 dark:before:brightness-50 before:bg-fixed before:-z-1">
    <Header displaysNav={false} />
    <div class="p-5 flex flex-col justify-center items-center gap-0 md:gap-5 rounded-lg bg-base/70 backdrop-blur-sm">
        <h1 class="font-extrabold text-9xl">{page.status}</h1>
        <h1 class="text-3xl md:text-5xl">{page.error?.message}</h1>

        {#if getLocale() === "ja" && page.status in errorMessageJp}
            <p class="font-medium text-sm sm:text-lg md:text-3xl">{errorMessageJp[page.status]}</p>
        {/if}
    </div>
</main>