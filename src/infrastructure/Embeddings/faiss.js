const fs = require("node:fs");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");

class Faiss {
	#engine;
	#model;
	#loader;
	#vectorStoreAddress;
	#documentsAddress;
	#storage;
	constructor(settings) {
		this.settings = settings;
	}
	async setup() {
		this.#engine = FaissStore;
		this.#model = this.settings.model;
		this.#loader = this.settings.loader;
		this.#vectorStoreAddress = this.settings.vectorStoreAddress;
		this.#documentsAddress = this.settings.documentsAddress;
		if (!(await this.checkStorage())) {
			console.log("Let's create a storage!!!");
			await this.#createStorage();
		}
		console.log("Let's load storage!!!");
		this.#storage = await this.#loadStorage();
	}
	async checkStorage() {
		const results = [
			await this.#loader.checkLocation(this.#vectorStoreAddress),
			await this.#loader.checkLocation(`${this.#vectorStoreAddress}/faiss.index`),
			await this.#loader.checkLocation(`${this.#vectorStoreAddress}/docstore.json`),
		];
		return results.every((res) => res);
	}
	async #generateEmbeddings() {
		const documents = await this.#loader.readFolder(
			this.#documentsAddress,
			true
		);
		const chunked = await this.#loader.chunk(documents, true);
		return await this.#engine.fromDocuments(chunked, this.#model);
	}
	async #createStorage() {
		const embeddings = await this.#generateEmbeddings();
		console.log("Saving storage at: ", this.#vectorStoreAddress);
		await embeddings.save(this.#vectorStoreAddress);
	}
	async #loadStorage() {
		return await this.#engine.load(this.#vectorStoreAddress, this.#model);
	}
	#validateQuery(query) {
		try {
			if (typeof query !== "string") throw new error("query is not a string");
		} catch (err) {
			console.error(err.message);
			return false;
		}
		return true;
	}
	async search(query) {
		if (!this.#validateQuery(query)) return null;
		return await this.#storage.similaritySearch(query);
	}
}

module.exports = Faiss;
