<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let leaflet = null, map = null;
    const layerGroups = {};

    onMount(async () => {
        if (browser) {
            leaflet = await import('leaflet');

            map = leaflet.map('map').setView([0, 0], 2);

            const tiles = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                minZoom: 2,
                maxZoom: 11,
                zoomControl: false
            });
            tiles.addTo(map);
            
            map.zoomControl.remove();
            leaflet.control.zoom({
                position: 'topright'
            }).addTo(map);

            tiles.on("load", () => dispatch("ready"));
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

        return layer;
    }

    export function addMarker(coords, icon, clickCallback, layerGroupName = "default") {
        if (!leaflet || !map) return;

        const marker = leaflet.marker(coords, icon ? {icon: leaflet.divIcon({html: icon})} : {});

        marker.on("click", clickCallback);

        if (!layerGroups[layerGroupName]) {
            const layer = leaflet.layerGroup();
            layer.addTo(map);
            layerGroups[layerGroupName] = layer;
        }

        marker.addTo(layerGroups[layerGroupName]);

        return marker;
    }

    export function clearLayer(layerGroupName) {
        if (!layerGroups[layerGroupName]) return;
        layerGroups[layerGroupName].clearLayers();
    }
</script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css" integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==" crossorigin=""/>

<div id="map" class="map {$$props.class}"></div>

<style>
    #map {
        width: 100%;
        height: 100%;
    }
</style>