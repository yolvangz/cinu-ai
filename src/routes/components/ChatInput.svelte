<script>
	import Send from "svelte-bootstrap-icons/lib/Send.svelte";
	import Button from "./Button.svelte";
	import ResetButton from "./ResetButton.svelte";
	const buttonSize = 28;

	export let disabled = false;
	let form;
	let placeholder =
		"Haga sus preguntas (Presione Shift + Enter para insertar una nueva línea)";

	function handleKeyInput(event) {
		if (event.keyCode === 13 && !event.shiftKey) form.requestSubmit();
	}
</script>

<div class="d-flex px-2">
	<div class="me-3 align-self-top">
		<ResetButton {disabled} size={buttonSize} />
	</div>
	<div class="flex-grow-1">
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
						<Button
							type="submit"
							color="link"
							size="sm"
							classAditional="align-self-end"
							title="Hacer pregunta"
						>
							<Send width={buttonSize} height={buttonSize} />
						</Button>
					</fieldset>
				</form>
			</div>
		</div>
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
