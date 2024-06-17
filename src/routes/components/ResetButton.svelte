<script>
	import { history } from "../stores";
	import Button from "./Button.svelte";
	import EraserFill from "svelte-bootstrap-icons/lib/EraserFill.svelte";
	export let disabled;
	export let size = 36;
</script>

<Button
	type="button"
	color="primary"
	size="lg"
	title="Nueva conversación"
	classAditional="reset-button d-flex align-items-center justify-content-center shadow"
	{disabled}
	on:click={() => history.reset()}
>
	<EraserFill width={size} height={size} />
	<span class="visually-hidden">Nueva conversación</span>
</Button>
