import { writable } from "svelte/store";
import { browser } from "$app/env";

export interface BorderProperties {
    area: number;
    beginTimestamp: number;
    endTimestamp: number;
    capital: {
        location: {
            latitude: number;
            longitude: number;
        };
        name: string;
    }
    countryId: number;
    countryName: string;
}

export interface Border {
    recordId: string;
    geometryString: string;
    properties: BorderProperties;
}

function createBorders() {
    const { subscribe, set } = writable([] as Border[]);

    let ready = false;

    const loadBorders = async () => {
        if (!browser) return;

        const response = await fetch("/modifiedCShapes2.json");
        const json = await response.json();

        set(json);
        ready = true;
    }

    loadBorders();

    return {
        subscribe,

        ready,

        getBordersFromDate(d: Date): Promise<Border[]> {
            const timeSeconds = d.getTime() / 1000;
            return new Promise((resolve) => {
                let filtered: Border[] = [];
        
                const unsub = subscribe((bs) => {
                    filtered = bs.filter((b: Border) => {
                        return b.properties.beginTimestamp <= timeSeconds && b.properties.endTimestamp >= timeSeconds;
                    });
        
                });
        
                unsub();
                resolve(filtered);
            });
        }
    }
}

export const borders = createBorders();