<script>
	import { pageMeta } from "../stores";
	import ChatInput from "../components/ChatInput.svelte";
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcome_fallback from "$lib/images/svelte-welcome.png";

	pageMeta.set({
		description: "CINU.ai",
	});
</script>

<div
	class="container d-flex flex-column justify-content-between h-100 pt-3 pb-5"
>
	<div class="flex-grow-1">Historial</div>
	<div class="mt-auto pb-3">
		<ChatInput />
	</div>
</div>

<style>
</style>
