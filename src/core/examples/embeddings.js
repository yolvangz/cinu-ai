const app = require("../app.js");


const question = "Qué es el álgebra?";

(async () => {
	const loader = app.getFileLoader();
	const model = app.getModels().getEmbeddingModel();
	const embedding = await app.getEmbedding(loader, model);
	const response = await embedding.search(question);
	console.log(response);
})();