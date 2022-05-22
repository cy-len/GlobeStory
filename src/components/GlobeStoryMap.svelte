<script lang="ts">
    import Map from "./Map.svelte";
    import { borders } from "../data/borders";
    import type { BorderProperties } from "../data/borders";
    import { BordersSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { BorderSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { Border } from "../data/borders";
    import { dateStore } from "../data/stores/dateStore";
    import DatePanel from "./DatePanel.svelte";
    import "../styles/map.css";

    interface GeoJsonBorder {
        type: string;
        geometry: [];
        properties: BorderProperties;
    }

    let map: Map;

    function init() {
        borders.subscribe((bs) => {
            if (bs.length > 0) {
                dateStore.subscribe((date: Date) => {
                    displayBorders(date);
                });
            }
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
</script>

<div class="gs-map-wrapper">
    <DatePanel />
    <Map class="{$$props.class}" bind:this={map} on:ready={init} />
</div>

<style>
    .gs-map-wrapper {
        position: relative;
        height: 100%;
    }
</style>