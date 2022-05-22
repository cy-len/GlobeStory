<script lang="ts">
    import { dateStore } from "../data/stores/dateStore";
    import Button from "./Button.svelte";

    const rand = Math.round(Math.random() * 10000);
    const yearId = `${rand}-year`;
    const monthId = `${rand}-month`;
    const dayId = `${rand}-day`;

    const months = [
        { id: 0, name: "January" },
        { id: 1, name: "February" },
        { id: 2, name: "March" },
        { id: 3, name: "April" },
        { id: 4, name: "May" },
        { id: 5, name: "June" },
        { id: 6, name: "July" },
        { id: 7, name: "August" },
        { id: 8, name: "September" },
        { id: 9, name: "October" },
        { id: 10, name: "November" },
        { id: 11, name: "December" },
    ];

    let selectedYear = 2000;
    let selectedMonth = months[9];
    let selectedDay = 22;

    let selectedMonthMaxDay = 0;

    function isBisextileYear(year: number) {
        if (year % 400 === 0) return true;
        if (year % 100 === 0) return false;
        if (year % 4 === 0) return true;
        return false; 
    }

    $: {
        if (selectedMonth.id >= 7) {
            if (selectedMonth.id % 2 == 0) selectedMonthMaxDay = 30;
            else selectedMonthMaxDay = 31;
        } else {
            if (selectedMonth.id === 1) selectedMonthMaxDay = isBisextileYear(selectedYear) ? 29 : 28; // February
            else if (selectedMonth.id % 2 == 0) selectedMonthMaxDay = 31;
            else selectedMonthMaxDay = 30;
        }
        if (selectedDay > selectedMonthMaxDay) selectedDay = selectedMonthMaxDay;
    }

    function go() {
        dateStore.set(new Date(selectedYear, selectedMonth.id, selectedDay));
    }
</script>

<form class="date-picker">
    <label class="year-label" for={yearId}>Year</label>
    <input class="year-input" type="number" name="year" id={yearId} step="1" min="1886" bind:value={selectedYear} />

    <label class="month-label" for={monthId}>Month</label>
    <select class="month-input" name="month" id={monthId} bind:value={selectedMonth}>
        {#each months as month}
            <option value={month}>{ month.name }</option>
        {/each}
    </select>
    
    <label class="day-label" for={dayId}>Day</label>
    <input class="day-input" type="number" name="day" id={dayId} step="1" min="1" max={selectedMonthMaxDay} bind:value={selectedDay} />
</form>
<div class="go">
    <Button on:click={go} icon="start">Go</Button>
</div>

<style>
    .date-picker {
        display: grid;
        grid-template-areas:
            "year-label month-label day-label"
            "year-input month-input day-input";
        gap: 0.25rem 0.5rem;
    }
    label {
        display: block;
        font-size: 0.8rem;
    }

    input, select {
        display: block;
        font-size: 1rem;
    }

    .year-label {
        grid-area: year-label;
        width: 5rem;
    }

    .year-input {
        grid-area: year-input;
        width: 5rem;
    }

    .month-label {
        grid-area: month-label;
    }

    .month-input {
        grid-area: month-input;
    }

    .day-label {
        grid-area: day-label;
    }

    .day-input {
        grid-area: day-input;
    }

    .go {
        margin: 1rem 0;
    }
</style>