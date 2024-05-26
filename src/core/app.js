const dotenv = require("dotenv");
const { resolve } = require("../../lib/dir.js");
const infrastructurePath = resolve(["src", "infrastructure"]);
const { Gemini } = require(resolve(["models.js"], infrastructurePath));
const { DocumentsLoader } = require(resolve(
	["loaders.js"],
	infrastructurePath
));
const { Faiss } = require(resolve(["embeddings.js"], infrastructurePath));
const { LangchainBot } = require(resolve(["bots.js"], infrastructurePath));
const { Message } = require(resolve(["messages.js"], infrastructurePath));
dotenv.config();

async function loader() {
	let embeddingInCase;
	let botInCase;
	const gemini = new Gemini({
		credentials: process.env.GEMINI_API_KEY,
		options: {
			text: {
				model: process.env.GEMINI_CHAT_MODEL ?? "gemini-1.0-pro",
				temperature: Number(process.env.GEMINI_CHAT_TEMPERATURE) ?? 1,
			},
			embedding: {
				model: process.env.GEMINI_EMBEDDING_MODEL ?? "embedding-001",
			},
		},
	});
	const loader = new DocumentsLoader({
		chunkSize: Number(process.env.CHUNK_SIZE),
		chunkOverlap: Number(process.env.CHUNK_OVERLAP),
	});
	embeddingInCase = new Faiss({
		vectorStoreAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
		documentsAddress: resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]),
		model: gemini.getEmbeddingModel(),
		loader,
	});
	const [persona, instructions, examples] = await Promise.all([
		loader.readFile(resolve(["bot_persona.txt"])) ?? "",
		loader.readFile(resolve(["bot_instructions.txt"])) ?? "",
		loader.readFile(resolve(["bot_examples.txt"])) ?? "",
	]);
	await embeddingInCase.setup(),
		(botInCase = new LangchainBot({
			persona,
			instructions,
			chatModel: gemini.getTextModel(),
			visionModel: gemini.getVisionModel(),
			retriever: embeddingInCase,
			messageInterface: Message,
		}));
	await botInCase.setup();
	return { embedding: embeddingInCase, bot: botInCase, Message };
}

module.exports = loader;
