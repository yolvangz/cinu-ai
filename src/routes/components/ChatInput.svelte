<script>
	import Send from "svelte-bootstrap-icons/lib/Send.svelte";
	const buttonSize = 24;
</script>

<div class="card text-bg-light w-100">
	<div class="card-body p-3">
		<form on:submit|preventDefault class="d-flex">
			<textarea
				class="form-control form-control-plaintext chat-input h-100"
				name="chatInput"
				placeholder="Haga sus preguntas"
			></textarea>
			<button
				type="submit"
				class="btn btn-link btn-sm align-self-end"
				title="Hacer pregunta"
			>
				<Send width={buttonSize} height={buttonSize} />
			</button>
		</form>
	</div>
</div>

<style lang="scss">
	.chat-input {
		background-color: transparent;
		font-size: 1.25rem;
		resize: none;
		&:focus {
			outline: none;
			border-color: transparent;
			box-shadow: none;
			background-color: transparent;
		}
	}
</style>
