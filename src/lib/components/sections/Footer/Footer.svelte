<script>
    import githubLight from "$lib/assets/icons/light/github.svg";
    import githubDark from "$lib/assets/icons/dark/github.svg";
    import DoubleArrowIcon from "$lib/assets/icons/double-arrow.svelte";
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";

    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";
    import Icon from "$lib/components/ui/Icon/Icon.svelte";

    import { sectionIndex, SECTION_COUNT } from "$lib/types";
    import { getActiveSectionId, isModalOpened } from "$lib/state.svelte";
</script>

<footer>
    <div class={["z-13 pointer-events-none w-full fixed left-0 p-2 md:p-10 flex justify-between items-center transition-all duration-300", (isModalOpened()) ? "bottom-0" : "bottom-[90px] md:bottom-0 "]}>
        <div class="pointer-events-auto p-3 rounded-full bg-base/50 backdrop-blur-sm">
            <a target="_blank" href="https://moiz.lu/github">
                <Icon lightSrc={githubLight} darkSrc={githubDark} size={30} class="" />
            </a>
        </div>

        <div class={["pointer-events-auto flex-center bg-base/50 backdrop-blur-sm gap-2 p-1", (isModalOpened()) && "invisible"]}>
            <!-- インデックスがマイナスになるとプリレンダリング中にエラーになるため絶対値を使用(閲覧するときは関係ない) -->
            <a href={`#${sectionIndex[Math.abs(sectionIndex.indexOf(getActiveSectionId()) - 1)]}`} class={["transition-all duration-300", ((sectionIndex.indexOf(getActiveSectionId()) <= 0) || isModalOpened()) ? "opacity-0 pointer-events-none -translate-y-5" : "opacity-100"]}>
                <SvgIcon Svg={ArrowIcon} size={50} />
            </a>
            <a href={`#${sectionIndex[sectionIndex.indexOf(getActiveSectionId()) + 1]}`} class={["transition-all duration-300", ((sectionIndex.indexOf(getActiveSectionId()) >= SECTION_COUNT - 1) || isModalOpened()) ? "opacity-0 pointer-events-none translate-y-5" : "opacity-100"]}>
                <SvgIcon Svg={ArrowIcon} size={50} class="rotate-180" />
            </a>
        </div>

        <div class={["transition-all duration-300 p-2 flex-center bg-base/50 backdrop-blur-sm",  ((getActiveSectionId() === "home") || isModalOpened()) ? "pointer-events-none opacity-0 translate-y-5" : "pointer-events-auto opacity-100"]}>
                <a href="#home" title="一番上に戻る">
                    <SvgIcon Svg={DoubleArrowIcon} size={50} />
                </a>
        </div>
    </div>
</footer>
