<script lang="ts">
    import SvelteLogo from "$lib/assets/icons/svg/svelte-logo.svg";
    import ReactLogo from "$lib/assets/icons/svg/react-logo.svg";
    import TailwindCSSLogo from "$lib/assets/icons/svg/tailwindcss-logo.svg";
    import ArduinoCommunityLogo from "$lib/assets/icons/svg/arduino-community-logo.svg";

    import { getLocale } from "$lib/paraglide/runtime";
    import { m } from "$lib/paraglide/messages";
</script>

<section id="skill" class="pt-15 w-full h-full min-h-[60vh] bg-base-accent flex flex-col justify-center items-center gap-3 pb-10 px-4">
    <!-- <div class="w-full h-full flex flex-col justify-center items-center gap-3"> -->
        <h1 class="text">{m.skills_and_achievements()}</h1>
        <h3>{m.major_achievements()}</h3>

        <table class="table-auto text-xs sm:text-xl md:text-2xl">
            <tbody>
                {#if getLocale() === "ja"}
                    <tr>
                        <th>基本情報技術者試験</th>
                        <td>合格</td>
                    </tr>
                    <tr>
                        <th>第32回全国高校ロボット競技大会</th>
                        <td>3位入賞(90^チーム中)</td>
                    </tr>
                    <tr>
                        <th>ジュニアマイスター顕彰制度</th>
                        <td>シルバー</td>
                    </tr>
                {:else}
                    <tr>
                        <th>Fundamental Information Technology Engineer Examination</th>
                        <td>Passed</td>
                    </tr>
                    <tr>
                        <th>第32回全国高校ロボット競技大会<span class="text-xs">(No English title)</span></th>
                        <td>3rd place(out of 90^ teams)</td>
                    </tr>
                    <tr>
                        <th>ジュニアマイスター顕彰制度<span class="text-xs">(No English title)</span></th>
                        <td>Silver</td>
                    </tr>
                {/if}
            </tbody>
        </table>

        <div class="flex flex-col justify-center items-center gap-5">
            <h3>{m.technologies_i_frequently_use()}</h3>
            <div class="w-70 tech-logo-container flex justify-center items-center gap-5 flex-wrap">
                <img src={SvelteLogo} alt="svelte logo" width={500} height={500}>
                <img src={ReactLogo} alt="react logo" width={500} height={500}>
                <img src={TailwindCSSLogo} alt="tailwindcss logo" width={500} height={500}>
                <img src={ArduinoCommunityLogo} alt="arduino community logo" width={500} height={500}>
            </div>
        </div>
    <!-- </div> -->
</section>

<style>
    @reference "../../../../routes/layout.css";

    tbody th {
        @apply text-left font-normal py-2 text-sm;
    }

    tbody td {
        @apply px-10 text-left font-bold text-sm;
    }

    .tech-logo-container > img {
        @apply w-10 h-10;
    }
</style>
