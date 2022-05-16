<script>
    import DatePicker from "./DatePicker.svelte";
    import DateButton from './DateButton.svelte';
    import { dateStore } from "../data/stores/dateStore";

    let open = false;

    function togglePanel() {
        open = !open;
    }
</script>

<div class="date-panel">
    <DateButton on:click={togglePanel} date={$dateStore} />

    <div class="panel {$$props.class}" class:open="{open}">
        <DatePicker />
    </div>
</div>

<style>
    .date-panel {
        z-index: 1000;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
    }

    .panel {
        position: absolute;
        top: 0;
        left: 0;
        height: calc(100% - 1rem);
        margin: 0.5rem;
        padding: 0.5rem;
        padding-top: 6rem;
        box-sizing: border-box;
        z-index: -1;
        border-radius: 0.5rem;

        background: rgba(255, 255, 255, 0.9);

        pointer-events: none;

        transform: translateX(-2rem);
        opacity: 0;

        transition: 0.3s;
    }
    .panel.open {
        transform: translateX(0);
        opacity: 1;
        pointer-events: all;
    }
</style>