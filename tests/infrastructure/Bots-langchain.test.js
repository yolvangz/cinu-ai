import { resolve } from "../../lib/dir.js";
import { Gemini as Model } from "../../infrastructure/models.js";
import { Faiss as Embedding } from "../../infrastructure/embeddings.js";
import { DocumentsLoader as Loader } from "../../infrastructure/loaders.js";
import { Message } from "../../infrastructure/messages.js";
import { LangchainChat } from "../../infrastructure/chats.js";
import { LangchainBot as AIBot } from "../../infrastructure/bots.js";
import { implementsInterface, Bot } from "../../infrastructure/interfaces.js";
import * as dotenv from "dotenv";
dotenv.config();

describe("Langchain Chatbot with Gemini, Faiss and langchain", () => {
	const model = new Model({
		credentials: process.env.GEMINI_API_KEY,
		options: {
			text: {
				temperature: 0.3,
				model: "gemini-1.0-pro",
			},
			embedding: {
				model: "text-embedding-004",
			},
		},
	});
	const loader = new Loader({
		chunkSize: Number(process.env.CHUNK_SIZE),
		chunkOverlap: Number(process.env.CHUNK_OVERLAP),
	});
	const embedding = new Embedding({
		model: model.getEmbeddingModel(),
		loader: loader,
		vectorStoreAddress: resolve([
			"tests",
			"infrastructure",
			"bot",
			"vectorstore",
		]),
		documentsAddress: resolve(["tests", "infrastructure", "bot", "documents"]),
	});
	let chatbot, chat;

	beforeAll(async () => {
		await embedding.setup();
		chat = await LangchainChat.create(null, Message);
		chatbot = new AIBot({
			persona: "Eres un asistente útil ",
			instructions:
				"Debes contestar las preguntas recibidas sólo basado en el contenido dado. Si no tienes contexto, entonces tienes que responder que no se puede contestar la pregunta.",
			chatModel: model.getTextModel(),
			visionModel: model.getVisionModel(),
			retriever: embedding,
		});
		await chatbot.setup(chat.translator);
	}, 30000);

	test("Class should have implemented interface correctly", () => {
		expect(implementsInterface(chatbot, Bot)).toBe(true);
	});
	test("Testing with sample question", async () => {
		const question = new Message("user", "Qué es el lenguaje?");
		let answer = await chatbot.answer(question);
		console.log(question.content, answer.content);
		expect(answer.from).toBe("bot");
		expect(answer.content).toBeDefined();
	}, 20000);
	test("Testing with follow-up question", async () => {
		chatbot.reset();
		chatbot.addMessages(
			new Message("user", "¿Qué es el lenguaje?"),
			new Message(
				"bot",
				"El lenguaje es el conjunto de sonidos articulados con que el hombre manifiesta lo que piensa o siente"
			)
		);
		const question = new Message("user", "Qué lo caracteriza?");
		let answer = await chatbot.answer(question);
		console.log(question.content, answer.content);
		expect(answer.from).toBe("bot");
		expect(answer.content).toBeDefined();
	}, 20000);
});
