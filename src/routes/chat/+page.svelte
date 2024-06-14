<script>
	import DOMPurify from "isomorphic-dompurify";
	import { history, pageMeta } from "../stores";
	import { beforeUpdate, afterUpdate } from "svelte";
	import ChatInput from "../components/ChatInput.svelte";
	import ChatHistory from "../components/ChatHistory.svelte";
	import Loader from "../components/Loader.svelte";

	pageMeta.set({
		description: "CINU.ai",
	});

	export let data;
	history.set(data.chat.history);
	let value;
	let disabled = false,
		autoscroll = false;
	let chatElement, before, after;

	async function handleChatInput(event) {
		const question = new FormData(event.target).get("chatInput").trim();
		const validatingQuestion = DOMPurify.sanitize(question);
		if (disabled || validatingQuestion.length === 0) return;
		// reset and block input
		event.target.reset();
		disabled = !disabled;
		// update chat history
		const lastHistory = $history;
		history.addMessage("user", question);
		// get answer
		try {
			const response = await fetch("/api/answer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ history: lastHistory, question }),
			});
			const res = await response.json();
			history.addMessage(res.answer.from, res.answer.content);
			disabled = !disabled;
		} catch (error) {
			console.error(error);
			history.removeLastMessage();
			value = question;
			disabled = !disabled;
		}
	}
	function updateScrolling(event) {
		const container = event.target;
		const innerHeight = parseInt(
			window.getComputedStyle(container, null).getPropertyValue("height")
		);
		const scrollTop = container.scrollTop;
		const elementHeight = 25; // Height of the element

		const newTop = scrollTop * 1; // Adjust factor (play with this value for effect)
		// Ensure the element stays within viewport bounds
		const newPosition = Math.max(newTop, 0);
		before.style.top = `${newPosition}px`;
		after.style.bottom = `-${newPosition}px`;
	}

	beforeUpdate(() => {
		if (chatElement) {
			const scrollableDistance =
				chatElement.scrollHeight - chatElement.offsetHeight;
			autoscroll = chatElement.scrollTop > scrollableDistance - 20;
		}
	});

	afterUpdate(() => {
		if (autoscroll) chatElement.scrollTo(0, chatElement.scrollHeight);
		if ($history.length === 0) chatElement.scrollTo(0, 0);
	});
</script>

<div
	class="container d-flex flex-column justify-content-between h-100 pt-3 pb-5"
>
	<section
		id="chatHistory"
		class="background-gradient flex-grow-1 mt-4 mb-3 d-flex flex-column justify-content-between scroll-container"
		on:scroll={updateScrolling}
		bind:this={chatElement}
	>
		<span bind:this={before} class="before"></span>
		{#await history then}
			<div class="history-wrapper py-2">
				<ChatHistory />
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
		<ChatInput on:submit={handleChatInput} {disabled} {value} />
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
