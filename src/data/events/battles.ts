import { writable } from "svelte/store";
import { browser } from "$app/env";
import type { ProcessedWikidataItem, TimedWikidataItem, Event } from "./wikidata";
export interface Battle extends Event {
    conflict?: ProcessedWikidataItem | null;
}

type BattleCollection = { [key: string]: Battle };

function createBattles() {
    const { subscribe, set } = writable({} as BattleCollection);

    let ready = false;

    const loadBattles = async () => {
        if (!browser) return;

        const response = await fetch("/datasets/battles_june22.json");
        const json = await response.json();

        set(json);
        ready = true;
    }

    const isBattleAtTimestamp = (timeSeconds: number, b: Battle): boolean => {
        const flattenedStart = new Date(b.startTimestamp * 1000); // For now, care only about the day, not about the time
        flattenedStart.setHours(0);
        flattenedStart.setMinutes(0);
        flattenedStart.setSeconds(0);
        const flattenedStartTimestamp = flattenedStart.getTime() / 1000;
        const end = b.endTimestamp ? b.endTimestamp : flattenedStartTimestamp + 86364; // + almost a day

        return (flattenedStartTimestamp <= timeSeconds && end >= timeSeconds);
    }

    loadBattles();

    return {
        subscribe,

        ready,

        getBattlesFromDate(d: Date): Promise<BattleCollection> {
            const timeSeconds = d.getTime() / 1000;
            return new Promise((resolve) => {
                let filtered: BattleCollection = {};
                
                const unsub = subscribe((bs) => {
                    Object.values(bs).forEach((b: Battle) => {
                        if (isBattleAtTimestamp(timeSeconds, b)) {
                            filtered[b.id] = b;
                        }
                    });
        
                });
        
                unsub();
                resolve(filtered);
            });
        },

        getBattlesAroundDate(d: Date, numBefore: number, numAfter: number): Promise<Battle[]> {
            const timeSeconds = d.getTime() / 1000;
            return new Promise((resolve) => {
                let battles: Battle[] = [];
                const unsub = subscribe((bs) => {
                    const asArray = Object.values(bs);

                    // Battles before the target date, sorted from closest to farthest (descending order)
                    const battlesBefore = asArray.filter((b: Battle) => {
                        const end = b.endTimestamp ?? b.startTimestamp;
                        return end < timeSeconds;
                    }).sort((a: Battle, b: Battle): number => {
                        return (b.endTimestamp ?? b.startTimestamp) - (a.endTimestamp ?? a.startTimestamp);
                    });
                    // Battles after the target date, sorted from closest to farthest (ascending order)
                    const battlesAfter = asArray.filter((b: Battle) => {
                        return b.startTimestamp > (timeSeconds + 86364); // almost a day
                    }).sort((a: Battle, b: Battle): number => {
                        return a.startTimestamp - b.startTimestamp;
                    });

                    const battleDuring = asArray.filter((b: Battle) => {
                        return isBattleAtTimestamp(timeSeconds, b);
                    });

                    battles = [
                        ...battlesBefore.slice(0, Math.min(numBefore, battlesBefore.length)),
                        ...battleDuring,
                        ...battlesAfter.slice(0, Math.min(numAfter, battlesAfter.length))
                    ]
                });
        
                unsub();
                resolve(battles);
            });
        }
    }
}

export const battles = createBattles();
