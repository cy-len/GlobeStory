<script lang="ts">
    import DatePicker from "./DatePicker.svelte";
    import DateButton from './DateButton.svelte';
    import Button from "./Button.svelte";
    import { dateStore } from "../data/stores/dateStore";

    let open = false;

    function togglePanel() {
        open = !open;
    }

    let playTimer: NodeJS.Timer | null = null;

    function stop() {
        if (!playTimer) {
            return;
        }
        clearInterval(playTimer);
        playTimer = null;
    }

    function play(nextDateCallback: (date: Date) => Date, tickSpeed = 50) {
        playTimer = setInterval(() => {
            dateStore.update((date: Date) => {
                if (date.getFullYear() > 2018) {
                    stop();
                }
                return nextDateCallback(date);
            });
        }, tickSpeed);
    }

    function playByMonth() {
        if (playTimer) {
            stop();
            return;
        }

        play((currentDate: Date) => {
            return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        });
    }

    function playByDay() {
        if (playTimer) {
            stop();
            return;
        }

        play((currentDate: Date) => {
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        });
    }
</script>

<div class="date-panel map-ui">
    <DateButton on:click={togglePanel} date={$dateStore} />

    <div class="panel glass light {$$props.class}" class:open="{open}">
        <DatePicker />
        <div class="toolbar">
            <Button on:click={playByDay} icon="slideshow">Play (day by day)</Button>
            <Button on:click={playByMonth} icon="slideshow">Play (month by month)</Button>
        </div>
    </div>
</div>

<style>
    .date-panel {
        z-index: 1000;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        pointer-events: none;
    }

    .panel {
        position: absolute;
        top: 0;
        left: 0;
        height: calc(100% - 1rem);
        width: 20rem;
        margin: 0.5rem;
        padding: 0.5rem;
        padding-top: 6rem;
        box-sizing: border-box;
        z-index: -1;
        border-radius: 0.5rem;

        pointer-events: none;

        transform: translateX(-2rem);
        opacity: 0;

        transition: 0.3s;
    }
    .panel.open {
        transform: translateX(0);
        opacity: 1;
        pointer-events: all;
    }
</style>