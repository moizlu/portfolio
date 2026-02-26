<script lang="ts">
    import Card from "./Card.svelte";
    import type { CardProps } from "./Card.svelte";

    import PortfolioScreenshot from "$lib/assets/images/portfolio.png";
    import PhotoEditorScreenshot from "$lib/assets/images/photo-editor.png";
    import ToolsScreenshot from "$lib/assets/images/tools.png";

    const cards: CardProps[] = [
        {
            name: "ポートフォリオサイト",
            description: "このサイトです。\nサーバーレス関数(Cloudflare Workers)を使ってフォーム送信処理を実装しました。\nセキュリティ対策として、\n1.CAPTCHA(Cloudflare Turnstile)\n2.レート制限(IPアドレス/メールアドレス/全体の送信数)\n3.サーバーサイドでのバリデーション\nを実装しています。",
            techStack: "TypeScript, SvelteKit, Tailwind CSS, Cloudflare Workers, Resend, Zod, Upstash",
            url: "https://moizlu.com",
            images: [PortfolioScreenshot]
        },
        {
            name: "画像編集ツール",
            description: "Web上で使える画像編集ツールをチームで開発しました。",
            techStack: "TypeScript, SvelteKit, Tailwind CSS, Fabric.js",
            url: "https://photoeditor.moizlu.com",
            repository: "https://moiz.lu/gh/teamdev-photo-editor-web",
            images: [PhotoEditorScreenshot]
        },
        {
            name: "Webツール",
            description: "簡単なWebツール集を作っています。絶賛機能追加中です。",
            techStack: "TypeScript, SvelteKit, Tailwind CSS",
            url: "https://tools.moizlu.com",
            repository: "https://moiz.lu/gh/portfolio-tools",
            images: [ToolsScreenshot]
        }
    ];
</script>

<section id="works" class="min-h-screen h-fit flex flex-col justify-start items-center">
    <article id="works-content" class="section-default mt-5 flex flex-col justify-start items-center gap-5">
        <h1>制作物</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each cards as card}
                <Card {...card} />
            {/each}
        </div>
    </article>
</section>