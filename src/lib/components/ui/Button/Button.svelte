<script lang="ts">
    interface Props {
        src?: string;
        alt?: string;
        iconSize?: number;
        text?: string;
        link: string;
    }
    const { iconSize = 30, ...props }: Props = $props();
</script>

<a class="w-auto
            bg-zinc-600 rounded-2xl
            flex items-center justify-rignt
            shadow-gray-800 shadow-md
            m-1 p-3
            "
    href={props.link} target="_blank">
    {#if props.src && props.alt}
        <img src={props.src} alt={props.alt} width={iconSize} height={iconSize} />
    {/if}
    {#if props.text}
        <p class="text-xl md:text-3xl m-2">{props.text}</p>
    {/if}
</a>
