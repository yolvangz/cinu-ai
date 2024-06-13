<script>
	import { pageMeta } from "../stores";
	import ChatInput from "../components/ChatInput.svelte";
	import ChatHistory from "../components/ChatHistory.svelte";

	pageMeta.set({
		description: "CINU.ai",
	});

	export let data;
	let history = data.chat.history;

	function addMessage(from, content) {
		history = [...history, { from, content }];
	}

	function handleChatInput(event) {
		const question = new FormData(event.target).get("chatInput").trim();
		addMessage("user", question);
		event.target.reset();
		console.log(question);
	}
</script>

<div
	class="container d-flex flex-column justify-content-between h-100 pt-3 pb-5"
>
	<section id="chatHistory" class="flex-grow-1 mt-4 mb-3">
		{#await history then}
			<ChatHistory {history} />
		{/await}
	</section>
	<div class="mt-auto pb-3">
		<ChatInput on:submit={handleChatInput} />
	</div>
</div>

<style lang="scss">
	#chatHistory {
		max-height: 100%;
		overflow-y: scroll;
		&::-webkit-scrollbar {
			width: 8px; /* Adjust width as desired */
			height: 8px; /* Adjust height as desired */
			background-color: transparent; /* Removes background color */
		}
		/* Style the scrollbar track */
		&::-webkit-scrollbar-track {
			background-color: #f5f5f5; /* Set a light background for the track */
			border-radius: 10px; /* Add rounded corners */
		}

		/* Style the scrollbar thumb */
		&::-webkit-scrollbar-thumb {
			background-color: #cccccc; /* Set a light color for the thumb */
			border-radius: 10px; /* Add rounded corners */
		}

		/* Style the thumb on hover (optional) */
		&::-webkit-scrollbar-thumb:hover {
			background-color: #aaaaaa; /* Change color on hover (optional) */
		}
	}
</style>
