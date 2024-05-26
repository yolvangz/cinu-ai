const loader = require("../app.js");

const question = "Qué es el álgebra?";

(async () => {
	const {embedding} = await loader();
	const response = await embedding.search(question);
	console.log(response);
})();