<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    let leaflet = null, map = null, bordersLayer = null;

    onMount(async () => {
        if (browser) {
            leaflet = await import('leaflet');

            map = leaflet.map('map').setView([0, 0], 2);

            leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                minZoom: 2,
                maxZoom: 11
            }).addTo(map);
        }
    });

    export function addGeoJson(geoJson, generatePopup, generateStyles) {
        if (!leaflet || !map) return;

        const layer = leaflet.geoJSON(geoJson, {
            style: generateStyles,
            onEachFeature: (feature, layer) => {
                const popupContent = generatePopup(feature);
                layer.bindPopup(popupContent);
            }
        });
        layer.addTo(map);

        return layer
    }
</script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>

<div id="map" class="map {$$props.class}"></div>

<style>
    #map {
        width: 100%;
        height: 100vh;
    }
</style>