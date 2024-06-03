import { resolve } from "../lib/dir.js";
import { Gemini } from "../infrastructure/models.js";
import { DocumentsLoader } from "../infrastructure/loaders.js";
import { Faiss } from "../infrastructure/embeddings.js";
import { LangchainBot } from "../infrastructure/bots.js";
import { LangchainChat } from "../infrastructure/chats.js";
import { Message } from "../infrastructure/messages.js";
import dotenv from "dotenv";
dotenv.config();

const Model = Gemini;
const Loader = DocumentsLoader;
const Embedding = Faiss;
const Bot = LangchainBot;
const Chat = LangchainChat;

const settings = {
	credentials: process.env.GEMINI_API_KEY,
	textModel: process.env.GEMINI_CHAT_MODEL,
	textTemperature: Number(process.env.GEMINI_CHAT_TEMPERATURE),
	embeddingModel: process.env.GEMINI_EMBEDDING_MODEL,
	chunkSize: Number(process.env.CHUNK_SIZE),
	chunkOverlap: Number(process.env.CHUNK_OVERLAP),
	vectorStoreAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
	documentsAddress: resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]),
	chatbotPersonaAddress: resolve(["bot_persona.txt"]) ?? "",
	chatbotInstructionsAddress: resolve(["bot_instructions.txt"]) ?? "",
	chatbotExamplesAddress: resolve(["bot_examples.txt"]) ?? "",
};

export {
	Model,
	Loader,
	Embedding,
	Bot,
	Chat,
	Message,
	settings,
};