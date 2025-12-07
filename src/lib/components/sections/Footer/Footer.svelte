<script>
    import githubLight from "$lib/assets/icons/light/github.svg";
    import githubDark from "$lib/assets/icons/dark/github.svg";

    import Icon from "$lib/components/ui/Icon/Icon.svelte";
</script>

<footer class="z-1000 fixed bottom-[90px] md:bottom-0 left-0 p-2 md:p-10">
    <div class="p-3 rounded-full bg-base/50 backdrop-blur-sm">
        <a target="_blank" href="https://moiz.lu/github">
            <Icon lightSrc={githubLight} darkSrc={githubDark} size={30} class="" />
        </a>
    </div>
</footer>