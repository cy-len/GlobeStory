<script lang="ts">
    import Map from "./Map.svelte";
    import { borders } from "../data/borders";
    import type { BorderProperties } from "../data/borders";
    import { BordersSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { BorderSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { Border } from "../data/borders";
    import { battles } from "../data/events/battles";
    import type { Battle } from "../data/events/battles";
    import type { Event } from "../data/events/wikidata";
    import { dateStore } from "../data/stores/dateStore";
    import DatePanel from "./DatePanel/DatePanel.svelte";
    import LoadingSpinner from "./LoadingSpinner.svelte";
    import "../styles/map.css";
    import EventModal from "./EventModal.svelte";
    import TimelinePanel from "./Timeline/TimelinePanel.svelte";

    interface GeoJsonBorder {
        type: string;
        geometry: [];
        properties: BorderProperties;
    }

    let map: Map;

    let loadingParts = {
        "Map base tiles": false,
        "Country borders": false,
        "Battles": false,
    };

    let loading = true;

    let eventModal: EventModal;

    const divIcons = {
        "battle": `<div class="custom-marker battle"><span class="material-symbols-outlined marker-icon">swords</span></div>`
    };

    function init() {
        loadingParts["Map base tiles"] = true;
        borders.subscribe((bs) => {
            if (bs.length > 0) {
                loadingParts["Country borders"] = true;
            }
        });
        battles.subscribe((bs) => {
            if (Object.entries(bs).length > 0) {
                loadingParts["Battles"] = true;
            }
        });
    }

    function onLoadingCompleted() {
        loading = false;

        dateStore.subscribe(async (date: Date) => {
            await displayBorders(date);
            await displayBattles(date);
        });
    }


    const newBorder = (borderData: Border) => {
        const geoJson = {
            type: "Feature",
            geometry: JSON.parse(borderData.geometryString),
            properties: borderData.properties
        }
        return {
            leafletLayer: map.addGeoJson(geoJson, countryPopup, countryStyle)
        };
    }

    const deleteBorder = (borderSnapshot: BorderSnapshot) => {
        borderSnapshot.extraProperties.leafletLayer.remove();
    }

    const currentBorders = new BordersSnapshot(newBorder, deleteBorder);

    // Feature is a leaflet GeoJson feature
    function countryPopup(feature: GeoJsonBorder) {
        let beginDate = new Date(), endDate = new Date();
        beginDate.setTime(feature.properties.beginTimestamp * 1000);
        endDate.setTime(feature.properties.endTimestamp * 1000);
        const popupContent = `
            <h1>${feature.properties.countryName}</h1>
            <h2>Capital: ${feature.properties.capital.name}</h2>
            <p>Area: ${feature.properties.area} km2</p>
            <p>Date range of this border <br />from : ${beginDate.toLocaleDateString()}<br />to : ${endDate.toLocaleDateString()}</p>

        `;

        return popupContent;
    }

    function countryStyle(feature: GeoJsonBorder) {
        return {
            color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
            className: 'country'
        }
    }

    export async function displayBorders(date: Date) {
        const rawBorders = await borders.getBordersFromDate(date);
        currentBorders.mergeWithBordersList(rawBorders);
    }

    export async function displayBattles(date: Date) {
        map.clearLayer("battles");
        const bs = await battles.getBattlesFromDate(date);
        Object.values(bs).forEach((battle) => {
            const coords = battle.coords ? [battle.coords.latitude, battle.coords.longitude] : [battle.location.coords.latitude, battle.location.coords.longitude];
            map.addMarker(coords, divIcons.battle, () => {
                displayEventDetail(battle);
            }, "battles");
        });
    }

    function displayEventDetail(event: Battle) {
        eventModal.show(event);
    }
</script>

<div class="gs-map-wrapper">
    {#if loading}
        <LoadingSpinner parts={loadingParts} on:completed={onLoadingCompleted} />
    {/if}
    <DatePanel />
    <TimelinePanel on:display-event={(event) => displayEventDetail(event.detail.event)} />
    <Map class="{$$props.class}" bind:this={map} on:ready={init} />
    <EventModal bind:this={eventModal} />
</div>

<style>
    .gs-map-wrapper {
        position: relative;
        height: 100%;
        overflow: hidden;
    }
</style>