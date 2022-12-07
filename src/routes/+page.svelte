<script lang="ts">
    import AnswerBlock from "$lib/components/AnswerBlock.svelte";
    import canvasConfetti from "canvas-confetti"
    import {onMount} from "svelte";
    import {noOfAnswers} from "$lib/interfaces/Globals.js";
    import type {PageServerData} from "../../.svelte-kit/types/src/routes/$types";

    const answers = {};
    let imageSrc;
    export let data: PageServerData;

    onMount(async () => {
        for (let i = 0; i < noOfAnswers; i++) {
            answers[i] = 0;
        }
        console.log(data);

        const res = await fetch("/api/daily", {method: "POST"})
        imageSrc = await res.json();
    })

</script>

<div class="container mx-auto lg:w-1/3 px-3 py-10 ">
    <div class="card shadow-lg overflow-hidden">
        <div class="card-header p-0">
            {#if !!imageSrc}
                <img src="{imageSrc}" class="w-full" alt="Game image">
            {:else}
                <div class="animate-pulse w-auto h-64 bg-surface-300 dark:bg-surface-700 m-2 rounded-lg"></div>
            {/if}
        </div>
        <div class="card-body px-4 flex justify-center align-middle">
            {#each Array.from({length: noOfAnswers}) as block, i}
                <AnswerBlock answer="{answers[i]}" animationDelay="{i * 150}"/>
            {/each}
        </div>
        <div class="card-footer">
            <input type="text" placeholder="Guess the game..."
                   on:keyup={() => canvasConfetti({disableForReducedMotion: true, particleCount: 200, spread: 120})}
                   class="rounded-lg bg-surface-100 dark:bg-surface-400 border-surface-300 dark:border-surface-800"/>
        </div>
    </div>
</div>

