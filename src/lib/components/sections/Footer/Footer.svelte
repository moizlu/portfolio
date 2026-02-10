<script lang="ts">
    import GitHubLightIcon from "$lib/assets/icons/light/github.svg";
    import GitHubDarkIcon from "$lib/assets/icons/dark/github.svg";
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";
    import DoubleArrowIcon from "$lib/assets/icons/double-arrow.svelte";

    import Icon from "$lib/components/ui/Icon";

    import { sectionState } from "$lib/state/state.svelte";
    import { sectionIndexes } from "$lib/types";
    import SvgIcon from "$lib/components/ui/SvgIcon";
</script>

<footer class="transition-all duration-300 fixed bottom-25 md:bottom-2 left-0 px-4 w-full h-17 pointer-events-none">
    <div class="w-full mb-2 flex justify-between items-center">
        <a href="https://moiz.lu/github" target="_blank" title="github" class="p-2 rounded-full bg-base/25 backdrop-blur-2xl pointer-events-auto">
            <Icon lightSrc={GitHubLightIcon} darkSrc={GitHubDarkIcon} size={30} />
        </a>

        <div class="flex-center gap-6 p-1.5 rounded-full bg-base/25 backdrop-blur-sm pointer-events-auto">
            <a href={`#${sectionIndexes[sectionState.getIndex(sectionState.activeSection) - 1] ?? sectionIndexes.at(0)}`} class={["transition-all duration-300", (sectionState.getIndex(sectionState.activeSection) === 0) && "translate-y-10 opacity-0 pointer-events-none"]}>
                <SvgIcon Svg={ArrowIcon} size={40} class="" />
            </a>
            <a href={`#${sectionIndexes[sectionState.getIndex(sectionState.activeSection) + 1] ?? sectionIndexes.at(-1)}`}>
                <SvgIcon Svg={ArrowIcon} size={40} class={["transition-all duration-300 rotate-180", (sectionState.getIndex(sectionState.activeSection) >= (sectionIndexes.length - 1)) && "-translate-y-10 opacity-0 pointer-events-none"]} />
            </a>
        </div>

        <div class="flex-center p-1.5 rounded-full bg-base/25 backdrop-blur-sm pointer-events-auto">
            <a href={`#${sectionIndexes.at(0)}`} class={["transition-all duration-300", (sectionState.getIndex(sectionState.activeSection) === 0) && "translate-y-10 opacity-0 pointer-events-none"]}>
                <SvgIcon Svg={DoubleArrowIcon} size={50} class="" />
            </a>
        </div>
    </div>
</footer>