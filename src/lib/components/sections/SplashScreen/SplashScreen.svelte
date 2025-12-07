<script lang="ts">
    import LoadingIcon from "$lib/assets/icons/loading.svelte";

    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";

    import Icon from "$lib/components/ui/Icon/Icon.svelte";

    let isShow = $state(true);


    onMount(() => {
        setTimeout(() => {
            isShow = false;
        }, 100);
    })
</script>

{#if isShow}
    <div transition:slide={{ duration: 500 }} class="fixed z-1000 top-0 left-0 w-full h-dvh bg-base transition-colors duration-300 flex flex-col justify-center items-center">
        <SvgIcon Svg={LoadingIcon} size={100} class="animate-spin" />

        <p>読み込み中...</p>
    </div>
{/if}
