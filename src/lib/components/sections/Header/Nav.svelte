<script lang="ts">
    import { onMount } from "svelte";

    import type { SectionName } from "$lib/types";

    import HomeIcon from "$lib/assets/icons/home.svelte";
    import AboutIcon from "$lib/assets/icons/about.svelte";
    import WorksIcon from "$lib/assets/icons/works.svelte";
    import ContactIcon from "$lib/assets/icons/contact.svelte";
    type IconType = typeof HomeIcon;
    import SvgIcon from "$lib/components/ui/SvgIcon/SvgIcon.svelte";

    import { getActiveSectionId, setActiveSectionId } from "$lib/state.svelte";

    interface Section {
        name: SectionName;
        icon: IconType;
    }
    const sectionItems: Section[] = [
        { name: "home", icon: HomeIcon},
        { name: "about", icon: AboutIcon},
        { name: "works", icon: WorksIcon},
        { name: "contact", icon: ContactIcon}
    ];

    const UPDATE_DEBOUNCE = 50;

    onMount(() => {
        let lastUpdatedTime: number = 0;
        const sections = Array.from(document.querySelectorAll('section'));

        const navigation = () => {
            const now = Date.now();
            if (now - lastUpdatedTime < UPDATE_DEBOUNCE) { return; }
            lastUpdatedTime = now;

            const centerHeight = window.innerHeight / 2;

            const isOverCenter = sections.map((section) => {
                const rect = section.getBoundingClientRect();
                const top = rect.top;
                const bottom = rect.bottom;

                // 下端が真ん中より上 or 真ん中より下で上も下も画面内にある時true
                return (bottom >= centerHeight) || ((bottom < centerHeight) && ((top >= 0) || (Math.abs(top) <= 100)));
            });

            const position = isOverCenter.filter((isOver) => !isOver).length; // 真ん中より下にある要素の数

            setActiveSectionId((position >= sectionItems.length) ? sectionItems[sectionItems.length - 1].name : sectionItems[position].name);
        };

        window.addEventListener('scroll', navigation);
        setInterval(navigation, 300); // 早すぎると対応できないため
    });
</script>

<ul class="flex-center gap-2 max-md:-translate-y-2">
    {#each sectionItems as section}
        <li class={["group relative w-15 sm:w-28 transition-all duration-300 after:transition-all after:duration-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-label", (section.name === getActiveSectionId()) ? "-translate-y-1.5 after:translate-0 after:opacity-100" : "hover:-translate-y-0.5 after:opacity-0 after:translate-y-2 hover:after:opacity-50 hover:after:translate-y-1.5"]}>
            <a href={`#${section.name}`} class={["flex max-md:flex-col max-md:justify-center max-md:items-center md:justify-start md:items-center md:gap-2"]}>
                <SvgIcon Svg={section.icon} size={30} class={["transition-all duration-300", (section.name === getActiveSectionId()) && "scale-120"]} />
                <p class="transition-all duration-300 text-center text-sm md:text-lg">{section.name[0].toUpperCase() + section.name.slice(1)}</p>
            </a>
        </li>
    {/each}
</ul>
