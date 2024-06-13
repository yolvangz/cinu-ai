<script>
	import Message from "./Message.svelte";

	export let history = [];
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

<div class="d-flex flex-column px-3">
	{#each history as message (message)}
		<Message from={message.from}>{@html contentParse(message.content)}</Message>
	{/each}
</div>
