const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
	createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
// const { createRetrievalChain } = require("langchain/chains/retrieval");

class Bot {
	#persona;
	#instructions;
	#examples;
	#chatModel;
	#visionModel;
	#retriever;
	constructor(settings) {
		this.settings = settings;
	}
	async setup() {
		this.#persona = this.settings.persona;
		this.#instructions = this.settings.instructions;
		this.#examples = this.settings.examples ?? [];
		this.#chatModel = this.settings.chatModel;
		this.#visionModel = this.settings.visionModel;
		this.#retriever = this.settings.retriever;
	}
	#getInstructions() {
		return ChatPromptTemplate.fromTemplate(`
${this.#persona}
${this.#instructions}
<context>
{context}
</context>

Question: {input}`);
	}
	async #getContextAbout(query) {
		return await this.#retriever.search(query);
	}
	async answer(question) {
		// const langchainQuestion = question.constructor.convert(question, HumanMessage);
		// const fullQuestion = Object.create(question);
		// fullQuestion.context = await this.#getContextAbout(question.content);
		const context = await this.#getContextAbout(question.content);
		const prompt = this.#getInstructions();
		const documentChain = await createStuffDocumentsChain({
			llm: this.#chatModel,
			prompt,
		});
		return await documentChain.invoke({ input: question.content, context });
	}
}
module.exports = Bot;
