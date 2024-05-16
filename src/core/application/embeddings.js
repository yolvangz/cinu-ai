const dotenv = require("dotenv");
const fs = require("node:fs");
const { resolve } = require("../../../lib/dir.js");
const Entity = require("../domain/embeddings");
dotenv.config();

class Embeddings extends Entity {
	constructor() {
		const vectorAddress = resolve([process.env.VECTOR_STORE_ADDRESS]);
		const documentsAddress = resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]);
		super(vectorAddress, documentsAddress);
	}
	/**
	 * Checks if the vector store exists from the application.
	 *
	 * @return {boolean} Indicates whether the vector store exists.
	 */
	static vectorStoreExists() {
		return fs.existsSync(this.vectorAddress);
	}
}

module.exports = { Embeddings };
