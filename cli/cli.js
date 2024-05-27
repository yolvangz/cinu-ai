const app = require("../src/core/app.js");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

function promptValue(message) {
	return new Promise((resolve) => {
		readline.question(message, (answer) => {
			if (!answer) {
				console.error("El valor no puede estar vacío.");
				promptValue(message).then(resolve);
			} else {
				resolve(answer);
			}
		});
	});
}

function promptConfirm(defaultValue, message, optional = true) {
	return new Promise((resolve) => {
		let attempts = 0; // Track number of attempts
		const maxAttempts = 3; // Set a maximum number of attempts

		const askForInput = () => {
			readline.question(message, (answer) => {
				if (answer.toLowerCase() === "y") {
					resolve(promptValue("Enter new value: "));
				} else if (answer.toLowerCase() === "n") {
					resolve(defaultValue);
				} else if (attempts < maxAttempts) {
					attempts++;
					console.error("Please enter y or N.");
					askForInput(); // Retry if invalid and attempts not exceeded
				} else {
					console.error("Maximum attempts reached. Using default value.");
					resolve(defaultValue);
				}
			});
		};
		askForInput();
	});
}
async function prompt(jsonBot, chatbot) {
	let exit;
	let question = new app.Message("user", await promptValue("> "));
	const answer = await chatbot.answer(question);
	exit = await jsonBot.answer(question);
	exit = JSON.parse(exit.content);
	console.log(answer.content);
	if (exit.exit) return 0;
	return await prompt(jsonBot, chatbot);
}

async function main() {
	const models = app.getModels();
	const loader = app.getFileLoader();
	const chat = await app.newChat();
	const embedding = await app.getEmbedding(loader, models.getEmbeddingModel());
	const [JSONBot, chatbot] = await Promise.all([
		app.getJSONBot(
			models.getTextModel(),
			embedding,
			chat.translator,
			'If there is no an question that can be interpreted to close the chat, then you must return "exit":false',
			[
				`User: Ya no tengo dudas.\nModel: "exit": true`,
				`User: Muchas gracias, ya me aclaraste\nModel: "exit":true`,
			]
		),
		app.getChatBot(models.getTextModel(), embedding, chat.translator, loader),
	]);
	console.log(
		"Bienvenido al CINU.ai CLI.\n\nPregunta cualquier duda que tengas. Cuando termines, di que ya no tienes mas dudas para cerrar el CLI.\n\n"
	);
	return await prompt(JSONBot, chatbot);
}

main().then(() => readline.close());
