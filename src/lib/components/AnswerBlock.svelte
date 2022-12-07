<script lang="ts">
    import {scale, fly} from "svelte/transition";
    import {elasticOut, backInOut} from "svelte/easing";
    import {onMount} from "svelte";

    export let answer = 0;
    export let animationDelay = 0
    export let animationDuration = 600

    const answerColors = ["bg-gray-700 dark:bg-gray-900", "bg-green-500", "bg-red-500"]
    let ready = false;

    $: answerClass = answerColors[answer] ?? answerColors[0]

    onMount(() => ready = true)
</script>

{#if ready}
    <div class="inline-block mx-1"
        transition:fly={{
        delay: animationDelay,
        duration: animationDuration,
        easing: backInOut,
        y: 48
    }}>
        <div transition:scale={{
                delay: animationDelay,
                duration: animationDuration,
                start: .5,
                duration: 600,
                easing: backInOut
             }}
             class="block rounded w-8 h-8 shadow text-white pop-enter {answerClass}">

        </div>
    </div>

{/if}

<style>

</style>
