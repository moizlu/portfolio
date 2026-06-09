<script lang="ts">
    import avatar from "$lib/assets/icons/avatar.svg";
    import GitHubLight from "$lib/assets/icons/light/github.svg";
    import GitHubDark from "$lib/assets/icons/dark/github.svg";
    import XLight from "$lib/assets/icons/light/x.svg";
    import XDark from "$lib/assets/icons/dark/x.svg";
    import QRLight from "$lib/assets/icons/light/qr.svg";
    import QRDark from "$lib/assets/icons/dark/qr.svg";

    import LinkIcon from "$lib/assets/icons/link.svelte";

    import ShareIcon from "$lib/assets/icons/share.svelte";
    import ArrowIcon from "$lib/assets/icons/arrow.svelte";

    import { onMount } from "svelte";

    import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { motionReduced } from "$lib/utils";

    import CopyButton from "$lib/components/ui/CopyButton";
    import SvgIcon from "$lib/components/ui/SvgIcon";
    import Icon from "$lib/components/ui/Icon";

    import { modalWindow } from "$lib/store";

    let avatarElement: HTMLImageElement | undefined = $state(undefined);
    let jpHandleElement: HTMLParagraphElement | undefined = $state(undefined);
    let enHandleElement: HTMLParagraphElement | undefined = $state(undefined);
    let briefIntroElement: HTMLParagraphElement | undefined = $state(undefined);

    const linkButtons: HTMLElement[] = [];

    const onShareClicked = () => {
        if (navigator.share) {
            navigator.share({ title: "もいずる | moizlu", url: "https://moizlu.com" });
        } else {
            modalWindow.open({ contents: share, title: m.share_this_page(), window: { mode: 'window', controls: true, square: true } })
        }
    }

    onMount(() => {
        const onSplashHidden = () => {
            if (!avatarElement || !jpHandleElement || !enHandleElement || !briefIntroElement) { return; }

            const reduced = motionReduced();

            avatarElement.style.animationPlayState = "running";
            // jpHandleElement.style.animationPlayState = "running";
            // enHandleElement.style.animationPlayState = "running";
            briefIntroElement.style.animationPlayState = "running";

            let delay = 100;
            for (const char of jpHandleElement.querySelectorAll("span")) {
                char.style.animationDelay = `${delay}ms`;
                char.style.animationPlayState = "running";
                if (reduced) {
                    char.style.animationDuration = "0ms";
                    char.style.animationDelay = "0ms";
                }

                delay += 30;
            }
            jpHandleElement.style.animationPlayState = "running";

            delay = 200;
            for (const char of enHandleElement.querySelectorAll("span")) {
                char.style.animationDelay = `${delay}ms`;
                char.style.animationPlayState = "running";
                if (reduced) {
                    char.style.animationDuration = "0ms";
                    char.style.animationDelay = "0ms";
                }

                delay += 30;
            }
            enHandleElement.style.animationPlayState = "running";

            delay = 700;
            for (const link of linkButtons) {
                link.style.animationDelay = `${delay}ms`;
                link.style.animationPlayState = "running";
                if (reduced) {
                    link.style.animationDuration = "0ms";
                    link.style.animationDelay = "0ms";
                }

                delay += 50;
            }
        }

        document.addEventListener('splashHidden', onSplashHidden);

        return () => {
            document.removeEventListener('splashHidden', onSplashHidden);
        }
    });
</script>

