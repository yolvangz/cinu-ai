const { resolve } = require("../../lib/dir.js");
const infrastructurePath = resolve(["src", "infrastructure"]);
const Model = require(resolve(["Models/gemini.js"], infrastructurePath));
const Embedding = require(resolve(["Embeddings/faiss.js"], infrastructurePath));
const Loader = require(resolve(
	["Loaders/langchain-documents.js"],
	infrastructurePath
));
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
				model: "embedding-001",
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
			persona: "You are a helpful assistant ",
			instructions:
				"You must answer the questions received only based on the context given. If you don't have context then must say that you can't answer the question.",
			chatModel: model.getTextModel(),
			visionModel: model.getVisionModel(),
			retriever: embedding,
		});
		await chatbot.setup();
	});

	test("Class should have implemented interface correctly", () => {
		expect(implementsInterface(chatbot, Bot)).toBe(true);
	});
	test("Testing with sample question", async () => {
		const question = "Qué es el lenguaje?";
		const response = await chatbot.answer(question);
		console.log(question, response);
		expect(response).not.toBeNull();
	}, 10000);
});
