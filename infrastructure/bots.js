import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";

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
	#translator;
	#autoMemory;
	constructor(settings) {
		this.settings = settings;
	}
	async setup(translator) {
		this.#persona = this.settings.persona;
		this.#instructions = this.settings.instructions;
		this.#examples = this.settings.examples ?? [];
		this.#chatModel = this.settings.chatModel;
		this.#visionModel = this.settings.visionModel;
		this.#retriever = this.settings.retriever;
		this.#translator = translator;
		this.#history = translator.messageToNative(this.settings.history ?? []);
		this.#roles = translator.roles;
		this.#messageInterface = translator.interface;
		this.#autoMemory = this.settings.autoMemory ?? false;
	}
	#getInstructions() {
		const examples =
			this.#examples.length > 0
				? `Examples:\n${this.#examples.join("\n\n")}`
				: "";
		return ChatPromptTemplate.fromMessages([
			[
				"system",
				`${this.#persona}\n
				${this.#instructions}\n${examples}\n<context>{context}</context>`,
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
				"Basada en la conversación de arriba, genera una consulta consulta para buscar información relevante a la converación",
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
		const nativeQuestion = this.#translator.messageToNative(question);
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
		const answer = new this.#messageInterface("bot", response.answer);
		if (this.#autoMemory) this.addMessages(question, answer);
		return answer;
	}
	get history() {
		return this.#translator.nativeToMessage(this.#history);
	}
	addMessages(...list) {
		const toPush = this.#translator.messageToNative(list);
		for (let msg of toPush) {
			this.#history.push(msg);
		}
	}
	reset() {
		this.#history = [];
	}
}
export { LangchainBot };
