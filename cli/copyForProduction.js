import { mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

export default function copyForProduction() {
	const buildsDir = ["./build/server", "./.svelte-kit/output/server"];
	const botFiles = [
		"bot_examples.txt",
		"bot_instructions.txt",
		"bot_persona.txt",
	];
	const sourceDir = "./faiss_index";
	for (const build of buildsDir) {
		const destDir = join(build, "faiss_index"); // Adjust destination as needed

		// Create the destination directory if it doesn't exist
		mkdirSync(destDir, { recursive: true });
		readdirSync(sourceDir).forEach((file) => {
			const sourcePath = join(sourceDir, file);
			const destPath = join(destDir, file);
			copyFileSync(sourcePath, destPath);
		});
		console.log(`Copied faiss_index files to ${build}`);

		// Copy other files
		for (const file of botFiles) {
			const sourcePath = join("./", file);
			const destPath = join(build, file);
			copyFileSync(sourcePath, destPath);
		}
		console.log(`Copied bot files to ${build}`);
	}
}
