<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import type { Battle } from "../../data/events/battles";
    import type { CardPlacement } from "./timelineTypes";

    const dispatch = createEventDispatcher();

    export let event: Battle;
    export let placement: CardPlacement;

    let wrapperDiv: HTMLDivElement;
    let showBackgroundImage = false;

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((e: IntersectionObserverEntry) => {
            showBackgroundImage = showBackgroundImage || e.isIntersecting;
        });
    }, {
        rootMargin: "200px"
    });

    onMount(() => {
        intersectionObserver.observe(wrapperDiv);
    });

    $: cssPosition = `left: calc(${placement.column} * var(--timeline-column-width)); top: calc(${placement.row} * var(--timeline-row-height)); width: calc(${placement.width} * var(--timeline-column-width));`;
    $: backgroundImage = (showBackgroundImage && placement.width > 5 && event.images && event.images.length > 0) ? `background-image: url('${event.images[0]}');` : '';
    $: textMaxWidth = `max-width: ${event.name.length}rem;`;

    function showModal() {
        dispatch("display-event", { event });
    }
</script>

<div class="card battle" style="{cssPosition} {backgroundImage}" on:click={showModal} bind:this={wrapperDiv}>
    <div class="card-content">
        <span class="material-symbols-outlined event-type-icon">swords</span>
        <div class="card-text" style="{textMaxWidth}">
            <div class="event-name">{ event.name }</div>
            <div class="event-date">{ (new Date(event.startTimestamp * 1000)).toLocaleDateString() } - { (new Date((event.endTimestamp ?? event.startTimestamp) * 1000)).toLocaleDateString() }</div>
        </div>
    </div>
</div>

<style>
    .card {
        position: absolute;
        background-position: center;
        background-size: cover;
        overflow: hidden;

        height: var(--timeline-row-height);
        border-radius: 0.5rem;
        box-sizing: border-box;
        border: 1px solid;
        
        cursor: pointer;

        transition: 0.3s;
    }

    .card.battle {
        border-color: rgb(150, 3, 3);
    }

    .card:hover {
        border-color: rgb(255, 255, 255);
    }
    
    .card-content {
        position: relative;
        width: 100%;
        height: 100%;
        isolation: isolate;
        box-sizing: border-box;
        padding: 0.5rem;
        color: white;
    }

    .card-content::before {
        content: "";
        position: absolute;
        width: calc(100% + 5rem);
        height: 100%;
        margin: -0.5rem;
        background: linear-gradient(to right, rgba(150, 3, 3, 0.9), rgba(150, 3, 3, 0.9) 18rem ,rgba(255, 0, 0, 0.1) 20rem);
        z-index: -1;

        transform: translateX(-5rem);

        transition: 0.5s;
    }

    .card:hover .card-content::before {
        transform: translateX(0);
    }

    .event-type-icon {
        position: absolute;
        left: 0.25rem;
        top: 0.25rem;
        color:rgba(0, 0, 0, 0.2);
        font-size: var(--timeline-row-height);
        z-index: -1;
        pointer-events: none;
    }

    .card-text {
        margin-left: 1rem;
        overflow: hidden;
        white-space: nowrap; /* Don't forget this one */
        text-overflow: ellipsis;
    }

    .event-name {
        font-size: 1.25rem;
    }

    .event-date {
        font-size: 0.75rem;
    }
</style>