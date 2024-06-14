<script>
	import { marked } from "marked";
	import DOMPurify from "isomorphic-dompurify";

	export let from, content;
	const direction = from === "user" ? "right" : "left";
	const colors = ["red", "blue", "yellow", "green"];
	function randomColor() {
		return colors[Math.floor(Math.random() * colors.length)];
	}
	$: textContent = DOMPurify.sanitize(marked.parse(content));
</script>

{#if from === "bot"}
	<div class="message {direction} mb-4">
		<article class="message-body gradient-box {randomColor()} p-3">
			{@html textContent}
		</article>
	</div>
{:else}
	<div class="message {direction} mb-4">
		<article class="message-body border p-3">
			{@html textContent}
		</article>
	</div>
{/if}

<style lang="scss">
	.message {
		display: flex;
		.message-body {
			background-color: var(--bs-body-bg);
			box-shadow: var(--bs-box-shadow-sm);
			border-radius: var(--bs-border-radius-xl);
			min-height: 20px;
			position: relative;
			@media screen and (min-width: 992px) {
				max-width: 70%;
			}
		}
	}

	.message.right {
		/* Styles for messages originating from the right */
		justify-content: flex-end;
	}

	.message.left {
		/* Styles for messages originating from the left */
		justify-content: flex-start;
	}
</style>
