const dotenv = require("dotenv");
const { resolve } = require("../../../lib/dir.js");
const infrastructurePath = resolve(["src", "infrastructure"]);
const Model = require(resolve(["Models/gemini.js"], infrastructurePath));
const Loader = require(resolve(
	["Loaders/langchain-documents.js"],
	infrastructurePath
));
const Embedding = require(resolve(["Embeddings/faiss.js"], infrastructurePath));
dotenv.config();

let embeddingInCase;
(() => {
	embeddingInCase = new Embedding({
		vectorStoreAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
		documentsAddress: resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]),
		model: new Model({
			credentials: process.env.GEMINI_API_KEY,
			options: {
				embedding: {
					model: "embedding-001",
				},
			},
		}).getEmbeddingModel(),
		loader: new Loader({
			chunkSize: Number(process.env.CHUNK_SIZE),
			chunkOverlap: Number(process.env.CHUNK_OVERLAP),
		}),
	});
})();

module.exports = embeddingInCase;
