import { build } from "esbuild";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			write: false,
		},
	},
	plugins: [
		sveltekit(),
		{
			name: "bot-config",
			apply: "build",
			async buildStart() {
				await import("./cli/createEmbeddings.js").then((m) => m.default());
			},
			async closeBundle() {
				await build({ write: false });
				await import("./cli/copyForProduction.js").then((m) => m.default());
			},
		},
	],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;',
			},
		},
	},
});
