<script lang="ts">
    import HomeIcon from "$lib/assets/icons/home.svelte";
    import AboutIcon from "$lib/assets/icons/about.svelte";
    import WorksIcon from "$lib/assets/icons/works.svelte";
    import ContactIcon from "$lib/assets/icons/contact.svelte";

    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import type { ClassValue } from "svelte/elements";

    import SvgIcon from "$lib/components/ui/SvgIcon";
    import type { SvgComponent, SectionName } from "$lib/types";
    import { scrollState, sectionState } from "$lib/state/state.svelte";

    const UPDATE_DEBOUNCE = 100;

    interface Section {
        name: SectionName;
        icon: SvgComponent;
        element?: HTMLLIElement;
    }

    const sectionItems: Section[] = [
        { name: 'home',  icon: HomeIcon },
        { name: 'about', icon: AboutIcon },
        { name: 'works', icon: WorksIcon },
        { name: 'contact', icon: ContactIcon }
    ];

    let activeOverlayElement: HTMLDivElement | HTMLUListElement | undefined = undefined;

    // オーバーレイ(クリップパス)の移動
    const positioningOverlay = () => {
        const targetSectionName = window.location.hash.slice(1);
        const activeElement = sectionItems.filter((section) => section.name === sectionState.activeSection)?.[0].element;
        const targetElement = sectionItems.filter((section) => section.name === targetSectionName)?.[0]?.element;
        if (!activeElement || !targetElement || !activeOverlayElement) { return; }
        const left = targetElement.offsetLeft;

        // 距離に応じてアニメーションの速度を変える(1px=2ms)
        activeOverlayElement.style.transitionDuration = `${Math.max(300, Math.abs(activeElement.offsetLeft - left)) * 2}ms`;
        // そのままだとずれるので微調整
        // activeOverlayElement.style.clipPath = `inset(0px ${right + 45}px 0px ${left - 20}px)`
        activeOverlayElement.style.clipPath = `circle(17.1% at ${(targetElement.offsetLeft + (targetElement.offsetWidth / 2)) - 16}px ${targetElement.offsetHeight / 2}px)`;
    }

    // アクティブなセクションを設定
    const navigateSections = () => {
        let lastUpdatedTime = 0;
        let lastPosition = 0;
        let lastActiveSection: SectionName = 'home';
        const sectionElements = Array.from(document.querySelectorAll('section'));

        return () => {
            const now = Date.now();
            if (now - lastUpdatedTime < UPDATE_DEBOUNCE) { return; }
            lastUpdatedTime = now;

            const currentPosition = window.scrollY;
            const isScrollingDown = currentPosition > lastPosition;
            lastPosition = currentPosition;

            const centerHeight = window.innerHeight / 2;

            // 通過したセクション=true, 通過していないセクション=falseの配列
            const isAboveCenter = sectionElements.map((element) => {
                const rect = element.getBoundingClientRect();
                const top = rect.top;
                const bottom = rect.bottom;

                const isBottomAboveCenter = bottom < centerHeight; // セクションの下端が中央より上かどうか
                const isTopBelowScreenTop = Math.abs(top) <= 100;  // セクションの上端が画面の上端より下にあるかどうか

                // 下端が中央より上かつ上端が画面外にあるセクションのみtrue
                return isBottomAboveCenter && !isTopBelowScreenTop;
            });

            const position = isAboveCenter.filter((isAbove) => isAbove).length;

            sectionState.activeSection = sectionItems[position].name;
            if (lastActiveSection !== sectionState.activeSection) {
                lastActiveSection = sectionState.activeSection;

                if (!scrollState.isScrollingProgrammatically) {
                    const targetSectionIndex = sectionItems.findIndex((section) => section.name === window.location.hash.slice(1));

                    // 行き先がすでに設定されている場合はハッシュを更新しないようにする
                    if ((isScrollingDown && targetSectionIndex < position) || (!isScrollingDown && targetSectionIndex > position)) {
                        goto(`#${sectionState.activeSection}`, { noScroll: true, keepFocus: true });
                    }
                }
            }

            positioningOverlay();
        }
    }

    onMount(() => {
        const sectionNavigator = navigateSections();
        const sectionNavigatorIntervalId = setInterval(sectionNavigator, 500);
        window.addEventListener('scroll', sectionNavigator);

        return () => {
            clearInterval(sectionNavigatorIntervalId);
            window.removeEventListener('scroll', sectionNavigator);
        }
    });
</script>

<nav class="p-4 relative isolate w-full md:w-170 lg:w-200">
    <!-- <div bind:this={activeOverlayElement} class="z-1 transition-all absolute box-content top-0 my-4 rounded-full bg-label mix-blend-difference pointer-events-none"></div> -->
    <ul class="w-full flex-center gap-2 sm:gap-4">
        {#each sectionItems as section}
            <li bind:this={section.element} class={["transition-all duration-300 flex-1 rounded-3xl sm:rounded-full shadow-black bg-base/50 backdrop-blur-sm", (sectionState.activeSection === section.name) ? "shadow-md/50" : "shadow-lg/50"]}>
                <a href={`#${section.name}`} title={section.name} class="p-2 flex flex-col md:flex-row justify-between items-center">
                    <SvgIcon Svg={section.icon}
                         size={30}
                         autoChangeByTheme={false}
                         class="transition-all duration-200 xs:mx-2 w-8 h-8 flex-none stroke-50 fill-transparent stroke-label" />
                    <p class="flex-1 text-label text-center text-[10px] xs:text-xs md:text-xl">{section.name[0].toUpperCase() + section.name.slice(1)}</p>
                </a>
            </li>
        {/each}
    </ul>

    <!-- 背景を透明にすると白いのが見える -->
    <ul bind:this={activeOverlayElement} class="absolute active-overlay-ul w-full top-0 left-0 m-4 pr-8 pointer-events-none flex-center gap-2 sm:gap-4 bg-base/1">
        {#each sectionItems as section}
            <li class="flex-1 p-2 rounded-3xl sm:rounded-full flex flex-col md:flex-row justify-between items-center bg-label">
                <SvgIcon Svg={section.icon}
                        size={30}
                        autoChangeByTheme={false}
                        class="transition-all duration-200 xs:mx-2 w-8 h-8 flex-none fill-base stroke-transparent" />
                <p class="flex-1 text-base text-center text-[10px] xs:text-xs md:text-xl">{section.name[0].toUpperCase() + section.name.slice(1)}</p>
            </li>
        {/each}
    </ul>
</nav>

<style>
    @reference "../../../../routes/layout.css";

    .active-overlay-ul {
        /* clip-path: inset(0 0 0 0); */
        clip-path: circle(100%);
        transition: clip-path 0.3s ease;
    }
</style>
