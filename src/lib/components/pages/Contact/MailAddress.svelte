<script lang="ts">
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";

    import { m } from "$lib/paraglide/messages";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    const parts = ["me", "moizlu", "com"];
    let address: string |undefined = $state(undefined);
    let copied = $state(false);

    // Bot対策のためにJavaScriptで構成する
    const appear = () => {
        address = `${parts[0]}@${parts[1]}.${parts[2]}`;
    }

    const onAppearButtonClick = () => {
        if (!address) { appear(); }

        navigator.clipboard.writeText(address as string);

        copied = true;
        setTimeout(() => {
            copied = false;
        }, 3000);
    }
</script>

<div class="flex flex-col justify-center items-center gap-2 mb-5">
    <h2>{m.email_address()}</h2>
    <button onclick={onAppearButtonClick} class="transition-all duration-300 p-2 w-60 text-xl font-medium rounded-lg bg-base flex justify-center items-center cursor-pointer shadow-black shadow-md/50 hover:shadow-none">
            <div class="overflow-clip w-10 h-10 rounded-sm">
                <div class={["w-fit h-fit transition-all duration-600 flex flex-col justify-center items-center gap-3", (copied) ? "-translate-y-13" : "translate-0"]}>
                    <SvgIcon Svg={CopyIcon} size={40} class="w-10 h-10" />
                    <SvgIcon Svg={CheckIcon} size={40} class="w-10 h-10" />
                </div>
            </div>

            <p class="flex-1">
                {#if address}
                    {address}
                {:else}
                    {m.tap_to_copy()}
                {/if}
            </p>
    </button>
</div>
