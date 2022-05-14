<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    /**
    * @param {number} n
    */
    function numToPaddedString(n) {
        return n < 10 ? `0${n}` : `${n}`;
    }

    const defaultDate = new Date(2000, 9, 22);
    let date = `${defaultDate.getFullYear()}-${numToPaddedString(defaultDate.getMonth())}-${numToPaddedString(defaultDate.getDate())}`;

    function go() {
        const parts = date.split("-");
        dispatch("jump-to-date", {
            date: new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]))
        });
    }
</script>

<div class="panel {$$props.class}">
    <form on:submit|preventDefault={go}>
        <label for="date-selector">Date :</label>
        <input type="date" name="date" id="date-selector" bind:value={date} />
        <input type="submit" value="Jump to this date" />
    </form>
</div>