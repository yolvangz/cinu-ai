class Embeddings {
	/**
	 * Constructor for the Embeddings entity.
	 *
	 * @param {string} vectorStoreAddress - Description of vectorStoreAddress parameter
	 * @param {string} documentsAddress - Description of documentsAddress parameter
	 */
	constructor(vectorStoreAddress, documentsAddress) {
		this.vectorAddress = vectorStoreAddress;
		this.documents = [];
		this.documentsAddress = documentsAddress;
		this.vectorStore = this.constructor.vectorStoreExists()
			? this.loadVectorStore()
			: this.createVectorStore();
	}
}
module.exports = Embeddings;
