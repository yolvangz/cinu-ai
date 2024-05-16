class Embeddings {
	constructor(vectorStoreAddress, documentsAddress) {
		this.vectorAddress = vectorStoreAddress;
		this.documents = [];
		this.documentsAddress = documentsAddress;
		this.vectorStore = this.constructor.vectorStoreExists()
			? this.loadVectorStore()
			: this.createVectorStore();
	}
	static vectorStoreExists() {
		console.log("Checking if vector store exists from domain");
		return true;
	}
	createVectorStore() {
		return { action: "create" };
	}
	loadVectorStore() {
		return { action: "load" };
	}
	search(query) {
		console.log(`Make a search about: ${query}`);
	}
}
module.exports = Embeddings;
