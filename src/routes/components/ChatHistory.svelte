<script>
	import Message from "./Message.svelte";

	export let history = [];
</script>

<div class="d-flex flex-column px-3">
	{#each history as message (message.id)}
		<Message from={message.from}>{message.content}</Message>
	{/each}
</div>

<style lang="scss">
</style>
