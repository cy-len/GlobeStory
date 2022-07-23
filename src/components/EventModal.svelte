<script lang="ts">
    import type { Event } from "../data/events/wikidata";
    import type { Battle } from "../data/events/battles";
    import Button from "./Button.svelte";

    interface WikipediaResponse {
        ns: number;
        pageid: number;
        title: string;
        extract: string;
    }

    type AcceptedEventType = Event | Battle;

    let event: AcceptedEventType | null = null;

    let shown = false;

    let wikipediaData: WikipediaResponse | null = null;

    export function show(e: AcceptedEventType) {
        event = e;
        shown = true;
        fetchWikipedia();
    }

    export function hide() {
        wikipediaData = null;
        shown = false;
    }

    async function fetchWikipedia() {
        const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(event?.name ?? '')}`;
        const response = await fetch(url);
        const json = await response.json();
        const entries = Object.keys(json.query.pages);

        if (entries.length <= 0) return;
        const data: WikipediaResponse = json.query.pages[entries[0]];
        if (data.extract.length <= 0) return;

        wikipediaData = data;
    }

    function dateRange() {
        if (!event?.endTimestamp) {
            return new Date((event?.startTimestamp ?? 0) * 1000).toLocaleDateString();
        }
        return `${new Date((event?.startTimestamp ?? 0) * 1000).toLocaleDateString()} - ${new Date((event?.endTimestamp ?? 0) * 1000).toLocaleDateString()}`;
    }

    $: battle = event as Battle;

    $: remainingImages = (event?.images && event.images.length > 1) ? event.images.slice(1) : [];
</script>

{#if shown && event}
    <div class="backdrop">
        <div class="modal">
            {#if event.images && event.images.length > 0}
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img src={event.images[0]} alt="Main picture of the event" class="main-image" />
            {/if}
            <div class="content">
                <h1>{ event.name }</h1>
                {#if battle.conflict}
                    <div class="subtitle">Battle of { battle.conflict.name }</div>
                {/if}
                <h3 class="field">
                    <span class="material-symbols-outlined field-icon">event</span> 
                    <span>{ dateRange() }</span>
                </h3>
                <h3 class="field">
                    <span class="material-symbols-outlined field-icon">pin_drop</span> 
                    <span>{ event.location.name }</span>
                </h3>
                {#if event.description}
                    <p>{ event.description }</p>
                {/if}

                {#if wikipediaData}
                    <section>
                        <h2>Wikipedia description ({ wikipediaData.title })</h2>
                        <p>{ wikipediaData.extract.split("==")[0] }</p>
                    </section>
                {/if}

                {#if event.participants.length > 0}
                    <section>
                        <h2>Participants</h2>
                        <div class="horizontal-list">
                            {#each event.participants as participant}
                                <div class="horizontal-list-item">
                                    <div class="hli-title">{ participant.name }</div>
                                    <p class="hli-desc">{ participant.description }</p>
                                </div>
                            {/each}
                        </div>
                    </section>
                {/if}

                {#if event.partOf.length > 0}
                    <section>
                        <h2>Is a part of</h2>
                        <div class="horizontal-list">
                            {#each event.partOf as partOf}
                                <div class="horizontal-list-item">
                                    <div class="hli-title">{ partOf.name }</div>
                                    <p class="hli-desc">{ partOf.description }</p>
                                </div>
                            {/each}
                        </div>
                    </section>
                {/if}

                {#if remainingImages.length > 0}
                    <section>
                        <h2>Images</h2>
                        <div class="horizontal-list">
                            {#each remainingImages as img}
                                <img src={img} alt={img} class="horizontal-list-item" />
                            {/each}
                        </div>
                    </section>
                {/if}
            </div>
            <div class="button-row">
                <Button icon="done" on:click={hide}>Ok</Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.5);

        display: flex;
        justify-content: center;
        align-items: center;

        z-index: 100000;
    }

    .modal {
        background-color: white;
        overflow: hidden;
        border-radius: 3rem;

        max-width: 80vw;
    }

    .content {
        padding: 1rem;
        max-height: 30vh;
        overflow-y: auto;
    }

    .button-row {
        box-shadow: 0 -0.5rem 0.5rem rgba(0, 0, 0, 0.1);
        padding: 1rem 2rem;
        display: flex;
        justify-content: flex-end;
    }

    .main-image {
        display: block;
        width: 100%;
        max-height: 50vh;
        object-fit: cover;
    }

    h1 {
        margin-bottom: 0.1rem;
    }

    .subtitle {
        color: rgb(100, 100, 100);
    }

    .field {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .field-icon {
        font-size: 1.5em;
    }

    section {
        margin-top: 1rem;
        padding: 1rem 0;
        box-shadow: 0 -0.5rem 0.5rem -0.5rem rgba(0, 0, 0, 0.1);
    }

    h2 {
        margin: 0;
        margin-bottom: 0.5rem;
    }

    .horizontal-list {
        display: flex;
        align-items: stretch;
        gap: 1rem;
        overflow-x: auto;

        padding: 0.5rem 0;
    }

    .horizontal-list-item {
        padding: 0.5rem;
        border: 1px solid rgb(200, 200, 200);
        border-radius: 1rem;
        min-width: 25ch;
        max-width: 30%;
    }

    .hli-title {
        font-size: 1.125rem;
        font-weight: bold;
    }

    .hli-desc {
        margin-top: 0.5rem;
        margin-bottom: 0;
    }
</style>