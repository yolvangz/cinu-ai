import { writable } from "svelte/store";

export const pageMeta = writable({ title: "", description: "" });
