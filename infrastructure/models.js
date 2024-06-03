const {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");

class Gemini {
	constructor(settings) {
		this.settings = settings;
		this.options = settings.options ?? {};
		delete this.settings.options;
		this.credentials = this.settings.credentials;
	}
	getTextModel() {
		if (!this.options.text) return null;
		return new ChatGoogleGenerativeAI({
			apiKey: this.credentials,
			temperature: this.options.text.temperature ?? 1,
			modelName: this.options.text.model,
		});
	}
	getEmbeddingModel() {
		if (!this.options.embedding) return null;
		return new GoogleGenerativeAIEmbeddings({
			apiKey: this.credentials,
			modelName: this.options.embedding.model,
		});
	}
	getVisionModel() {
		if (!this.options.vision) return null;
		return new ChatGoogleGenerativeAI({
			apiKey: this.credentials,
			modelName: this.options.vision.model,
		});
	}
}

module.exports = { Gemini };
