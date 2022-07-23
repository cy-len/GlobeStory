<script lang="ts">
    import DatePicker from "./DatePicker.svelte";
    import DateButton from './DateButton.svelte';
    import Button from "../Button.svelte";
    import { dateStore } from "../../data/stores/dateStore";

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

<div class="date-panel panel-container map-ui">
    <DateButton on:click={togglePanel} date={$dateStore} />

    <div class="date-panel-content panel glass light {$$props.class}" class:open="{open}">
        <DatePicker />
        <div class="toolbar">
            <Button on:click={playByDay} icon="slideshow">Play (day by day)</Button>
            <Button on:click={playByMonth} icon="slideshow">Play (month by month)</Button>
        </div>
    </div>
</div>

<style>
    .date-panel {
        top: 0;
        left: 0;
        height: 100%;
    }

    .date-panel-content {
        top: 0;
        left: 0;
        width: 20rem;
        padding-top: 6rem;

        transform: translateX(-2rem);
    }
    .date-panel-content.open {
        transform: translateX(0);
    }
</style>