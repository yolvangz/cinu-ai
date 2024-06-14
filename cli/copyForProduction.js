import * as fs from "node:fs";
import { join } from "node:path";

function copyFiles() {
	const sourceDir = "./faiss_index";
	const destDir = "./.svelte-kit/output/server/faiss_index"; // Adjust destination as needed

	// Create the destination directory if it doesn't exist
	fs.mkdirSync(destDir, { recursive: true });
	fs.readdirSync(sourceDir).forEach((file) => {
		const sourcePath = join(sourceDir, file);
		const destPath = join(destDir, file);
		fs.copyFileSync(sourcePath, destPath);
	});

	// Copy other files
	["bot_examples.txt", "bot_instructions.txt", "bot_persona.txt"].forEach((file) => {
		const sourcePath = join("./", file);
		const destPath = join("./.svelte-kit/output/server", file);
		fs.copyFileSync(sourcePath, destPath);
	});
}

copyFiles();
