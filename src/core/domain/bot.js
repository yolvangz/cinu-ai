const loader = require("../application/loader.js");

(async () => {
	const { bot, Message } = await loader();
	let question, answer;

	question = new Message("user", "¿Qué es el lenguaje?");
	answer = await bot.answer(question);
	console.log(question.content, answer.content);

	bot.history = bot.history.concat(question);
	bot.history = bot.history.concat(answer);
	question = new Message("user", "Establece su relación con la matemática.");
	answer = await bot.answer(question);
	console.log(question.content, answer.content);
})();