<!-- 共有画面(navigator.share()が使えない時のフォールバック) -->
{#snippet share()}
    <div class="w-full h-full flex flex-col justify-center items-center">
        <Icon lightSrc={QRLight} darkSrc={QRDark} size={500} class="w-50 h-50 min-[300px]:w-75 min-[300px]:h-75" />
        <div class="flex justify-center items-center gap-2">
            <CopyButton text="https://moizlu.com/">
                <p class="text-2xl">https://moizlu.com/</p>
            </CopyButton>
        </div>
    </div>
{/snippet}

<section id="home" class="w-full min-h-svh flex flex-col justify-center items-center pb-10
before:transition-all before:duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url(/images/room2.webp)] before:bg-cover before:bg-center before:brightness-130 dark:before:brightness-50 before:bg-fixed">
    <div class="flex justify-center items-center bg-white">
        <img bind:this={avatarElement} src={avatar} alt={m.avatar()} width={80} height={80} class="avatar">

        <div class="text-center">
            <!-- <p bind:this={jpHandleElement} class="handle jp-handle popup-string"><span class="popup-string">も</span><span class="popup-string">い</span><span class="popup-string">ず</span><span class="popup-string">る</span></p> -->
            <p bind:this={jpHandleElement} class="handle jp-handle popup-string"><span>も</span><span>い</span><span>ず</span><span>る</span></p>
            <p bind:this={enHandleElement} class="handle en-handle popup-string"><span>M</span><span>O</span><span>I</span><span>Z</span><span>L</span><span>U</span></p>
        </div>
    </div>
    <div class="-mt-3">
        <p bind:this={briefIntroElement} class="p-1 brief-intro bg-base/50 rounded-sm">{m.brief_intro()}</p>
    </div>

    <!-- リンク集 -->
    <div class="mt-10 flex flex-col justify-center items-center gap-2">
        <div class="flex justify-center items-center gap-5">
            <a bind:this={linkButtons[0]} target="_blank" title="GitHub" href="https://moiz.lu/github" class="link-button"><Icon lightSrc={GitHubLight} darkSrc={GitHubDark} size={30} /></a>
            <a bind:this={linkButtons[1]} target="_blank" title="X(Twitter)" href="https://moiz.lu/x" class="link-button"><Icon lightSrc={XLight} darkSrc={XDark} size={30} /></a>
            <a bind:this={linkButtons[2]} target="_blank" title={m.Links()} href="https://moiz.lu/" class="link-button"><SvgIcon Svg={LinkIcon} size={30} /></a>
        </div>
        <!-- この2つはアニメーションなし -->
        <button bind:this={linkButtons[3]} title={m.share_this_page()} onclick={onShareClicked} class="transition-all duration-300 p-2 cursor-pointer flex justify-center items-center bg-base/50 backdrop-blur-sm rounded-sm shadow-black shadow-sm/50 hover:shadow-none">
            <SvgIcon Svg={ShareIcon} size={25} />
            <p class="text-sm">{m.share_this_page()}</p>
        </button>

        <a bind:this={linkButtons[4]} title={m.go_to_the_profile_section()} href="#profile" class="transition-all duration-300 m-2 p-1 backdrop-blur-sm bg-base/50 rounded-sm shadow-black shadow-sm/50 hover:shadow-none">
            <div class="next-section">
                <SvgIcon Svg={ArrowIcon} size={80} class="rotate-180" />
            </div>
        </a>
    </div>

    {#if getLocale() === "en"}
            <p class="z-1 text-xs text-center p-1 bg-base/50 backdrop-blur-sm rounded-sm">I'm sorry, but since I’m not very good at English, the English on this page is based on a machine translation from Japanese.<br>
    Therefore, some of the wording may be inaccurate.</p>
    {/if}
</section>

<style>
    @reference "../../../../routes/layout.css";

    @layer components {
        @keyframes popup{
            from {
                translate: 0 5rem;
                opacity: 0;
            }

            50% {
                opacity: 0;
            }

            to {
                translate: 0 0;
                opacity: 1;
            }
        }

        @keyframes bounce {
            from { translate: 0 -0.5rem; }
            50% { translate: 0 0.5rem; }
            to { translate: 0 -0.5rem; }
        }

        .next-section {
            animation: 1s ease-in-out infinite both bounce;
        }

        .avatar {
            @apply opacity-0 w-25 h-25 sm:w-50 sm:h-50 drop-shadow-md drop-shadow-black/50;
            animation: 0.5s ease 0.5s 1 both popup;
            animation-play-state: pause;
        }

        .handle {
            @apply opacity-0 font-bold;
        }

        .jp-handle {
            @apply text-3xl sm:text-6xl;
        }

        .en-handle {
            @apply text-2xl sm:text-4xl;
        }

        .popup-string {
            animation: 0.5s ease 1 both popup;
            animation-play-state: paused;
        }

        .popup-string > span {
            animation: 0.5s ease 1 both popup;
            animation-play-state: paused;
        }

        .brief-intro {
            @apply opacity-0 text-xs sm:text-xl;
            animation: 0.5s ease 0.2s 1 both popup;
            animation-play-state: paused;
        }

        .link-button {
            @apply transition-all duration-300 hover:scale-110 opacity-0;

            animation: 0.5s ease 1 both popup;
            animation-play-state: pause;
        }

        @media (prefers-reduced-motion: reduce) {
            .next-section {
                animation: none;
            }
        }
    }
</style>
