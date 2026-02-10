<script lang="ts">
    import { onMount } from "svelte";

    let isInitialized = $state(false);
    let isAppearSplash = $state(true);

    onMount(() => {
        setTimeout(() => {
            isInitialized = true;

            setTimeout(() => {
                isAppearSplash = false;
            }, 500);
        }, 500);
    });
</script>

{#if isAppearSplash}
    <div class={["transition-all duration-500 z-100 splash-clip fixed top-0 left-0 w-full h-full bg-label", (isInitialized) ? "clip-hole" : "overflow-hidden"]}>
    </div>
{/if}

<style>
    @reference "../../../../routes/layout.css";

    @keyframes move-clip-hole {
        from {
            mask-size: 0px, 100%;
        }
        to {
            mask-size: 1000%, 100%;
        }
    }

    .clip-hole {
        animation: move-clip-hole 1s ease-in-out forwards;
    }

    .splash-clip {
        /* -webkit-mask-image: radial-gradient(circle 500px at center, transparent 100%, black 100%); */
        /* mask-image: radial-gradient(circle 500px at center, transparent 100%, black 100%);
        mask-size: 80%;
        mask-position: 0% 50%; */

        mask-image: url('/logo.svg'), linear-gradient(black, black);
        -webkit-mask-image: url('/logo.svg'), linear-gradient(black, black);
        mask-repeat: no-repeat;

        mask-composite: exclude;
        -webkit-mask-composite: destination-out;

        mask-position: center center;
        -webkit-mask-position: center center;

        mask-size: 0px, 100%;

        /* mask-size: 100% 100%; */
    }
</style>
