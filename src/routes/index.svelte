<script>
// @ts-nocheck

    import GlobeStoryMap from "../components/GlobeStoryMap.svelte";
    import "../styles/global.css";

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
    <GlobeStoryMap class="map" bind:this={map} />
</main>

<style>
</style>