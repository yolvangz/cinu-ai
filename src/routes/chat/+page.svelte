<script>
	import { pageMeta } from "../stores";
	import ChatInput from "../components/ChatInput.svelte";
	import ChatHistory from "../components/ChatHistory.svelte";
	import Loader from "../components/Loader.svelte";

	pageMeta.set({
		description: "CINU.ai",
	});

	export let data;
	let history = data.chat.history;
	let disabled = false;
	let before, after;

	function addMessage(from, content) {
		history = [...history, { from, content }];
	}

	function handleChatInput(event) {
		const question = new FormData(event.target).get("chatInput").trim();
		if (disabled || question.length === 0) return;
		// reset and block input
		event.target.reset();
		disabled = !disabled;
		// update chat history
		addMessage("user", question);
		// get answer
		const response = fetch("/api/answer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ history, question }),
		})
			.then((res) => res.json())
			.then((res) => {
				addMessage(res.answer.from, res.answer.content);
				disabled = !disabled;
			});
	}
	function updateScrolling(event) {
		const container = event.target;
		const innerHeight = parseInt(
			window.getComputedStyle(container, null).getPropertyValue("height")
		);
		const scrollTop = container.scrollTop;
		const elementHeight = before.offsetHeight; // Height of the element

		const newTop = scrollTop * 1; // Adjust factor (play with this value for effect)
		// Ensure the element stays within viewport bounds
		const newPosition = Math.min(
			Math.max(newTop, 0),
			innerHeight - elementHeight
		);
		before.style.top = `${newPosition}px`;
		after.style.bottom = `-${newPosition}px`;
	}
</script>

<div
	class="container d-flex flex-column justify-content-between h-100 pt-3 pb-5"
>
	<section
		id="chatHistory"
		class="background-gradient flex-grow-1 mt-4 mb-3 d-flex flex-column justify-content-between scroll-container"
		on:scroll={updateScrolling}
	>
		<span bind:this={before} class="before"></span>
		{#await history then}
			<div class="history-wrapper py-2">
				<ChatHistory {history} />
			</div>
		{/await}
		{#if disabled}
			<div class="loading-wrapper">
				<Loader>Generando respuesta...</Loader>
			</div>
		{/if}
		<span bind:this={after} class="after"></span>
	</section>
	<div class="mt-auto pb-3">
		<ChatInput on:submit={handleChatInput} {disabled} />
	</div>
</div>

<style lang="scss">
	#chatHistory {
		max-height: 100%;
		overflow-y: scroll;
		position: relative;
		.before {
			display: block;
			width: 100%;
			height: 25px;
			position: absolute;
			top: 0px;
			background: linear-gradient(to bottom, #fff, rgba(255, 255, 255, 0) 100%);
			z-index: 1;
		}
		.after {
			display: block;
			width: 100%;
			height: 25px;
			position: absolute;
			bottom: 0px;
			background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 100%);
			z-index: 1;
		}
	}
	.loading-wrapper {
		position: sticky;
		z-index: 100;
		bottom: -1px;
		padding: {
			bottom: 2px;
			top: 80px;
		}
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 40%);
	}
</style>
