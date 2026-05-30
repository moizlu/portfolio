<script lang="ts">
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";
    import DoubleArrowIcon from "$lib/assets/icons/double-arrow.svelte";

    import { onMount } from "svelte";

    import { sectionStore } from "$lib/store";
    import { sectionIndexes } from "$lib/types";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    const onGotoTopClick = () => {
        sectionStore.goto("home");
    }

    const onMoveSectionClick = (direction: "up" | "down") => {
        return () => {
            let index = sectionStore.getIndex(sectionStore.active);

            switch (direction) {
                case "up":
                    index -= 1;
                    break;
                case "down":
                    index = (index + 1) % 5;
                    break;
            }

            const target = sectionIndexes.at(index);

            if (target) {
                sectionStore.goto(target);
            }
        }
    }

    let controlsElement: HTMLDivElement | undefined = $state(undefined);

    onMount(() => {
        const onSplashHidden = () => {
            if (!controlsElement) { return; }

            controlsElement.style.animationPlayState = "running";
        }

        document.addEventListener('splashHidden', onSplashHidden);

        return () => {
            document.removeEventListener('splashHidden', onSplashHidden);
        }
    });
</script>

<div bind:this={controlsElement} class="z-1000 fixed bottom-20 md:bottom-0 left-0 w-full h-15 pointer-events-none flex justify-end items-center controls">
    <div class="bg-base/50 rounded-l-lg backdrop-blur-sm flex justify-center items-center pointer-events-auto">
        <button title={sectionIndexes.at(sectionStore.getIndex(sectionStore.active) - 1)} class={["cursor-pointer transition-all duration-300", (sectionStore.active === "home") && "pointer-events-none opacity-20"]} onclick={onMoveSectionClick("up")}><SvgIcon Svg={ArrowIcon} size={50} /></button>
        <button title={sectionIndexes.at((sectionStore.getIndex(sectionStore.active) + 1) % 5)} class={["cursor-pointer transition-all duration-300 rotate-180", (sectionStore.active === "contact") && "pointer-events-none opacity-20"]} onclick={onMoveSectionClick("down")}><SvgIcon Svg={ArrowIcon} size={50} /></button>
        <button title="home" class={["cursor-pointer transition-all duration-300", (sectionStore.active === "home") && "pointer-events-none opacity-20"]} onclick={onGotoTopClick}><SvgIcon Svg={DoubleArrowIcon} size={50} /></button>
    </div>
</div>

<style>
    @reference "../../../../routes/layout.css";

    @layer components {
        @keyframes slide-in{
            from {
                translate: 10rem 0;
            }
            to {
                translate: 0 0;
            }
        }

        .controls {
            animation: 0.5s ease 1.5s 1 both slide-in;
            animation-play-state: pause;
        }
    }
</style>

