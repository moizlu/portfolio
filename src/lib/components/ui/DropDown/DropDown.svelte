<script lang="ts">
  import type { Snippet } from "svelte";

    interface Props {
        value: string;
        options: {
            value: string;
            body: Snippet;
        }[];
        onSelect: (value: string) => void;
    }
    let { value=$bindable(), options, onSelect }: Props = $props();

    let currentOption = $derived(options.filter((op) => op.value === value)[0]);
    let isOpen = $state(false);

    let background: HTMLElement | undefined = undefined;
</script>

<svelte:body onclick={(e) => {
    if (background === undefined) { return; }
    if (e.target === background) {
        isOpen = false;
    }
}}/>

<div class={`fixed top-0 left-0 w-full h-full
            ${(isOpen) ? "" : "pointer-events-none"}
`} bind:this={background}>
</div>

 <button class="m-2 p-2 rounded-2xl
            bg-zinc-600
" onclick={() => isOpen = !isOpen}>
    {#if currentOption}
        {@render currentOption.body()}
    {/if}
</button>

<div class={`transition-all duration-500
            fixed flex flex-col justify-center items-center
            bg-zinc-500 dark:bg-zinc-800
            shadow-black shadow-md rounded-xl
            m-2 p-2
            top-[100px]
            ${(isOpen) ? "opacity-100" : "opacity-0 pointer-events-none"}
`}>
    {#each options as option}
        <button onclick={() => {
            onSelect(option.value);
            isOpen = false;
        }}>
            {@render option.body()}
        </button>
    {/each}
</div>
