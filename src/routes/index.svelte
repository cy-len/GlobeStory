<script>
// @ts-nocheck

    import GlobeStoryMap from "../components/GlobeStoryMap.svelte";
    import DatePanel from "../components/DatePanel.svelte";

    let map;

    function jumpToDate(event) {
        if (!map) return;
        map.displayBorders(event.detail.date);
    }
</script>

<svelte:head>
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }
    </style>
</svelte:head>

<main>
    <DatePanel class="date-panel" on:jump-to-date={jumpToDate} />
    <GlobeStoryMap class="map" bind:this={map} />
</main>

<style>
    main {
        display: grid;
        grid-template-areas: 'date-panel map';
        grid-template-columns: 300px 1fr;
    }

    .date-panel {
        grid-area: date-panel;
    }

    .map {
        grid-area: map;
    }
</style>