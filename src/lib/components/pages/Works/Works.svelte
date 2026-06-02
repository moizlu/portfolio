<script lang="ts">
    import Portfolio1 from "$lib/assets/images/portfolio/1.webp";
    import Portfolio2 from "$lib/assets/images/portfolio/2.webp";
    import Portfolio3 from "$lib/assets/images/portfolio/3.webp";
    import Portfolio4 from "$lib/assets/images/portfolio/4.webp";
    import PortfolioDocsJp from "$lib/docs/works/jp/portfolio.md";
    import PortfolioDocsEn from "$lib/docs/works/en/portfolio.md";

    import PhotoEditor1 from "$lib/assets/images/photo-editor/1.webp";
    import PhotoEditor2 from "$lib/assets/images/photo-editor/2.webp";
    import PhotoEditor3 from "$lib/assets/images/photo-editor/3.webp";
    import PhotoEditorDocsJp from "$lib/docs/works/jp/photo-editor.md";
    import PhotoEditorDocsEn from "$lib/docs/works/en/photo-editor.md";

    import Tools1 from "$lib/assets/images/tools/1.webp";
    import Tools2 from "$lib/assets/images/tools/2.webp";
    import Tools3 from "$lib/assets/images/tools/3.webp";
    import Tools4 from "$lib/assets/images/tools/4.webp";
    import ToolsDocsJp from "$lib/docs/works/jp/tools.md";
    import ToolsDocsEn from "$lib/docs/works/en/tools.md";

    import ShimaneGuide1 from "$lib/assets/images/shimane-guide/1.webp";
    import ShimaneGuide2 from "$lib/assets/images/shimane-guide/2.webp";
    import ShimaneGuideDocsJp from "$lib/docs/works/jp/shimane-guide.md";
    import ShimaneGuideDocsEn from "$lib/docs/works/en/shimane-guide.md";

    import { m } from "$lib/paraglide/messages";

    import Card from "./Card";
    import type { Props as CardProps } from "./Card/Card.svelte";

    const cards: CardProps[] = $state([
        {
            title: m.portfolio(),
            images: [Portfolio1, Portfolio2, Portfolio3, Portfolio4],
            url: "https://moizlu.com",
            github: "https://moiz.lu/gh/portfolio",
            Description: { jp: PortfolioDocsJp, en: PortfolioDocsEn },
            techStack: ["TypeScript", "SvelteKit", "Tailwind CSS", "MDsveX", "Cloudflare Workers"]
        },
        {
            title: m.photo_editor(),
            icon: PhotoEditor2,
            images: [PhotoEditor1, PhotoEditor2, PhotoEditor3],
            url: "https://photoeditor.moizlu.com",
            github: "https://moiz.lu/gh/teamdev-photo-editor-web",
            Description: { jp: PhotoEditorDocsJp, en: PhotoEditorDocsEn},
            techStack: ["TypeScript", "SvelteKit", "Tailwind CSS", "Transformers.js", "Fabric.js"]
        },
        {
            title: m.tools(),
            icon: Tools2,
            images: [Tools1, Tools2, Tools3, Tools4],
            url: "https://tools.moizlu.com",
            github: "https://moiz.lu/gh/portfolio-tools",
            Description: { jp: ToolsDocsJp, en: ToolsDocsEn },
            techStack: ["TypeScript", "SvelteKit", "Tailwind CSS"]
        },
        {
            title: m.shimane_guide(),
            icon: ShimaneGuide2,
            images: [ShimaneGuide1, ShimaneGuide2],
            url: "https://shimane-guide.moizlu.com",
            github: "https://moiz.lu/gh/shimane-guide",
            Description: { jp: ShimaneGuideDocsJp, en:ShimaneGuideDocsEn },
            techStack: ["TypeScript", "Next.js", "Tailwind CSS"]
        }
    ]);
</script>

<section id="works" class="pt-15 w-full h-full min-h-[60vh] flex flex-col justify-center items-center gap-4 pb-10">
    <h1>{m.works()}</h1>

    <div class="w-full h-full flex justify-center items-center gap-4 flex-wrap">
        {#each cards as cardProps (cardProps)}
            <Card {...cardProps} />
        {/each}
    </div>
</section>
