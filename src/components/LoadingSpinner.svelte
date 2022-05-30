<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let parts: { [key: string]: boolean }; 

    $: allCompleted = Object.values(parts).every((completed) => completed);

    $: if (allCompleted) setTimeout(() => dispatch("completed"), 1500);
</script>

<div class="spinner-wrapper glass light" class:disappearing={allCompleted}>
    <div class="spinner">
        <div class="spinner-arc first"></div>
        <div class="logo-container">
            <span class="material-symbols-outlined logo">travel_explore</span>
        </div>
        <div class="spinner-arc second"></div>
    </div>
    <div class="parts">
        {#each Object.keys(parts) as partName}
            <div class="part">
                <div class="part-left">{ partName }</div>
                <div class="part-right">
                    {#if parts[partName]}
                        <span class="material-symbols-outlined part-loaded">done</span>
                    {:else}
                        <span class="material-symbols-outlined part-loading">sync</span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .spinner-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .spinner {
        position: relative;
    }

    .spinner div {
        width: 7rem;
        height: 7rem;
    }

    .spinner-arc {
        border: 0.25rem solid transparent;
        border-top-color: black;
        border-radius: 6rem;
        position: absolute;
        top: -0.5rem;
        left: -0.5rem;
        opacity: 0;
        animation: arcs-appear 0.5s ease-in-out 1s forwards, spin 1.5s linear 1s infinite;
    }

    .spinner-arc.first {
        animation-delay: 1s, 1s;
    }

    .spinner-arc.second {
        animation-delay: 1.75s, 1.75s;
    }

    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .logo {
        font-size: 5rem;
        animation: logo-appear 1.2s linear;
    }

    .parts {
        margin-top: 2rem;
        width: 80vw;
        max-width: 16rem;
    }

    .part {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .part-loading {
        animation: spin 1.5s linear infinite;
    }

    .part-loaded {
        animation: part-loaded 1.5s ease-out;
    }

    .disappearing {
        animation: disappear 1.5s ease-in-out forwards;
    }

    @keyframes logo-appear {
        0% {
            opacity: 0;
            transform: scale(1);
        }
        40% {
            opacity: 1;
            transform: scale(1.1);
        }
        80% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes arcs-appear {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes part-loaded {
        0% {
            transform: scale(0);
        }
        40% {
            transform: scale(1.1);
        }
        45% {
            transform: scale(1);
        }
        70% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes disappear {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>