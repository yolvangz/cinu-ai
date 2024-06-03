const fs = require("fs");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout,
});

const config = require("../env.default.json"); // Replace with path to your JSON file

const environments = ["production", "development"];

async function main() {
	let env = await promptEnvironment();
	let content = "";

	for (const key in config[env]) {
		const choices = config[env][key].choices;
		let value;

		if (choices.length === 0) {
			value = await promptValue(`Enter value for ${key}: `);
		} else if (choices.length === 1 && choices[0].default) {
			value = await promptOverride(
				choices[0].value,
				`Override default value for ${key}: ${choices[0].value} (y/N)? `
			);
		} else {
			value = await promptChoice(choices, key);
		}

		if (value) {
			content += `${key}=${value}\n`;
		}
	}

	await confirmWrite(content);
}

function promptEnvironment() {
	return new Promise((resolve) => {
		readline.question(
			"Select environment (production/development): ",
			(answer) => {
				if (environments.includes(answer.toLowerCase())) {
					resolve(answer.toLowerCase());
				} else {
					console.error(
						"Invalid environment. Please choose production or development."
					);
					promptEnvironment().then(resolve);
				}
			}
		);
	});
}

function promptValue(message) {
	return new Promise((resolve) => {
		readline.question(message, (answer) => {
			if (!answer) {
				console.error("Value cannot be empty.");
				promptValue(message).then(resolve);
			} else {
				resolve(answer);
			}
		});
	});
}

function promptOverride(defaultValue, message, optional = true) {
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

function promptChoice(choices, key) {
	return new Promise((resolve) => {
		console.log(`Available options for ${key}:`);
		choices.forEach((choice, index) => {
			console.log(
				`${index + 1}. ${choice.value} ${choice.default ? "(default)" : ""}`
			);
		});
		readline.question(
			"Choose an option (number) or press Enter for default: ",
			(answer) => {
				const parsed = parseInt(answer);
				if (
					answer &&
					!isNaN(parsed) &&
					parsed > 0 &&
					parsed <= choices.length
				) {
					resolve(choices[parsed - 1].value);
				} else {
					resolve(choices.find((choice) => choice.default)?.value);
				}
			}
		);
	});
}

function confirmWrite(content) {
	return new Promise((resolve) => {
		console.log("\nYour .env file will look like this:");
		console.log(content);
		readline.question("Continue (y/N)? ", (answer) => {
			if (answer.toLowerCase() === "y") {
				fs.writeFile(".env", content, (err) => {
					if (err) {
						console.error("Error creating .env file:", err);
					} else {
						console.log(".env file created successfully!");
					}
					resolve();
				});
			} else {
				resolve();
			}
		});
	});
}

main().then(() => readline.close());
