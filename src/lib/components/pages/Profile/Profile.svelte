<script lang="ts">
    import avatar from "$lib/assets/icons/avatar.svg";

    import { m } from "$lib/paraglide/messages";

    import { getLocale } from "$lib/paraglide/runtime";

    import { modalWindow } from "$lib/store";
</script>

{#snippet handleOrigin()}
    <div class="w-full h-full p-10 text-center text-xs md:text-sm flex flex-col justify-center items-center">
        <p>もともと｢もみじ｣というハンドルネームを使っていたんですが、<br>一般名詞が故に没個性だなあという没個性な理由で変更しました。</p>
        <p>もみじのアルファベット表記(MOMIZI)とズールー語で空や天気を意味する｢izulu｣という単語を合成したものです。</p>
        <p>ズールー語なのはUbuntuの語源だから、｢izulu｣を選んだ理由は天気が好きだからです。</p>
        <p>つまり、大して深い意味はありません。</p>
    </div>
{/snippet}

<section id="profile" class="pt-15 px-5 w-full h-full min-h-[60vh] flex flex-col justify-center items-center gap-5 pb-10">
    <h1>{m.profile()}</h1>

    <div class="p-2 w-full max-w-200 flex max-md:flex-col justify-center items-center gap-5 rounded-xl border-label/30 border-2">
        <div class="flex flex-col justify-center items-center">
            <img src={avatar} width={200} height={200} alt={m.avatar()} class="max-md:w-30 max-md:h-30 border-label border rounded-full shadow-md/25">
            <p class="text-xl">もいずる</p>
            <p class="-mt-1 text-sm">MOIZLU</p>
        </div>

        <div class="w-full flex-1 flex flex-col justify-center items-center text-xs md:text-lg">
            {#if getLocale() === "ja"}
                <p>ソフトウェア開発を主にやっている専門学生です。</p>
                <p>最近はWeb開発とArduinoのライブラリ開発をやっています。</p>
                <p class="font-medium mt-4 mb-2">基本情報</p>
                <table class="text-xs md:text-sm">
                    <tbody>
                        <tr><th>生年月日</th><td>2006年12月26日</td></tr>
                        <tr><th>出身地</th><td>島根県</td></tr>
                        <tr><th>趣味</th><td>気分による(音楽鑑賞、プログラミング、読書など)</td></tr>
                        <tr><th>好きなもの</th><td>魚介(トロサーモンと煮魚を除く)</td></tr>
                        <tr><th>苦手なもの</th><td>虫、ゴーヤ、ナス</td></tr>
                        <tr><th>ハンドルネームの由来</th>
                            <td>
                                <span class="handle-accent">mo</span>m<span class="handle-accent">iz</span>i + <span class="handle-accent">iz</span>u<span class="handle-accent">lu</span>
                                <button onclick={() => modalWindow.open({ contents: handleOrigin })} class="pl-5 p-1 cursor-pointer">
                                    <p>{m.details()}</p>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            {:else}
                <p>I am a vocational student specializing in software development.</p>
                <p>Lately, I’ve been focusing mainly on web development and developing Arduino libraries.</p>
                <p class="font-medium mt-4 mb-2">My profile</p>
                <table class="text-xs md:text-sm">
                    <tbody>
                        <tr><th>Birth</th><td>December 26, 2006</td></tr>
                        <tr><th>Born</th><td>Shimane, Japan</td></tr>
                        <tr><th>Hobbies</th><td>Depends on my mood (listening to music, programming, reading, etc.)</td></tr>
                        <tr><th>Favorite</th><td>Seafood (excluding fatty salmon and simmered fish)</td></tr>
                        <tr><th>Dislike</th><td>Bugs, bitter melon, eggplant</td></tr>
                        <tr><th>Origin of handle</th>
                            <td>
                                <span class="handle-accent">mo</span>m<span class="handle-accent">iz</span>i + <span class="handle-accent">iz</span>u<span class="handle-accent">lu</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            {/if}
        </div>
    </div>
</section>

<style>
    @reference "../../../../routes/layout.css";

    th {
        @apply w-38 text-right text-sm pr-2 flex justify-end items-start font-normal after:content-['|'];
    }

    .handle-accent {
        @apply text-main;
    }
</style>
