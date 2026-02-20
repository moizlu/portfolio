<script lang="ts">
    import GitHubLightIcon from "$lib/assets/icons/light/github.svg";
    import GitHubDarkIcon from "$lib/assets/icons/dark/github.svg";
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";
    import DoubleArrowIcon from "$lib/assets/icons/double-arrow.svelte";

    import { browser } from "$app/environment";

    import Icon from "$lib/components/ui/Icon";

    // import type { SectionName } from "$lib/types";
    import { sectionState } from "$lib/state/state.svelte";
    import { sectionIndexes } from "$lib/types";
    import SvgIcon from "$lib/components/ui/SvgIcon";

    let isFirstSection = $derived(sectionState.activeSectionIndex === 0);
    let isLastSection = $derived(sectionState.activeSectionIndex === (sectionIndexes.length - 1));

    let nextSection = $derived(sectionIndexes[sectionState.getIndex(sectionState.activeSection) - 1] ?? sectionIndexes.at(0));
    let prevSection = $derived(sectionIndexes[sectionState.getIndex(sectionState.activeSection) + 1] ?? sectionIndexes.at(-1));
</script>

<footer class="transition-all duration-300 fixed bottom-25 md:bottom-2 left-0 px-4 w-full h-17 pointer-events-none">
    {#if browser && window.location.pathname === '/'}
        <div class="w-full mb-2 flex justify-between items-center">
            <a href="https://moiz.lu/github" target="_blank" title="github" class="p-2 rounded-full bg-base/25 backdrop-blur-2xl pointer-events-auto">
                <Icon lightSrc={GitHubLightIcon} darkSrc={GitHubDarkIcon} size={30} />
            </a>

            <div class="sm:w-70 flex-center overflow-clip gap-6 p-1.5 rounded-full bg-base/25 backdrop-blur-sm pointer-events-auto border-label border">
                <a href={`#${nextSection}`} class={["flex-1 transition-all duration-300", (isFirstSection) && "-translate-y-10 opacity-0 pointer-events-none"]}>
                    <div class="flex justify-end items-center gap-2">
                        <!-- {#each section }

                        {/each} -->
                        <p class="hidden sm:block">{`${nextSection.slice(0, 1).toUpperCase()}${nextSection.slice(1)}`}</p>
                        <SvgIcon Svg={ArrowIcon} size={40} class="" />
                    </div>
                </a>
                <a href={`#${prevSection}`} class={["flex-1 transition-all duration-300", (isLastSection) && "translate-y-10 opacity-0 pointer-events-none"]}>
                    <div class="flex justify-start items-center gap-2">
                        <SvgIcon Svg={ArrowIcon} size={40} class="rotate-180" />
                        <p class="hidden sm:block">{`${prevSection.slice(0, 1).toUpperCase()}${prevSection.slice(1)}`}</p>
                    </div>
                </a>
            </div>

            <div class="flex-center p-1.5 rounded-full bg-base/25 backdrop-blur-sm pointer-events-auto">
                <a href={`#${sectionIndexes.at(0)}`} class={["transition-all duration-300", (isFirstSection) && "-translate-x-10 opacity-0 pointer-events-none"]}>
                    <SvgIcon Svg={DoubleArrowIcon} size={50} class="" />
                </a>
            </div>
        </div>
    {/if}
</footer>