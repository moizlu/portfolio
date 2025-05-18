<script lang="ts">
    interface Props {
        className?: string;
    }
    let { className="" }: Props = $props();

    import { browser } from "$app/environment";
    // import { setLocale } from "$lib/paraglide/runtime";
    import DropDown from "../DropDown/DropDown.svelte";

    type Language = "ja" | "en";

    const dropDownOptions = [
        {value: "ja", body: jaChoice},
        {value: "en", body: enChoice}
    ]

    let lang: Language | null = $state(null);

    const onSelect = (value: string) => {
        lang = value as Language;
    }

    if (browser) {
        const HTML: HTMLElement = document.documentElement;
        lang = localStorage.getItem("lang") as Language | null;

        // svelte-ignore state_referenced_locally
        if (!lang) { lang = "ja"; }

        const changeLang = () => {
            switch (lang) {
                case "ja":
                    // setLocale("ja");
                    break;
                case "en":
                    // setLocale("en");
                    break;
            }

            if (lang !== null) {
                localStorage.setItem("lang", lang);
            }
        };

        $effect(() => {
            changeLang();
        });
    }
</script>

{#snippet jaChoice()}
    <p class="text-4xl">JP</p>
{/snippet}
{#snippet enChoice()}
    <p class="text-4xl">EN</p>
{/snippet}

<div class={className}>
    <DropDown bind:value={lang as string} options={dropDownOptions} {onSelect} />
</div>
