<script lang="ts">
    import Card from "./Card.svelte";
    import type { CardProps } from "./Card.svelte";

    import PhotoEditorScreenshot from "$lib/assets/images/photo-editor.png";

    const cards: CardProps[] = [
        {
            name: "画像編集ツール",
            description: "Web上で使える画像編集ツールをチームで開発しています。(現在も開発中)",
            techStack: "TypeScript, SvelteKit, Tailwind CSS, Fabric.js",
            url: "https://photoeditor.moizlu.com",
            repository: "https://github.com/moizlu/teamdev-photo-editor-web",
            images: [PhotoEditorScreenshot]
        }
    ];
</script>

<section id="works" class="min-h-dvh h-fit flex flex-col justify-start items-center">
    <article id="works-content" class="section-default mt-5 flex flex-col justify-start items-center gap-2">
        <h1>制作物</h1>
        {#each cards as card}
            <Card {...card} />
        {/each}
    </article>
</section>