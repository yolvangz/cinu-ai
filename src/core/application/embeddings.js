const dotenv = require("dotenv");
const { resolve } = require("../../../lib/dir.js");
const Model = require("../../infrastructure/Models/gemini.js");
const Embedding = require("../../infrastructure/Embeddings/faiss.js");
const Entity = require("../domain/embeddings");
dotenv.config();

class Embeddings {
	constructor() {
		const embeddingModel = new Model({
			credentials: process.env.GEMINI_API_KEY,
			options: {
				embedding: {
					model: "embedding-001",
				},
			},
		});
		this.embedding = new Embedding({
			vectorAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
			model: embeddingModel,
		});
	}
	async search(query) {
		return await(this.embedding.search(query));
	}
}

module.exports = { Embeddings };
