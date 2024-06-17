import * as app from "../core/app.js";

export default async function createEmbeddings () {
	const loader = app.getFileLoader();
	const model = app.getModels().getEmbeddingModel();
	const embedding = await app.getEmbedding(loader, model);
	console.log(embedding);
	console.log("Embedding database created.");
};
