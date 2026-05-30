<div class="container w-50 h-15 flex flex-row-reverse justify-center items-center gap-2">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
</div>

<style>
    @reference "../../../../routes/layout.css";

    @keyframes dot-move {
        from { translate: -2.5rem -1rem; } /* 移動開始 */
        10% { translate: 0.5rem -1rem; }   /* 移動完了(バウンド) */
        20% { translate: 0rem -1rem; }     /* バウンド完了 */
        50% { translate: 0rem -1rem; }     /* 落下開始 */
        60% { translate: 0rem 1.5rem; }    /* 落下終了(バウンド) */
        70% { translate: 0rem 1rem; }      /* バウンド完了 */
        90% { translate: 0rem 1rem; }      /* 移動開始 */
        to   { translate: 2.5rem 1rem; }   /* 移動完了 */
    }

    @keyframes dot-opacity {
        from { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        to { opacity: 0; }
    }

    .dot {
        @apply w-5 h-5 rounded-sm bg-main;
        animation: 1.5s ease-in-out infinite both dot-move, 1.5s ease-in infinite both dot-opacity;
    }

    .dot:nth-child(2) {
        animation-delay: 125ms;
    }
    .dot:nth-child(3) {
        animation-delay: 250ms;
    }
    .dot:nth-child(4) {
        animation-delay: 375ms;
    }

</style>
