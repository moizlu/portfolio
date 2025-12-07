<script lang="ts">
    import Card from "./Card.svelte";
    import type { Props as CardProps } from "./Card.svelte";

    import photoEditorScreenshot from "$lib/assets/images/screenshots/photoeditor.png";

    const cards: CardProps[] = [
        {
            name: "画像編集ツール",
            description: "Web上で使える画像編集ツールをチームで開発しています。(現在も開発中)",
            techStack: "TypeScript, SvelteKit, Tailwind CSS, Fabric.js",
            url: "https://photoeditor.moizlu.com",
            repository: "https://github.com/moizlu/teamdev-photo-editor-web",
            images: [photoEditorScreenshot]
        }
    ];
</script>

<section id="works" class="min-h-screen scroll-mb-[70px] md:scroll-mt-[70px] pt-3 flex flex-col justify-start items-center">
    <h1>制作物</h1>
    {#each cards as card}
        <Card name={card.name} description={card.description} techStack={card.techStack} url={card.url} repository={card.repository} images={card.images} />
    {/each}
</section>