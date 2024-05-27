const {
	Model,
	Loader,
	Embedding,
	Bot,
	Chat,
	Message,
	settings,
} = require("./loader.js");

const App = {
	getModels: function () {
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
	},
	getFileLoader: function () {
		return new Loader({
			chunkSize: settings.chunkSize,
			chunkOverlap: settings.chunkOverlap,
		});
	},
	getEmbedding: async function (loader, model) {
		const embedding = new Embedding({
			vectorStoreAddress: settings.vectorStoreAddress,
			documentsAddress: settings.documentsAddress,
			loader,
			model,
		});
		await embedding.setup();
		return embedding;
	},
	newChat: async function (history = []) {
		return await Chat.create(null, Message, history);
	},
	loadChat: async function (id) {
		return await Chat.load(null, Message, id);
	},
	saveChat: async function (chat) {
		await Chat.save(null, chat);
	},
	getChatBot: async function (textModel, embedding, translator, loader) {
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
			autoMemory: true,
		});
		await chatbot.setup(translator);
		return chatbot;
	},
	getJSONBot: async function (textModel, embedding, translator, specificInstructions = "", examples = []) {
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
	},
	getTitleBot: async function (textModel, embedding, translator) {
		const instructions =
			"Based on the given chat, write a title that gives the user a context about what the conversation is about. The title's length can't be more than 255 characters.";
		const titleBot = new Bot({
			instructions,
			chatModel: textModel,
			retriever: embedding,
		});
		await titleBot.setup(translator);
		return titleBot;
	},
	Message: Message,
};

module.exports = App;
