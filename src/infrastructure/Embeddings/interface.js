class InterfaceEmbeddings {
	/**
	 * Represents an interface for embeddings.
	 *
	 * @class InterfaceEmbeddings
	 * @param {Object} settings - The settings object for the class.
	 * @param {string} [settings.engine] - Engine object that performs as vector store management system.
	 * @param {string} [settings.model] - Embedding Model object to use.
	 */
	constructor(settings) {
		this.settings = settings;
		this.#setup();
		if (!this.storageExists()) this.createStorage();
		this.storage = this.loadStorage();
	}
	#setup() {
		this.engine = this.settings.engine;
		this.model = this.settings.model;
	}
	storageExists() {
		console.error("'storageExists' not defined in this class");
		return false;
	}
	static validateQuery(query) {
		try {
			if (typeof query !== "string") throw new error("query is not a string");
		} catch (err) {
			console.error(err.message);
			return false;
		}
		return true;
	}
	async createStorage() {
		console.error("'createStorage' not defined in this class");
	}
	async loadStorage() {
		console.error("'loadStorage' not defined in this class");
		return {};
	}
	async search(query) {
		console.error("'search' not defined in this class");
		return [];
	}
}
module.exports = InterfaceEmbeddings;
