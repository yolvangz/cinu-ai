const { resolve } = require("../../lib/dir.js");
const infrastructurePath = resolve(["src", "infrastructure"]);
const { Gemini } = require(resolve(["models.js"], infrastructurePath));
const { DocumentsLoader, DBConect } = require(resolve(
	["loaders.js"],
	infrastructurePath
));
const { Faiss } = require(resolve(["embeddings.js"], infrastructurePath));
const { LangchainBot } = require(resolve(["bots.js"], infrastructurePath));
const { LangchainChat } = require(resolve(["chats.js"], infrastructurePath));
const { Message } = require(resolve(["messages.js"], infrastructurePath));
const { User } = require(resolve(["users.js"],infrastructurePath))
const dotenv = require("dotenv");
dotenv.config();

const settings = {
	credentials: process.env.GEMINI_API_KEY,
	textModel: process.env.GEMINI_CHAT_MODEL ?? "gemini-1.0-pro",
	textTemperature: Number(process.env.GEMINI_CHAT_TEMPERATURE) ?? 1,
	embeddingModel: process.env.GEMINI_EMBEDDING_MODEL ?? "embedding-001",
	chunkSize: Number(process.env.CHUNK_SIZE),
	chunkOverlap: Number(process.env.CHUNK_OVERLAP),
	vectorStoreAddress: resolve([process.env.VECTOR_STORE_ADDRESS]),
	documentsAddress: resolve([process.env.EMBEDDINGS_INPUT_ADDRESS]),
	chatbotPersonaAddress: resolve(["bot_persona.txt"]) ?? "",
	chatbotInstructionsAddress: resolve(["bot_instructions.txt"]) ?? "",
	chatbotExamplesAddress: resolve(["bot_examples.txt"]) ?? "",
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  table_users: process.env.TABLE_USERS,
};

module.exports = {
	Model: Gemini,
	Loader: DocumentsLoader,
	Embedding: Faiss,
	Bot: LangchainBot,
	Chat: LangchainChat,
  Conection:DBConect,
  users:User,
	Message,
	settings,
};
