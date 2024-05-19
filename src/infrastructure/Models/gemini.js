const {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");
const Interface = require("./interface.js");

class Gemini extends Interface {
	getTextModel() {
		return new ChatGoogleGenerativeAI({
			apiKey: this.credentials,
			temperature: this.options.text.temperature ?? 1,
			modelName: this.options.text.model,
		});
	}
	getEmbeddingModel() {
		return new GoogleGenerativeAIEmbeddings({
			apiKey: this.credentials,
			modelName: this.options.embedding.model,
		});
	}
	getVisionModel() {
		return new ChatGoogleGenerativeAI({
			apiKey: this.credentials,
			modelName: this.options.vision.model,
		});
	}
}

module.exports = Gemini;
