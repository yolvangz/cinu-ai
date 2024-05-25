const {
	ChatPromptTemplate,
	MessagesPlaceholder,
} = require("@langchain/core/prompts");
const {
	createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const {
	createHistoryAwareRetriever,
} = require("langchain/chains/history_aware_retriever");
const { CombinedMemory } = require("langchain/memory");

class Bot {
	#persona;
	#instructions;
	#examples;
	#chatModel;
	#visionModel;
	#retriever;
	#history;
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
		this.#history = this.settings.history
			? this.settings.history.map(this.#translateMessageToNative)
			: [];
	}
	#translateMessageToNative(message) {
		let nativeMessage;
		switch (message.from) {
			case "user":
				nativeMessage = HumanMessage;
				break;
			case "bot":
				nativeMessage = AIMessage;
				break;
			default:
				throw new Error(`Unsupported message type: ${message.from}`);
		}
		return message.constructor.convert(message, nativeMessage);
	}
	#getInstructions() {
		return ChatPromptTemplate.fromMessages([
			[
				"system",
				`${this.#persona}\n${this.#instructions}\n<context>{context}</context>`,
			],
			new MessagesPlaceholder("chat_history"),
			["user", "{input}"],
		]);
	}
	async #getRetriever() {
		const historyAwarePrompt = ChatPromptTemplate.fromMessages([
			new MessagesPlaceholder("chat_history"),
			["user", "{input}"],
			[
				"user",
				"Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
			],
		]);
		const retriever = this.#retriever.storage.asRetriever();
		return await createHistoryAwareRetriever({
			llm: this.#chatModel,
			retriever,
			rephrasePrompt: historyAwarePrompt,
		});
	}
	async answer(question) {
		const nativeQuestion = this.#translateMessageToNative(question);
		const retriever = await this.#getRetriever();
		const prompt = this.#getInstructions();
		const historyAwareCombineDocsChain = await createStuffDocumentsChain({
			llm: this.#chatModel,
			prompt,
		});
		const historyAwareRetrieverChain = await createRetrievalChain({
			retriever,
			combineDocsChain: historyAwareCombineDocsChain,
		});
		return (
			await historyAwareRetrieverChain.invoke({
				chat_history: this.#history,
				input: question.content,
			})
		).answer;
	}
}
module.exports = Bot;
