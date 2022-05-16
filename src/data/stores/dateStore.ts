import { writable } from "svelte/store";

export const dateStore = writable(new Date(2000, 9, 22));