const { resolve } = require("../../lib/dir.js");
const infrastructurePath = resolve(["src", "infrastructure"]);
const Model = require(resolve(["Models/gemini.js"], infrastructurePath));
const Embedding = require(resolve(["Embeddings/faiss.js"], infrastructurePath));
const Loader = require(resolve(
	["Loaders/langchain-documents.js"],
	infrastructurePath
));
const { Message } = require(resolve(["Messages.js"], infrastructurePath));
const AIBot = require(resolve(["Bots/langchain.js"], infrastructurePath));
const { implementsInterface, Bot } = require(resolve(
	["interfaces.js"],
	infrastructurePath
));
const dotenv = require("dotenv");
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
		vectorStoreAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
		documentsAddress: resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]),
	});
	let chatbot;

	beforeEach(async () => {
		await embedding.setup();
		chatbot = new AIBot({
			persona: "Eres un asistente útil ",
			instructions:
				"Debes contestar las preguntas recibidas sólo basado en el contenido dado. Si no tienes contexto, entonces tienes que responder que no se puede contestar la pregunta.",
			chatModel: model.getTextModel(),
			visionModel: model.getVisionModel(),
			retriever: embedding,
			history: [
				new Message("user", "¿Qué es el lenguaje?"),
				new Message("bot", "El lenguaje es el conjunto de sonidos articulados con que el hombre manifiesta lo que piensa o siente"),
			],
		});
		await chatbot.setup();
	}, 30000);

	test("Class should have implemented interface correctly", () => {
		expect(implementsInterface(chatbot, Bot)).toBe(true);
	});
	test("Testing with sample question", async () => {
		let ok = true;
		const question = new Message("user", "Qué lo caracteriza?");
		let response;
		response = await chatbot.answer(question);
		console.log(question.content, response);
		expect(response).not.toBeNull();
	}, 20000);
});
