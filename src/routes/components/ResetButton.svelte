<script>
	import { history } from "../stores";
	import Button from "./Button.svelte";
	import PlusLg from "svelte-bootstrap-icons/lib/PlusLg.svelte";
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
	<PlusLg width={size} height={size} />
	<span class="visually-hidden">Nueva conversación</span>
</Button>
