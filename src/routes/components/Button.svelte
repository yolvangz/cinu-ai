<script>
	export let type = "button";
	export let color = "primary";
	export let size = "";
	export let href = "#";
	export let target = "self";
	export let title = "";
	export let classAditional = "";
	export let disabled = false;

	$: buttonSize = size ? `btn-${size}` : "";
</script>

{#if type === "link"}
	<a
		on:click|stopPropagation
		{href}
		{target}
		{title}
		class="btn btn-{color} {buttonSize} {classAditional} {disabled
			? 'disabled'
			: ''}"
	>
		<slot></slot>
	</a>
{:else}
	<button
		on:click|stopPropagation
		{type}
		{title}
		{disabled}
		class="btn btn-{color} {buttonSize} {classAditional}"
	>
		<slot></slot>
	</button>
{/if}
