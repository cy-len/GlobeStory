import type { Border } from "../borders";

export interface BorderSnapshot {
    borderData: Border;
    extraProperties: any; // Leaflet.GeoJSONLayer
}

type BordersCollection = { [key: string]: BorderSnapshot };

type CreateBorderCallback = (borderData: Border) => any;
type DeleteBorderCallback = (borderSnapshot: BorderSnapshot) => any;

export class BordersSnapshot {
    borders: BordersCollection = {};

    onCreateBorderCallback: CreateBorderCallback = () => {};
    onDeleteBorderCallback: DeleteBorderCallback = () => {};

    constructor(newBorderCallback?: CreateBorderCallback, deleteBorderCallback?: DeleteBorderCallback) {
        if (newBorderCallback) this.onCreateBorderCallback = newBorderCallback;
        if (deleteBorderCallback) this.onDeleteBorderCallback = deleteBorderCallback;
    }

    mergeWithBordersList(list: Border[]) {
        const newBorders = list.filter((b: Border) => {
            return !this.borders[b.recordId];
        });
        const deletedBorders = Object.keys(this.borders).filter((id: string) => {
            return !list.some((b: Border) => {
                return b.recordId == id;
            })
        });

        newBorders.forEach((b: Border) => {
            this.borders[b.recordId] = {
                borderData: b,
                extraProperties: this.onCreateBorderCallback(b)
            };
        });
        deletedBorders.forEach((id: string) => {
            this.onDeleteBorderCallback(this.borders[id]);
            delete this.borders[id];
        });
    }
}