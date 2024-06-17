import { mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

export default function copyForProduction() {
	const sourceDir = "./faiss_index";
	const destDir = "./build/server/faiss_index"; // Adjust destination as needed
	const docsDir = "./build/server/faiss_index"; // Adjust destination as needed
	const destDocsDir = "./build/server/documents";

	// Create the destination directory if it doesn't exist
	mkdirSync(destDir, { recursive: true });
	readdirSync(sourceDir).forEach((file) => {
		const sourcePath = join(sourceDir, file);
		const destPath = join(destDir, file);
		copyFileSync(sourcePath, destPath);
	});
	console.log("Copied faiss_index files to build/server");

	mkdirSync(destDocsDir, { recursive: true });
	readdirSync(docsDir).forEach((file) => {
		const sourcePath = join(docsDir, file);
		const destPath = join(destDocsDir, file);
		copyFileSync(sourcePath, destPath);
	});
	console.log("Copied documents files to build/server");

	// Copy other files
	["bot_examples.txt", "bot_instructions.txt", "bot_persona.txt"].forEach(
		(file) => {
			const sourcePath = join("./", file);
			const destPath = join("./build/server", file);
			copyFileSync(sourcePath, destPath);
		}
	);
	console.log("Copied bot files to build/server");
}
