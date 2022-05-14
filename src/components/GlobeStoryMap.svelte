<script lang="ts">
    import Map from "./Map.svelte";
    import { borders } from "../data/borders";
    import type { BorderProperties } from "../data/borders";
    import { BordersSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { BorderSnapshot } from "../data/mapUtils/bordersSnapshot";
    import type { Border } from "../data/borders";
    import "../styles/map.css";

    interface GeoJsonBorder {
        type: string;
        geometry: [];
        properties: BorderProperties;
    }

    let map: Map;

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
        console.log('Delete', borderSnapshot);
        borderSnapshot.extraProperties.leafletLayer.remove();
    }

    const currentBorders = new BordersSnapshot(newBorder, deleteBorder);

    // Feature is a leaflet GeoJson feature
    function countryPopup(feature: GeoJsonBorder) {
        let beginDate = new Date(), endDate = new Date();
        beginDate.setTime(feature.properties.beginDate.seconds * 1000);
        endDate.setTime(feature.properties.endDate.seconds * 1000);
        const popupContent = `
            <h1>${feature.properties.countryName}</h1>
            <h2>Capital: ${feature.properties.capital.name}</h2>
            <p>Area: ${feature.properties.area} km2</p>
            <p>Border range of this border <br />from : ${beginDate.toLocaleDateString()}<br />to : ${endDate.toLocaleDateString()}</p>

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

<Map class="{$$props.class}" bind:this={map} />