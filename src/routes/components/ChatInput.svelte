<script>
	import Send from "svelte-bootstrap-icons/lib/Send.svelte";
	const buttonSize = 24;

	export let disabled = false;
	let form;
	let placeholder =
		"Haga sus preguntas (Presione Shift + Enter para insertar una nueva línea)";

	function handleKeyInput(event) {
		if (event.keyCode === 13 && !event.shiftKey) form.requestSubmit();
	}
</script>

<div class="card text-bg-light w-100 shadow {disabled ? 'disabled' : ''}">
	<div class="card-body p-3">
		<form on:submit|preventDefault bind:this={form}>
			<fieldset {disabled} class="d-flex">
				<textarea
					class="form-control form-control-plaintext chat-input h-100 py-0 scroll-container"
					name="chatInput"
					{placeholder}
					on:keydown={handleKeyInput}
				></textarea>
				<button
					type="submit"
					class="btn btn-link btn-sm align-self-end"
					title="Hacer pregunta"
				>
					<Send width={buttonSize} height={buttonSize} />
				</button>
			</fieldset>
		</form>
	</div>
</div>

<style lang="scss">
	.card {
		transition: opacity 0.6s;
		&.disabled {
			opacity: 0.6;
		}
	}
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
		&:disabled {
			background-color: transparent;
		}
	}
</style>
