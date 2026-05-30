<script lang="ts">
    import ArrowIcon from '$lib/assets/icons/arrow.svelte';
    import LinkIcon from '$lib/assets/icons/link.svelte';

    import GitHubLight from "$lib/assets/icons/light/github.svg";
    import GitHubDark from "$lib/assets/icons/dark/github.svg";

    import { onMount, type Component } from 'svelte';
    import { m } from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';

    import { modalWindow } from '$lib/store';
    import SvgIcon from '$lib/components/ui/SvgIcon';
    import Icon from '$lib/components/ui/Icon';

    import useEmblaCarousel from 'embla-carousel-svelte'
    import type { EmblaCarouselType } from 'embla-carousel';

    export interface Props {
        title: string;
        icon?: string;
        images: string[];

        url?: string;
        github?: string;

        Description: {
            jp: Component,
            en: Component
        };
        techStack: string[];
    }

    let emblaApi: EmblaCarouselType | undefined = $state(undefined);
    let carouselImages: (HTMLImageElement | undefined)[] = $state([]);

    const goToPrev = () => { emblaApi?.scrollPrev(); }
    const goToNext = () => { emblaApi?.scrollNext(); }

    const onInit = (event: CustomEvent<EmblaCarouselType>) => {
        emblaApi = event.detail
    }

    const { title, icon, images, url, github, Description, techStack }: Props = $props();

    let currentPosition: number = $state(0);

    const onclick = () => {
        modalWindow.open({
            contents: dialog,
            title: title
        });
    }

    onMount(() => {
        setInterval(() => {
            currentPosition = emblaApi?.selectedScrollSnap() ?? 0;
        }, 100);
    })
</script>

{#snippet dialog()}
    <div class="w-full h-full py-20 flex flex-col justify-start items-center overflow-y-scroll">
        <div class="relative h-fit flex justify-center items-center">
            <!-- スクロールボタン(戻る) -->
            <button onclick={goToPrev} class="transition-all duration-300 hover:-translate-x-3 cursor-pointer max-md:absolute max-md:left-0 max-md:bottom-0">
                <SvgIcon Svg={ArrowIcon} size={100} class="w-15 h-15 md:w-25 md:h-25 -rotate-90" />
            </button>

            <!-- カルーセル本体 -->
            <div class="flex flex-col justify-center items-center">
                <div class="w-[95%] max-w-150 overflow-x-hidden" onemblaInit={onInit} use:useEmblaCarousel={{ options: { loop: true }, plugins: [] }}>
                    <div class="flex">
                        {#each images as imagePath, index (index)}
                            <div class="dialog-carousel-item">
                                <img bind:this={carouselImages[index]} src={imagePath} alt={`image${index}`} class="w-full max-w-150 object-contain">
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- 下のナビゲーション的なやつ -->
                <div class="h-15 flex justify-center items-center">
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each carouselImages as  image, index (index)}
                        <button title={`Go to ${index}`} onclick={() => emblaApi?.scrollTo(index)} class={["group p-2 md:p-4 cursor-pointer"]}>
                            <div class={["transition-all duration-300 rounded-sm", (currentPosition === index) ? "bg-main w-4.5 h-4.5" : "bg-label w-5 h-5 group-hover:scale-120"]}></div>
                        </button>
                    {/each}
                </div>
            </div>

            <!-- スクロールボタン(進む) -->
            <button onclick={goToNext} class="transition-all duration-300 hover:translate-x-3 cursor-pointer max-md:absolute max-md:right-0 max-md:bottom-0">
                <SvgIcon Svg={ArrowIcon} size={100} class="w-15 h-15 md:w-25 md:h-25 rotate-90" />
            </button>
        </div>


        <!-- 説明文 -->
        <div class="w-full p-4 flex flex-col justify-center items-center border-label/30 border-t">
            <!-- リンク -->
            <div class="flex justify-center items-center gap-5">
                {#if url}
                    <!-- CSSのスコープの関係で独自のクラスが使えない -->
                    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                    <a target="_blank" href={url} class="w-35 transition-all duration-300 flex justify-center items-center gap-2 p-2 bg-base-accent rounded-sm shadow-black shadow-sm/25 hover:shadow-none">
                        <SvgIcon Svg={LinkIcon} size={30} />
                        <p class="text-xl">{m.website()}</p>
                    </a>
                {/if}
                {#if github}
                    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                    <a target="_blank" href={github} class="w-35 transition-all duration-300 flex justify-center items-center gap-2 p-2 bg-base-accent rounded-sm shadow-black shadow-sm/25 hover:shadow-none">
                        <Icon lightSrc={GitHubLight} darkSrc={GitHubDark} size={30} />
                        <p class="text-xl">GitHub</p>
                    </a>
                {/if}
            </div>


            <div class="prose lg:prose-xl prose-strong:text-label text-label">
                {#if getLocale() === "ja"}
                    <Description.jp />
                {:else}
                    <Description.en />
                {/if}
            </div>
            <div class="mt-4 flex flex-col justify-center items-center">
                <h3 class="relative
                           before:absolute before:top-[50%] before:-left-11 before:content-[''] before:w-10 before:h-px before:bg-label
                           after:absolute after:top-[50%] after:-right-11 after:content-[''] after:w-10 after:h-px after:bg-label
                ">{m.tech_stack()}</h3>
                <p class="text-xs md:text-sm">{techStack.join(", ")}</p>
            </div>
        </div>
    </div>
{/snippet}

<button {onclick} {title} class="relative transition-all duration-300 rounded-lg w-full mx-4 max-w-70 h-40 border-2 border-label/30 cursor-pointer hover:-translate-y-2 overflow-clip flex justify-center items-center
after:transition-all after:duration-300 after:absolute after:top-0 after:left-0 after:w-full after:h-full after:-z-1 after:base/10 after:backdrop-blur-[2px] hover:after:backdrop-blur-none">
<!-- after:transition-all after:duration-300 after:absolute after:top-0 after:left-0 after:w-full after:-z-1 after:h-full after:bg-linear-to-l after:from-50% hover:after:translate-x-30 after:from-base after:to-transparent"> -->
    {#if typeof icon === 'string'}
        <img src={icon} alt="icon" class="w-full h-full -z-2 object-cover">
    {:else}
        <img src={images[0]} alt="icon" class="w-full h-full -z-2 object-cover">
    {/if}

    <p class="absolute p-2 rounded-sm text-xl bg-base/80">{title}</p>
</button>

<style>
    .dialog-carousel-item {
        @apply touch-pan-y touch-pinch-zoom;
        flex: 0 0 100%;
    }
</style>
