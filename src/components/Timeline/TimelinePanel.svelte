<script lang="ts">
    import Button from "../Button.svelte";
    import Timeline from "./Timeline.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let open = true;

    function togglePanel() {
        open = !open;
    }

    function dispatchViewEvent(event: any) {
        dispatch("display-event", { event });
    }
</script>

<div class="timeline-panel panel-container map-ui">
    <div class="timeline-opener">
        <Button icon="view_timeline" on:click={togglePanel}>Timeline</Button>
    </div>

    <div class="timeline-panel-content panel glass light {$$props.class}" class:open="{open}">
        <Timeline on:display-event={(event) => dispatchViewEvent(event.detail.event)} />
    </div>
</div>

<style>
    .timeline-panel {
        bottom: 0;
        left: 0;
        width: 100%;
        pointer-events: none;
    }

    .timeline-opener {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        pointer-events: all;
        margin: 1rem 1rem;
    }

    .timeline-panel-content {
        bottom: 0;
        left: 0;
        width: calc(100% - 1rem);
        box-sizing: border-box;
        overflow: hidden;

        transform: translateY(2rem);
    }
    .timeline-panel-content.open {
        transform: translateY(0);
    }
</style>