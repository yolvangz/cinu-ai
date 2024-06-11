<script>
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import "../app.scss";
	import Header from "./Header.svelte";

	onMount(async () => {
		if (!browser) return;

		// this is enough for most components
		await import("bootstrap");

		// some components require a bootstrap instance, to fulfil their job. In that case, use this:
		// const bootstrap = await import("bootstrap");
		// sample usage:
		// const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
	});
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot></slot>
	</main>

	<footer>
		<p>
			visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
		</p>
	</footer>
</div>
