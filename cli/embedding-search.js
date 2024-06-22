import * as app from "../core/app.js";
import { createInterface } from "node:readline";

const readline = createInterface({
	input: process.stdin,
	output: process.stdout,
});

function promptValue(message) {
	return new Promise((resolve) => {
		readline.question(message, (answer) => {
			if (!answer) {
				console.error("El valor no puede estar vacío.");
				promptValue(message).then(resolve);
			} else {
				resolve(answer);
			}
		});
	});
}
async function prompt(embedding) {
	let exit;
	let question = new app.Message("user", await promptValue("> "));
	const result = await embedding.search(question.content);
	console.log(result);
	return await prompt(embedding);
}

async function main() {
	const models = app.getModels();
	const loader = app.getFileLoader();
	const embedding = await app.getEmbedding(loader, models.getEmbeddingModel());
	console.log(
		"Ingresa una pregunta para ver el resultado devuelto por el buscador de DB vectorial:"
	);
	return await prompt(embedding);
}

main().then(() => readline.close());
