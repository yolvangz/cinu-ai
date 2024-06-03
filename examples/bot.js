const app = require("../core/app.js");

(async () => {
	const loader = app.getFileLoader();
	const models = app.getModels();
	const embedding = await app.getEmbedding(loader, models.getEmbeddingModel());

	const chat = await app.newChat();
	const bot = await app.getChatBot(
		models.getTextModel(),
		embedding,
		chat.translator,
		loader
	);
	let question, answer;

	question = new app.Message("user", "¿Qué es el lenguaje?");
	answer = await bot.answer(question);
	chat.addMessages(question, answer);
	console.log(question.content, answer.content);
	question = new app.Message(
		"user",
		"Establece su relación con la matemática."
	);
	answer = await bot.answer(question);
	console.log(question.content, answer.content);
	chat.addMessages(question, answer);

	console.log("Showing history");
	console.log("bot");
	bot.history.forEach((elem) => console.log(elem.content));
	console.log();
	console.log("chat");
	chat.history.forEach((elem) => console.log(elem.content));
	console.log();
})();
