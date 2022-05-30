interface ProcessedWikidataItem {
    id: number;
    name: string;
    description?: string;
    images?: string[];
};

interface TimedWikidataItem extends ProcessedWikidataItem {
    startTimestamp: number;
    endTimestamp?: number; // Can be set to null for one-day event
}

interface Coordinates {
    latitude: number;
    longitude: number;
};

interface Location extends ProcessedWikidataItem {  
    coords: Coordinates;
};

interface Event extends TimedWikidataItem {
    location: Location;
    coords?: Coordinates; // Coordinates that were directly extracted from the item independently from its location, may be more precise and if set to null we use location.coords as a fallback
    partOf: ProcessedWikidataItem[];
    participants: ProcessedWikidataItem[];
};

export type { ProcessedWikidataItem, TimedWikidataItem, Coordinates, Location, Event };

export function urlToId(url: string): number {
    return parseInt(url.replace("http://www.wikidata.org/entity/Q", ""));
};

export function pointToCoords(point: string) {
    const split = point.replace("Point(", "").replace(")", "").split(" ");

    return {
        latitude: parseFloat(split[0]),
        longitude: parseFloat(split[1])
    };
};