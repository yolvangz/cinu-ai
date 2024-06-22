import { build } from "esbuild";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			write: false,
		}
	},
	plugins: [
		sveltekit(),
		{
			name: "copy-files",
			buildStart() {
				build({ write: false });
				require("./cli/copyForProduction.js");
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
