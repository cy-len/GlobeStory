<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let date: Date = new Date();

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    function emitToggle() {
        dispatch("click");
    }
</script>

<button on:click={emitToggle} class="date-bg glass dark">
    <div class="year">{ date.getFullYear() }</div>
    <div class="month-day">{ monthNames[date.getMonth()] } { date.getDate() }</div>
</button>

<style>
    .date-bg {
        width: 5rem;
        height: 5rem;
        border: none;
        padding: 0.5rem;
        margin: 1rem;
        border-radius: 0.5rem;
        color: white;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;
    }

    .date-bg:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }

    .date-bg > div {
        pointer-events: none;
    }

    .year {
        font-size: 2rem;
    }

    .month-day {
        font-size: 1rem;
    }
</style>