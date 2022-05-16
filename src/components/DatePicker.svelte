<script lang="ts">
    import { dateStore } from "../data/stores/dateStore";

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

    function nextMonth() {
        if (selectedMonth.id >= 11) {
            selectedMonth = months[0];
            selectedYear++;
        } else {
            selectedMonth = months[selectedMonth.id + 1];
        }
    }

    function previousMonth() {
        if (selectedMonth.id <= 0) {
            selectedMonth = months[11];
            selectedYear--;
        } else {
            selectedMonth = months[selectedMonth.id - 1];
        }
    }

    function go() {
        dateStore.set(new Date(selectedYear, selectedMonth.id, selectedDay));
    }
</script>

<form class="date-picker">
    <label class="year-label" for={yearId}>Year</label>
    <input class="year-input" type="number" name="year" id={yearId} step="1" min="1886" bind:value={selectedYear} />

    <label class="month-label" for={monthId}>Month</label>
    <div class="row">
        <select name="month" id={monthId} bind:value={selectedMonth}>
            {#each months as month}
                <option value={month}>{ month.name }</option>
            {/each}
        </select>
        <button on:click|preventDefault={previousMonth}>-</button>
        <button on:click|preventDefault={nextMonth}>+</button>
    </div>
    
    <label class="day-label" for={dayId}>Day</label>
    <input class="day-input" type="number" name="day" id={dayId} step="1" min="1" max={selectedMonthMaxDay} bind:value={selectedDay} />

    <button on:click|preventDefault={go}>Go</button>
</form>

<style>
    label {
        display: block;
        font-size: 0.8rem;
    }

    input, select {
        display: block;
        font-size: 1rem;
        flex: 1;
    }

    .row {
        display: flex;
        gap: 0.25rem;
    }
</style>