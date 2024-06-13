import {
	Model,
	Loader,
	Embedding,
	Bot,
	Chat,
	Message,
	settings,
} from "./loader.js";

export function getModels() {
	return new Model({
		credentials: settings.credentials,
		options: {
			text: {
				model: settings.textModel,
				temperature: settings.textTemperature,
			},
			embedding: {
				model: settings.embeddingTemperature,
			},
		},
	});
}
export function getFileLoader() {
	return new Loader({
		chunkSize: settings.chunkSize,
		chunkOverlap: settings.chunkOverlap,
	});
}
export async function getEmbedding(loader, model) {
	const embedding = new Embedding({
		vectorStoreAddress: settings.vectorStoreAddress,
		documentsAddress: settings.documentsAddress,
		loader,
		model,
	});
	await embedding.setup();
	return embedding;
}
export async function newChat(history = []) {
	return await Chat.create(null, Message, history);
}
export async function loadChat(id) {
	return await Chat.load(null, Message, id);
}
export async function saveChat(chat) {
	await Chat.save(null, chat);
}
export async function getChatBot(
	textModel,
	embedding,
	translator,
	loader,
	autoMemory = true
) {
	const [persona, instructions, examples] = await Promise.all([
		loader.readFile(settings.chatbotPersonaAddress),
		loader.readFile(settings.chatbotInstructionsAddress),
		loader.readFile(settings.chatbotExamplesAddress),
	]);
	const chatbot = new Bot({
		persona,
		instructions,
		chatModel: textModel,
		retriever: embedding,
		autoMemory,
	});
	await chatbot.setup(translator);
	return chatbot;
}
export async function getJSONBot(
	textModel,
	embedding,
	translator,
	specificInstructions = "",
	examples = []
) {
	const [persona, instructions] = [
		"You are a natural language to JSON translator",
		`You must interpret natural language to values in JSON format, only based on the request and given examples. Ignore the context. JSON must be always wrapped in curly brackets at top, not brackets.\n${specificInstructions}`,
	];
	const JSONBot = new Bot({
		persona,
		instructions,
		examples,
		chatModel: textModel,
		retriever: embedding,
	});
	await JSONBot.setup(translator);
	return JSONBot;
}
export async function getTitleBot(textModel, embedding, translator) {
	const instructions =
		"Based on the given chat, write a title that gives the user a context about what the conversation is about. The title's length can't be more than 255 characters.";
	const titleBot = new Bot({
		instructions,
		chatModel: textModel,
		retriever: embedding,
	});
	await titleBot.setup(translator);
	return titleBot;
}

export { Message };
