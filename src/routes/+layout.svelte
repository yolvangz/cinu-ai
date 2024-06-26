<script>
	import { pageMeta } from "./stores";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import "../app.scss";
	import Header from "./components/Header.svelte";

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

<svelte:head>
	{#if $pageMeta.title}
		<title>{$pageMeta.title} | CINU.ai</title>
	{:else}
		<title>CINU.ai</title>
	{/if}
	{#if $pageMeta.description}
		<meta name="description" content={$pageMeta.description} />
	{/if}
</svelte:head>

<div class="app" aria-roledescription="app">
	<Header></Header>
	<main>
		<slot></slot>
	</main>

	<footer class="fixed-bottom">
		<div class="container">
			<p class="text-center">
				Hecho por <a target="blank" href="https://github.com/yolvangz"
					>@yolvangz</a
				>
				y
				<a target="blank" href="https://github.com/Luis-Marval">@Luis-Marval</a
				>. UNEFA 2024.
			</p>
		</div>
	</footer>
</div>

<style>
	.app,
	main {
		height: calc(100vh - 11vh);
	}
</style>
