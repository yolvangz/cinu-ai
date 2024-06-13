import { writable } from "svelte/store";

export const pageMeta = writable({ title: "", description: "" });

function createHistory() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		addMessage: (from, content) =>
			update((history) => [...history, { from, content }]),
		set: (history) => set(history),
		reset: () => set([]),
	};
}
export const history = createHistory();
