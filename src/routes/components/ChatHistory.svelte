<script>
	import { history } from "../stores";
	import Message from "./Message.svelte";

	function contentParse(text) {
		let openStrong = false;
		const escapeMap = {
			"&": "&amp;",
			"\n": "<br/>",
			"<": "&lt;",
			">": "&gt;",
		};
		return text.replace(/[&<>\n]/g, (char) => {
			return escapeMap[char];
		});
	}
</script>

<div class="d-flex flex-column px-3 py-2">
	{#each $history as message (message)}
		<Message from={message.from} content={message.content} />
	{/each}
</div>
