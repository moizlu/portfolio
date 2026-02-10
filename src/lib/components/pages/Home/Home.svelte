<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";

    import SvgIcon from "$lib/components/ui/SvgIcon";
</script>

<section id="home" class="w-full min-h-screen h-fit max-md:pb-50 flex-col-center">
    <article id="home-content" class="section-default flex-col-center">
        <img src={favicon} alt="logo" width={300} height={300} class="drop-shadow-black drop-shadow-md/100">
        <div class="flex-col-center">
            <h1>もいずる</h1>
            <h2>moizlu</h2>
            <p>プログラマー</p>
        </div>
    </article>
</section>
