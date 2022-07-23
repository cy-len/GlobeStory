<script lang="ts">
    import { dateStore } from "../../data/stores/dateStore";
    import { battles } from "../../data/events/battles";
    import type { Battle } from "../../data/events/battles";
    import type { CardPlacement } from "./timelineTypes";
    import { onMount, afterUpdate, createEventDispatcher } from "svelte";
    import Button from "../Button.svelte";
    import TimelineCard from "./TimelineCard.svelte";

    const dispatch = createEventDispatcher();
    
    interface TimelineMarker {
        text: string;
        column: number;
        element?: HTMLElement;
    }

    let events: Battle[] = [];

    let monthMarkers: TimelineMarker[] = generateTimeMarkers(true);
    let yearMarkers: TimelineMarker[] = generateTimeMarkers(false);

    let wrapperDiv: HTMLDivElement;
    let maxColumn: number = 0;

    let zoomFactor = 1;

    afterUpdate(() => {
        wrapperDiv.style.setProperty("--timeline-column-count", `${maxColumn}`);
        wrapperDiv.style.setProperty("--timeline-row-count", `${rowsOccupied.length}`);
        updateZoom();
    });

    onMount(() => {
        dateStore.subscribe((d: Date) => {
            const year0 = new Date(1885, 0, 1);
            const monthMarkerIndex = (d.getFullYear() - year0.getFullYear()) * 12 + d.getMonth();
            if (monthMarkerIndex < 0) return;
    
            const marker = monthMarkers[monthMarkerIndex];
            marker.element?.scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    battles.subscribe((battles) => {
        events = Object.values(battles).sort((a, b) => {
            const endA = a.endTimestamp ?? a.startTimestamp;
            const endB = b.endTimestamp ?? b.startTimestamp;
            return endA - endB;
        });
    });


    // Array of timeline rows, populated with the last column occupied by the right most item on this row
    let rowsOccupied: number[] = [];

    function timestampToColumn(timestampSeconds: number): number {
        const offset = -2682289786; // Jan 01 1885 in seconds
        const offsetedTimestamp = (timestampSeconds - offset); // number of seconds since Jan 01 1885
        const timestampDays = offsetedTimestamp / 86_400;

        return timestampDays;
    }

    function generateTimeMarkers(month: boolean): TimelineMarker[] {
        const markers: TimelineMarker[] = [];

        const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const nextYear = (new Date()).getFullYear() + 1;
        let date = new Date(1885, 0, 1);

        while (date.getFullYear() < nextYear) {
            const column = timestampToColumn(date.getTime() / 1000);
            markers.push({
                text: month ? monthsNames[date.getMonth()] : `${date.getFullYear()}`,
                column: column
            });

            if (month) {
                date.setMonth(date.getMonth() + 1);
            } else {
                date.setFullYear(date.getFullYear() + 1);
            }
        }

        return markers;
    }

    // Assumes events is sorted by endTimestamp ascending
    function placeItem(b: Battle): CardPlacement {
        const column = timestampToColumn(b.startTimestamp);
        const endColumn = b.endTimestamp ? timestampToColumn(b.endTimestamp) : column;
        const width = endColumn - column;

        if (endColumn > maxColumn) {
            maxColumn = endColumn;
        }

        for (let i = 0; i < rowsOccupied.length; i++) {
            const lastColumn = rowsOccupied[i];
            if (lastColumn < column) {
                rowsOccupied[i] = endColumn;
                return {
                    column,
                    row: i,
                    width
                };
            }
        }
        // No row satisfied the condition, so we add one
        rowsOccupied.push(endColumn);
        return {
            column,
            row: rowsOccupied.length - 1,
            width
        };
    }

    function zoomIn() {
        zoomFactor *= 2;
        updateZoom();
    }

    function zoomOut() {
        zoomFactor *= 0.5;
        updateZoom();
    }

    function updateZoom() {
        wrapperDiv.style.setProperty("--timeline-column-width", `${zoomFactor}rem`)
    }

    function dispatchViewEvent(event: Battle) {
        dispatch("display-event", { event });
    }
</script>

<div class="timeline-wrapper" bind:this={wrapperDiv}>
    <div class="markers">
        {#each yearMarkers as marker}
            <div class="marker year" style="left: calc({marker.column} * var(--timeline-column-width))">
                <span class="text">
                    { marker.text }
                </span>
            </div>
        {/each}
        {#each monthMarkers as marker}
            <div class="marker month" style="left: calc({marker.column} * var(--timeline-column-width))" bind:this={marker.element}>
                <span class="text">
                    { marker.text }
                </span>
            </div>
        {/each}
    </div>

    <div class="items">
        {#each events as event}
            <TimelineCard event={event} placement={placeItem(event)} on:display-event={() => dispatchViewEvent(event)} />
        {/each}
    </div>
</div>
<div class="timeline-toolbar">
    <Button icon="zoom_out" on:click={zoomOut}>Zoom Out</Button>
    <Button icon="zoom_in" on:click={zoomIn}>Zoom In</Button>
</div>

<style>
    .timeline-wrapper {
        position: relative;
        height: calc(calc(var(--timeline-row-count) * var(--timeline-row-height)) + 2rem);
        width: 100%;
        max-height: 50vh;
        overflow: auto;

        --timeline-column-count: 0;
        --timeline-row-count: 0;

        --timeline-column-width: 1rem;
        --timeline-row-height: 5rem;
    }

    .markers {
        position: relative;
        width: calc(var(--timeline-column-count) * var(--timeline-column-width));
        height: 5rem;
        background-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.05);
    }

    .items {
        margin-top: 1rem;
        position: relative;
    }

    .marker {
        position: absolute;
    }

    .marker.year {
        width: calc(365 * var(--timeline-column-width)); /* number of days (columns) per year */
    }
    
    .year .text {
        position: sticky;
        left: 0;
        margin-right: 1rem;
        font-size: 1.5rem;
    }

    .marker.month {
        margin-top: 3rem;
    }

    .month .text {
        padding-left: 0.5rem;
    }

    .month::before {
        content: "";
        position: absolute;
        height: calc(calc(var(--timeline-row-count) * var(--timeline-row-height)) + 3rem);
        border-left: solid 1px gray;
    }

    .timeline-toolbar {
        margin-top: 0.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }
</style>