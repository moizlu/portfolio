<script lang="ts">
    import CopyIcon from "$lib/assets/icons/copy.svelte";
    import CheckIcon from "$lib/assets/icons/check.svelte";

    import { m } from "$lib/paraglide/messages";

    import SvgIcon from "$lib/components/ui/SvgIcon";

    let copied = $state(false);

    interface Props {
        ticketId?: string;
    }
    const { ticketId }: Props = $props();

    const onclick = () => {
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 3000);
    }
</script>

<div class="flex flex-col justify-center items-center gap-2 mb-5">
    <h3>{m.ticket_id()}</h3>
    <p class="-mt-2 text-xs">({m.sea_proof_thrush_believe()})</p>
    <button title={m.tap_to_copy()} {onclick} class="transition-all duration-300 p-2 w-60 text-sm font-medium rounded-lg bg-base flex justify-center items-center cursor-pointer shadow-black shadow-md/50 hover:shadow-none">
            <div class="overflow-clip w-10 h-10 rounded-sm">
                <div class={["w-fit h-fit transition-all duration-600 flex flex-col justify-center items-center gap-3", (copied) ? "-translate-y-13" : "translate-0"]}>
                    <SvgIcon Svg={CopyIcon} size={40} class="w-10 h-10" />
                    <SvgIcon Svg={CheckIcon} size={40} class="w-10 h-10" />
                </div>
            </div>

            <p class="flex-1">
                {ticketId}
            </p>
    </button>
</div>
