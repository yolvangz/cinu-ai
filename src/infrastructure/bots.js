const {
	ChatPromptTemplate,
	MessagesPlaceholder,
} = require("@langchain/core/prompts");
const {
	createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const {
	createHistoryAwareRetriever,
} = require("langchain/chains/history_aware_retriever");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

class LangchainBot {
	#persona;
	#instructions;
	#examples;
	#chatModel;
	#visionModel;
	#retriever;
	#history;
	#messageInterface;
	#roles;
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
		this.#roles = this.settings.roles ?? [
			{ native: AIMessage, role: "bot" },
			{ native: HumanMessage, role: "user" },
		];
		this.#messageInterface = this.settings.messageInterface;
	}
	get history() {
		return this.#history.map(this.#translateNativeToMessage.bind(this));
	}
	set history(messagesList) {
		this.#history = messagesList.map(this.#translateMessageToNative.bind(this));
	}
	#translateMessageToNative(message) {
		let nativeMessage = this.#roles.find((role) => message.from === role.role);
		if (nativeMessage === undefined)
			throw new Error(`Unsupported abstract message type: ${message.from}`);
		return this.#messageInterface.convert(message, nativeMessage.native);
	}
	#translateNativeToMessage(nativeMessage) {
		let messageFormat = this.#roles.find(
			(role) => nativeMessage instanceof role.native
		);
		if (messageFormat === undefined)
			throw new Error("Unsupported native message type");
		return this.#messageInterface.convert(
			nativeMessage,
			null,
			messageFormat.role
		);
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
		const response = await historyAwareRetrieverChain.invoke({
			chat_history: this.#history,
			input: question.content,
		});
		return new this.#messageInterface("bot", response.answer);
	}
}
module.exports = { LangchainBot };
