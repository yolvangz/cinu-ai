const embedding = require("../application/embeddings.js");

const question = "Qué es el álgebra?";

(async () => {
	await embedding.setup();
	const response = await embedding.search(question);
	console.log(response);
})();