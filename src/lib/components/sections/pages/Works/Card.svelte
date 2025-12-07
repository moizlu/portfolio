<script lang="ts">
    import closeIcon from "$lib/assets/icons/close.svelte";
    import jumpIcon from "$lib/assets/icons/jump.svelte";

    import githubLight from "$lib/assets/icons/light/github.svg";
    import githubDark from "$lib/assets/icons/dark/github.svg";

    import type { Snippet } from "svelte";
    import { slide } from "svelte/transition";

    import Modal from "$lib/components/ui/Modal/Modal.svelte";
    import Icon from "$lib/components/ui/Icon/Icon.svelte";
    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

    import { setWorkModalOpened } from "$lib/state.svelte";

    export interface Props {
        isOpened?: boolean;
        url?: string;
        repository?: string;
        images: string[];
        techStack?: string;
        name: string;
        description: string | Snippet;
    }
    let { isOpened = $bindable(false), url, repository, images, techStack, name, description }: Props = $props();

    $effect(() => {
        setWorkModalOpened(isOpened);
    });

    const onclick = () => {
        isOpened = true;
    };
</script>

<Modal bind:isOpened={isOpened} >
    <div transition:slide={{duration: 500, axis: 'y'}} class="relative overflow-clip mx-5 max-w-200 rounded-2xl bg-base shadow-black shadow-xl/50">
        <div class="p-5 w-full flex justify-between items-center">
            <div class="flex-center gap-5">
                {#if url}
                <a target="_blank" href={url} title="サイト" class="link-button"><SvgIcon Svg={jumpIcon} size={30} /></a>
                {/if}
                {#if repository}
                    <a target="_blank" href={repository} title="GitHubのリポジトリ" class="link-button"><Icon lightSrc={githubLight} darkSrc={githubDark} size={30} /></a>
                {/if}
            </div>
            <button type="button" title="close" onclick={() => isOpened = !isOpened}>
                <SvgIcon Svg={closeIcon} size={50} />
            </button>
        </div>

        <div class="flex-col-center">
            <img src={images[0]} alt={name} class="pointer-events-none w-[95%] h-auto border-label border">
            <div class="p-5 flex-col-center gap-4">
                <p class="text-xl">{name}</p>
                {#if typeof description === 'string'}
                    <p class="text-sm md:text-lg">{description}</p>
                {:else}
                    {@render description()}
                {/if}

                <p class="text-sm">使用技術</p>
                <p class="text-left text-sm">{techStack}</p>
            </div>
        </div>
    </div>
</Modal>

<button type="button" title={name} {onclick} class="relative w-75 h-75 rounded-4xl overflow-clip shadow-black shadow-lg/75">
    <div class="absolute top-0 left-0 pointer-events-none w-full h-full bg-turn-on/50">
        <img src={images[0]} alt={name} class="mask-b-from-70%">
        <p class="text-center m-2 text-xl">{name}</p>
        <p class="text-left m-2 text-sm">{techStack}</p>
    </div>
</button>

<style>
    @reference "../../../../../routes/layout.css";

    .link-button {
        @apply p-2 rounded-full bg-turn-on/30 shadow-black shadow-md/75;
    }
</style>
