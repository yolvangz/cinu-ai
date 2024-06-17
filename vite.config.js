import { build } from "esbuild";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

let once = false;

export default defineConfig({
	build: {
		rollupOptions: {
			write: false,
		},
	},
	plugins: [
		sveltekit(),
		{
			name: "create-embeddings",
			apply: "build",
			async buildStart() {
				await build({ write: false });
				await import("./cli/createEmbeddings.js").then((m) => m.default());
			},
		},
		{
			name: "copy-files",
			apply: "build",
			async buildEnd() {
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
