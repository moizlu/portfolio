<script lang="ts">
    interface Props {
        className?: string;
    }
    let { className="" }: Props = $props();

    import { browser } from "$app/environment";
    import DropDown from "../DropDown/DropDown.svelte";

    type Theme = "light" | "dark" | "system";

    const dropDownOptions = [
        {value: "light", body: lightChoice},
        {value: "dark", body: darkChoice},
        {value: "system", body: systemChoice}
    ]

    let theme: Theme | null = $state(null);

    const onSelect = (value: string) => {
        theme = value as Theme;
    }

    if (browser) {
        const HTML: HTMLElement = document.documentElement;
        theme = localStorage.getItem("theme") as Theme | null;

        // svelte-ignore state_referenced_locally
        if (!theme) { theme = "system"; }

        const changeTheme = () => {
            switch (theme) {
                case "light":
                    HTML.classList.remove("dark");
                    break;
                case "dark":
                    HTML.classList.add("dark");
                    break;
                case "system":
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        HTML.classList.add("dark");
                    } else {
                        HTML.classList.remove("dark");
                    }
                    break;
            }

            if (theme !== null) {
                localStorage.setItem("theme", theme);
            }
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (theme === "system") {
                changeTheme();
            }
        });

        $effect(() => {
            changeTheme();
        });
    }
</script>

{#snippet themeImage(src: string, alt: string, toTheme: Theme)}
    <img {src} {alt} width={50}>
{/snippet}
{#snippet lightChoice()}
    {@render themeImage("/images/dark-theme/light.svg", "light theme", "light")}
{/snippet}
{#snippet darkChoice()}
    {@render themeImage("/images/dark-theme/dark.svg", "dark theme", "dark")}
{/snippet}
{#snippet systemChoice()}
    {@render themeImage("/images/dark-theme/system.svg", "system theme", "system")}
{/snippet}

<div class={className}>
    <DropDown bind:value={theme as string} options={dropDownOptions} {onSelect} />

</div>
