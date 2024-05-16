const dotenv = require("dotenv");
const fs = require("node:fs");
const { resolve } = require("../../../lib/dir.js");
const Entity = require("../domain/embeddings");
dotenv.config();

class Embeddings extends Entity {
	static vectorStoreExists() {
		console.log("Checking if vector store exists from application");
		return fs.existsSync(this.vectorAddress);
	}
	constructor() {
		const vectorAddress = resolve([process.env.VECTOR_STORE_ADDRESS]);
		const documentsAddress = resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]);
		super(vectorAddress, documentsAddress);
	}
}

module.exports = { Embeddings };
