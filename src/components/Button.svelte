<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let icon: string;

    function dispatchClick() {
        dispatch('click');
    }
</script>

<button on:click|preventDefault={dispatchClick}>
    <span class="material-symbols-outlined">{ icon }</span> 
    <span><slot /></span>
</button>

<style>
    button {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        font-size: 1rem;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        color: white;
        background-color: var(--accent-color);
        border: none;

        cursor: pointer;

        transition: var(--transition-speed-fast);
    }
    
    button:hover {
        background-color: var(--accent-color-darker);
    }
</style>