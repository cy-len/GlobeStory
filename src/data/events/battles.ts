import { writable } from "svelte/store";
import { browser } from "$app/env";
import { urlToId, pointToCoords } from "./wikidata";
import type { ProcessedWikidataItem, TimedWikidataItem, Event } from "./wikidata";

interface WikidataRawBattleEntry {
    item: string;
    itemLabel: string;
    itemDescription?: string;
    image?: string;
    partOf: string;
    partOfLabel: string;
    partOfDescription: string;
    partOfPartOf?: string;
    partOfPartOfLabel?: string;
    partOfPartOfDescription: string;
    location: string;
    locationLabel: string;
    locationCoords: string;
    locationDescription: string;
    battleCoords?: string;
    startDate: string;
    endDate: string;
    participant?: string;
    participantDescription?: string;
    participantLabel?: string;
    conflict?: string;
    conflictLabel?: string;
}

export interface Battle extends Event {
    conflict?: ProcessedWikidataItem;
}

type BattleCollection = { [key: string]: Battle };

/* function createBorders() {
    const { subscribe, set } = writable([] as Border[]);

    let ready = false;

    const loadBorders = async () => {
        if (!browser) return;

        const response = await fetch("/datasets/rawWikidataBattles_may22.json");
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

export const borders = createBorders(); */

export const processRawBattles = async function () {
    if (!browser) return;

    const raw = await fetch("/datasets/rawWikidataBattles_may22.json");
    const rawBattles: WikidataRawBattleEntry[] = await raw.json();

    const groupedRawBattles: { [key: string]: WikidataRawBattleEntry[] } = {};

    for (let rb of rawBattles) {
        if (groupedRawBattles[rb.item]) {
            groupedRawBattles[rb.item].push(rb);
        } else {
            groupedRawBattles[rb.item] = [rb];
        }
    }
    
    const battles: BattleCollection = {};
    for (let rawId in groupedRawBattles) {
        const rbs = groupedRawBattles[rawId];
        const rb = rbs[0];
        if (urlToId(rawId) === 16470) {
            console.log(rbs);
        }

        const partOf: { [key: string]: ProcessedWikidataItem } = {};
        for (let partOfCandidate of rbs) {
            const poid = urlToId(partOfCandidate.partOf);
            if (!partOf[poid]) {
                partOf[poid] = {
                    id: poid,
                    name: partOfCandidate.partOfLabel,
                    description: partOfCandidate.partOfDescription
                };
            }

            if (partOfCandidate.partOfPartOf) {
                const popoid = urlToId(partOfCandidate.partOfPartOf)
                if (!partOf[popoid]) {
                    partOf[popoid] = {
                        id: popoid,
                        name: partOfCandidate.partOfPartOfLabel,
                        description: partOfCandidate.partOfPartOfDescription
                    };
                }
            }
        }

        const participants: { [key: string]: ProcessedWikidataItem } = {};
        for (let participantsCandidate of rbs) {
            if (participantsCandidate.participant) {
                const pid = urlToId(participantsCandidate.participant);
                if (!participants[pid]) {
                    participants[pid] = {
                        id: pid,
                        name: participantsCandidate.participantLabel,
                        description: participantsCandidate.participantDescription
                    };
                }
            }
        }

        const images: { [key: string]: boolean } = {};
        for (let imageCandidate of rbs) {
            if (imageCandidate.image) {
                if (!images[imageCandidate.image]) {
                    images[imageCandidate.image] = true;
                }
            }
        }
        

        const id = urlToId(rb.item);
        const startDate = new Date(rb.startDate);
        const endDate = new Date(rb.endDate);
        const battle: Battle = {
            id: id,
            name: rb.itemLabel,
            description: rb.itemDescription,
            images: Object.keys(images),
            location: {
                id: urlToId(rb.location),
                name: rb.locationLabel,
                description: rb.locationDescription,
                coords: pointToCoords(rb.locationCoords)
            },
            coords: rb.battleCoords ? pointToCoords(rb.battleCoords) : null,
            partOf: Object.values(partOf),
            startTimestamp: startDate.getTime() / 1000, // Seconds instead of milliseconds
            endTimestamp:endDate.getTime() / 1000,
            participants: Object.values(participants),
            conflict: rb.conflict ? {
                id: urlToId(rb.conflict),
                name: rb.conflictLabel,
            } : null,
        };

        battles[id] = battle;
    }

    console.log(battles);
    console.log(Object.keys(battles).length);
    console.log(battles[16470]);
}