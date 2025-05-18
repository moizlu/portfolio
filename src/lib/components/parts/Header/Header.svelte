<script lang="ts">
    import Button from "$lib/components/ui/Button/Button.svelte";
    import LanguageButton from "$lib/components/ui/LanguageButton/LanguageButton.svelte";
    import ThemeButton from "$lib/components/ui/ThemeButton/ThemeButton.svelte";
    import Modal from "$lib/components/ui/Modal/Modal.svelte";

    interface LinkButton {
        href: string;
        text: string;
    }

    let isHamburgerMenuOpen = $state(false);

    const routeButtons: LinkButton[] = [
        { href: "/", text: "Home"},
        { href: "/about", text: "About"},
        { href: "/works", text: "Works"},
        { href: "/contact", text: "Contact"},
    ]
    const linkButtons: {src: string, alt: string, link: string}[] = [
        { src: "/images/dark-theme/link.svg", alt: "links", link: "https://moiz.lu/" },
        { src: "/logo/x.svg", alt: "x", link: "https://moiz.lu/x" },
        { src: "/logo/github.svg", alt: "GitHub", link: "https://moiz.lu/github" },
    ];
</script>

<header>
    <div class="fixed
                w-full h-25
                flex justify-right items-center
                bg-zinc-500 dark:bg-zinc-700
                text-zinc-300 dark:bg-zing-900
                shadow-black shadow-md
                z-10
    ">
        <div class="pages flex justify-center items-center
                    p-3 m-1 gap-4 text-3xl font-bold
                    ">

            <button onclick={() => {isHamburgerMenuOpen = !isHamburgerMenuOpen}}>
                <img src="/images/dark-theme/hamburger-menu.svg" alt="menu" width={50}>
            </button>
            <a href="/"><img src="/logo/moizlu.svg" alt="logo" width={70}></a>

            <div class="hidden lg:block">
                {#each routeButtons as btn}
                    <a class="m-2 p-3 rounded-2xl bg-zinc-600 dark:bg-zinc-600 shadow-black shadow-md" href={btn.href}>{btn.text}</a>
                {/each}
            </div>
        </div>

        <div class="ml-auto mr-5 flex justify-center items-center gap-4">
            {#each linkButtons as btn}
                <div class="hidden md:block">
                    <Button src={btn.src} alt={btn.alt} link={btn.link} />
                </div>
            {/each}

            <LanguageButton />
            <ThemeButton />
        </div>
    </div>

    <Modal bind:isOpen={isHamburgerMenuOpen}>
        <div class={`fixed top-25 left-0 h-full w-70 p-5
                    flex flex-col justify-right items-start
                    bg-zinc-700
                    shadow-black shadow-md
                    transition-all duration-500
                    ${isHamburgerMenuOpen ? "translate-x-0" : "translate-x-[-300px]"}
                    `}>
            <p class="text-3xl font-bold m-2">Pages</p>
            {#each routeButtons as btn}
                <a class="w-40 my-2 mr-2 ml-10 p-3
                          rounded-2xl text-2xl
                          bg-zinc-600 dark:bg-zinc-600
                          shadow-black shadow-md
                        " href={btn.href}>{btn.text}</a>
            {/each}

            <div class="flex justify-center items-center m-2">
                        <div class="ml-auto mr-5 flex justify-center items-center gap-4">
                {#each linkButtons as btn}
                    <div class="">
                        <Button src={btn.src} alt={btn.alt} link={btn.link} />
                    </div>
                {/each}
            </div>
            </div>
            <div class="flex justify-center items-center">
                <LanguageButton />
                <ThemeButton />
            </div>
        </div>
    </Modal>
</header>
