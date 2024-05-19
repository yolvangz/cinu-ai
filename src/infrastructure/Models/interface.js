class InterfaceAIModel {
	constructor(settings) {
		this.settings = settings;
		this.options = settings.options;
		delete this.settings.options;
		this.#setup();
	}
	#setup() {
		this.credentials = this.settings.credentials;
		this.#setupOptions();
	}
	#setupOptions() {
		// Models
		if (this.options.text) this.text = this.getTextModel();
		if (this.options.embedding) this.embedding = this.getEmbeddingModel();
		if (this.options.vision) this.vision = this.getVisionModel();
	}
	getTextModel(model) {
		return {};
	}
	getEmbeddingModel(model) {
		return {};
	}
	getVisionModel(model) {
		return {};
	}
}
module.exports = InterfaceAIModel;
