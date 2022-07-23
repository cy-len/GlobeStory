import { writable } from "svelte/store";
import { browser } from "$app/env";
import { urlToId, pointToCoords } from "../wikidata";
import type { ProcessedWikidataItem, TimedWikidataItem, Event } from "../wikidata";
import { downloadJSON } from "../../utils/dl";

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
    conflict?: ProcessedWikidataItem | null;
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

const ww2 = {
    id: 362,
    name: "World War II"
};
const ww1 = {
    id: 361,
    name: "World War I"
};
const rcw = {
    id: 79911,
    name: "Russian Civil War"
};
const lcr = {
    id: 18702324,
    name: "Libyan Crisis"
};
const ruw = {
    id: 15860072,
    name: "Russo-Ukrainian War"
};
const ycr = {
    id: 15946570,
    name: "Yemeni Crisis"
};
const kow = {
    id: 8663,
    name: "Korean War"
};
const scw = {
    id: 178810,
    name: "Syrian Civil War"
};
const hardCodedConflicts = {
    'ww2': ww2,
    184425: ww2, // Pacific War, part of ww2
    162362: ww2, // Balkans campaign, part of ww2,
    220602: ww2, // Soviet-Japanese war
    218678: ww2, // North African Campaign
    221519: ww2, // Burma Campaign
    1052120: ww2, // East African Campaign
    5084679: ww2, // Norwegian campaign
    371573: ww2, // Philippine campaign
    162333: ww2, // Italian campaign
    709352: ww2, // Japan Campaign
    625798: ww2, // Western Desert campaign
    697829: ww2, // Liberation of france
    2238546: ww2, // "Gilbert and Marshall Islands campaign"
    216184: ww2, // Western Front
    189266: ww2, // Eastern Front
    151340: ww2, // Battle of France
    697625: ww2, // Battle of Belgium
    189930: ww2, // Operation Market Garden
    150812: ww2, // Invasion of Poland
    700120: ww2, // Occupation of Poland
    701719: ww2, // "Dnieper–Carpathian Offensive"
    157445: ww2, // Prague Offensive
    8641370: ww2, // Operation overlord
    'ww1': ww1,
    789406: ww1, // Balkans theater
    154573: ww1, // Eastern Front
    10859: {
        id: 10859,
        name: "Spanish Civil War"
    },
    8663: kow,
    7737862: kow, // Great Naktong Offensive
    243620: {
        id: 243620,
        name: "Somali Civil War"
    },
    213394: {
        id: 213394,
        name: "Sri Lankan Civil War"
    },
    159950: {
        id: 159950,
        name: "Russo-Japanese War"
    },
    182865: {
        id: 182865,
        name: "War in Afghanistan"
    },
    170314: {
        id: 170314,
        name: "Second Sino-Japanese War"
    },
    8740: {
        id: 8740,
        name: "Vietnam War"
    },
    179975: {
        id: 179975,
        name: "Chinese Civil War"
    },
    748780: {
        id: 748780,
        name: "First Indochina War"
    },
    79911: rcw, // Russian civil war
    4534186: rcw, // Southern front of russian civil war
    8729: rcw, // Russian revolution
    190029: {
        id: 190029,
        name: "Kosovo War"
    },
    545449: {
        id: 545449,
        name: "Iraq War"
    },
    37643: {
        id: 37643,
        name: "Gulf War"
    },
    165725: {
        id: 165725,
        name: "Balkan Wars"
    },
    49097: {
        id: 49097,
        name: "1947–1949 Palestine war"
    },
    242352: {
        id: 242352,
        name: "Yugoslav Wars"
    },
    48249: {
        id: 48249,
        name: "Falklands War"
    },
    748042: {
        id: 748042,
        name: "Irish Civil War"
    },
    214456: {
        id: 214456,
        name: "Philippine–American War"
    },
    178810: scw,
    30320673: scw, // Escalation of the Syrian Civil War
    82664: {
        id: 82664,
        name: "Iran–Iraq War"
    },
    257724: {
        id: 257724,
        name: "Ethiopian Civil War"
    },
    178687: {
        id: 178687,
        name: "First Sino-Japanese War"
    },
    18702324: lcr, // Libyan crisis
    81545: lcr, // First libyan civil war
    200790: {
        id: 200790,
        name: "Algerian War of Independence"
    },
    2946372: {
        id: 2946372,
        name: "Mali War"
    },
    371394: {
        id: 371394,
        name: "Bangladesh Liberation War"
    },
    17984356: {
        id: 17984356,
        name: "Iraqi Civil War (2014–2017)"
    },
    234738: {
        id: 234738,
        name: "Turkish War of Independence"
    },
    8669: {
        id: 8669,
        name: "Arab–Israeli conflict"
    },
    15860072: ruw, // Russo-Ukrainian war,
    6068230: {
        id: 6068230,
        name: "Iraqi–Kurdish conflict"
    },
    185729: {
        id: 185729,
        name: "War on Terror"
    },
    12583: {        
        id: 12583,
        name: "Spanish–American War"
    },
    1519107: {
        id: 1519107,
        name: "Afghanistan conflict"
    },
    989115: {
        id: 989115,
        name: "First Italo-Ethiopian War"
    },
    94916: {
        id: 94916,
        name: "Second Italo-Ethiopian War"
    },
    208484: {
        id: 208484,
        name: "Lebanese Civil War"
    },
    223126: {
        id: 223126,
        name: "Chaco War"
    },
    110999040: {
        id: 110999040,
        name: "2022 Russian invasion of Ukraine"
    },
    553184: {
        id: 553184,
        name: "Gaza–Israel conflict"
    },
    15946570: ycr,
    18145759: ycr, // 2014-2015 yemeni coup d'etat
    210005: ycr, // 2011 Yemeni revolution
    11264: {
        id: 11264,
        name: "Cuban Revolution"
    },
    16335075: {
        id: 16335075,
        name: "War in Donbas"
    },
    214426: {
        id: 214426,
        name: "Mexican Revolution"
    },
};

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

    console.log(groupedRawBattles["http://www.wikidata.org/entity/Q16470"]);
    
    const battles: BattleCollection = {};
    for (let rawId in groupedRawBattles) {
        const rbs = groupedRawBattles[rawId];
        const rb = rbs[0];

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

        const partOfValues = Object.values(partOf);

        let conflict = rb.conflict ? {
            id: urlToId(rb.conflict),
            name: rb.conflictLabel,
        } : null;
        if (!conflict) {
            if (partOfValues.some((po) => po.name.toLowerCase().includes("world war ii"))) {
                conflict = hardCodedConflicts.ww2;
            } else if (partOfValues.some((po) => po.name.toLowerCase().includes("world war i"))) {
                conflict = hardCodedConflicts.ww1;
            } else {
                let possibilities = partOfValues.filter((po) => (po.id in hardCodedConflicts));
                if (possibilities.length > 0) {
                    conflict = possibilities[0];
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
            partOf: partOfValues,
            startTimestamp: startDate.getTime() / 1000, // Seconds instead of milliseconds
            endTimestamp:endDate.getTime() / 1000,
            participants: Object.values(participants),
            conflict,
        };

        battles[id] = battle;
    }

    console.log(battles);
    console.log(Object.keys(battles).length);
    console.log(Object.values(battles).filter((b) => !b.conflict));

    downloadJSON(JSON.stringify(battles), "battles.json");
}