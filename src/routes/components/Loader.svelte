<script>
	export let position = "";

	const directions = {
		top: "top-0",
		bottom: "bottom-0",
		start: "start-0",
		end: "end-0",
	};
	let classList = [],
		classString = "";
	$: dirs = position.split(" ");
	$: if (dirs.length > 0) {
		for (const key in directions) {
			if (dirs.includes(key)) classList = [...classList, directions[key]];
		}
		classString = classList.join(" ");
	}
</script>

{#if !position}
	<div class="d-flex flex-column justify-content-center align-items-center">
		<div class="spinner-border mx-auto" aria-hidden="true"></div>
		<strong role="status" class="mt-3 text-center"
			><slot>Loading...</slot></strong
		>
	</div>
{:else}
	<div
		class="d-flex flex-column justify-content-center align-items-center p-absolute {classString}"
	>
		<div class="spinner-border mx-auto" aria-hidden="true"></div>
		<strong role="status" class="mt-3 text-center"
			><slot>Loading...</slot></strong
		>
	</div>
{/if}

<style>
	strong[role="status"] {
		font-family: var(--title-font-family);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
