<script>
	import { page } from "$app/stores";
	import logo from "$lib/images/cinu-ai-sm.png";
</script>

<header class="">
	<nav class="navbar navbar-expand-lg shadow">
		<div class="container justify-content-center">
			<a class="navbar-brand d-inline-flex align-items-center" href="/">
				<img
					src={logo}
					alt="CINU.ai Logo"
					class="d-inline-block align-text-top me-1"
				/>
				CINU.ai
			</a>
		</div>
	</nav>
</header>

<style lang="scss">
	$logo-font-size: 2.25rem;
	.navbar {
		max-height: 11vh;
		.navbar-brand {
			color: var(--bs-body-color);
			text-transform: uppercase;
			letter-spacing: calc($logo-font-size * 0.05);
			font: {
				family: var(--title-font-family);
				weight: 700;
				size: $logo-font-size;
			}
			img {
				max-width: 60px;
				// max-height: 9vh;
			}
		}
	}
</style>
