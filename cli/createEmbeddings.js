const app = require("../core/app.js");

const main = async () => {
	const loader = app.getFileLoader();
	const model = app.getModels().getEmbeddingModel();
	const embedding = await app.getEmbedding(loader, model);
	console.log(embedding);
};

main().then(() => {
	console.log("Embedding database created.");
	process.exit();
});
