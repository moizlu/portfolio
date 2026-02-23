<script lang="ts">
    import GitHubLightIcon from "$lib/assets/icons/light/github.svg";
    import GitHubDarkIcon from "$lib/assets/icons/dark/github.svg";
    import JumpIcon from '$lib/assets/icons/jump.svelte';
    import CloseIcon from "$lib/assets/icons/close.svelte";


    import { slide } from 'svelte/transition';

    import Icon from "$lib/components/ui/Icon";
    import SvgIcon from '$lib/components/ui/SvgIcon';
    import { dialog } from '$lib/components/ui/Dialog';

    export interface CardProps {
        isOpened?:   boolean;
        url?:        string;
        repository?: string;
        images:      string[];
        techStack:   string;
        name:        string;
        description: string;
    }
    let {
        isOpened = $bindable(false),
        url,
        repository,
        images,
        techStack,
        name,
        description
    }: CardProps = $props();

    const onclick = () => {
        dialog.activate({ id: "card", content: cardDialog, isDrawWindow: false })
    }
</script>

<!-- <svelte:head>
    {#each images as image}
        <link rel="preload" href={image} as="image" type="image/png" />
    {/each}
</svelte:head> -->

{#snippet cardDialog()}
    <!-- ダイアログのコンテナ -->
    <div transition:slide={{duration: 300, axis: 'y'}} class="p-3 w-dvw flex-center pointer-events-none">
        <!-- ダイアログの枠 -->
        <div class="p-2 w-max max-w-200 bg-base shadow-black shadow-lg/100 rounded-2xl pointer-events-auto">
            <!-- コンテンツ -->
            <div class="py-2 flex justify-between items-center">
                <!-- コントロールバー -->
                <div class="flex-center gap-2">
                    {#if repository}
                        <a href={repository} target="_blank">
                            <Icon lightSrc={GitHubLightIcon} darkSrc={GitHubDarkIcon} size={40} />
                        </a>
                    {/if}
                    {#if url}
                        <a href={url} target="_blank">
                            <SvgIcon Svg={JumpIcon} size={40} />
                        </a>
                    {/if}
                </div>

                <button onclick={() => dialog.deactivate()} class="cursor-pointer">
                    <SvgIcon Svg={CloseIcon} size={60} />
                </button>
            </div>

            <!-- 本体 -->
            <div class="flex-col-center gap-2">
                <img src={images[0]} alt="images" class="w-[95%] border-label border-2">
                <h2>{name}</h2>
                <p class="text-sm md:text-xl">{description}</p>
                <h3>使用技術</h3>
                <p class="text-xs sm:text-lg">{techStack}</p>
            </div>
        </div>
    </div>
{/snippet}

<button type="button" title={name} {onclick} class="relative w-75 h-75 rounded-4xl overflow-clip shadow-black shadow-lg/75 cursor-pointer">
    <div class="absolute top-0 left-0 w-full h-full bg-label text-base pointer-events-none">
        <img src={images[0]} alt={name} class="mask-b-from-70%">
        <p class="text-center m-2 text-xl">{name}</p>
        <p class="text-left m-2 text-xs">{techStack}</p>
    </div>
</button>
