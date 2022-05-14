import { firestore } from "./utilities/firebase";
import { collection, query, where, getDocs, writeBatch, doc, GeoPoint, Timestamp } from "firebase/firestore";
import { readable, writable } from "svelte/store";


const bordersRef = collection(firestore, "Borders");

export interface BorderProperties {
    area: number;
    beginDate: Timestamp;
    endDate: Timestamp;
    capital: {
        location: GeoPoint;
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
        const snapshots = await getDocs(query(bordersRef));
        const bs = snapshots.docs.map((docSnapshot) => {
            const data = docSnapshot.data() as Omit<Border, 'recordId'>;
            return {
                ...data,
                recordId: docSnapshot.id
            };
        });
        
        set(bs);
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
                        return b.properties.beginDate.seconds <= timeSeconds && b.properties.endDate.seconds >= timeSeconds;
                    });
        
                });
        
                unsub();
                resolve(filtered);
            });
        }
    }
}

export const borders = createBorders();

// Data has been exported, don't use this again
async function uploadBorders() {
    /*const sourceDateToJsDate = (str: string) => {
        const splitted = str.split(' ')[0].split('.');
        return new Date(parseInt(splitted[2]), parseInt(splitted[1]) - 1, parseInt(splitted[0])); // Month is 0-indexed
    }

    const performBatch = async (startIndex: number, batchSize: number) => {
        const batch = writeBatch(firestore);

        const len = Math.min(CShapes2.length - startIndex, batchSize);
        for (let i = 0; i < len; i++) {
            const source = CShapes2[i + startIndex];
            const dest = {
                geometryString: JSON.stringify(source.geometry),
                properties: {
                    countryName: source.properties.cntry_name,
                    countryId: source.properties.gwcode,
                    area: source.properties.area,
                    capital: {
                        name: source.properties.capname,
                        location: new GeoPoint(source.properties.caplat, source.properties.caplong)
                    },
                    beginDate: sourceDateToJsDate(source.properties.gwsdate),
                    endDate: sourceDateToJsDate(source.properties.gwedate)
                }
            };
            const borderDocRef = doc(bordersRef);
            batch.set(borderDocRef, dest);

            if (i % 10 === 0) console.log(`Prepared sub-batch #${i}`);
        }

        console.log("Commiting");
        await batch.commit();
    }

    const bs = 20;

    let bi = 35 * bs;

    const doBatches = async () => {
        if (bi >= CShapes2.length) return;

        console.log(`Starting batch #${bi / bs}`);
        await performBatch(bi, bs);
        console.log("Batch done, waiting 5 seconds...");
        bi += bs;
        setTimeout(doBatches, 60000);
    };
    
    await doBatches();

    console.log("done");*/
}