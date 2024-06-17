import { ChatHeart } from "svelte-bootstrap-icons";
import { newChat } from "$core/app";

export async function load() {
	const { id, history } = await newChat();
	return {
		chat: {
			id,
			history,
		},
	};
}
