import { HumanMessage, AIMessage } from "@langchain/core/messages";

function generateRandom12DigitInt() {
	// Generate a random number between 10^11 (100 billion) and 10^12 (1 trillion) - 1 (exclusive)
	// This ensures the number has 12 digits
	const lowerBound = 10 ** 11;
	const upperBound = 10 ** 12 - 1;
	const randomInt =
		Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;

	// Convert the random integer to a string
	return randomInt.toString();
}

class LangchainChat {
	#chat_id;
	#title;
	#messageConstructor;
	#roles;
	#history;

	constructor(settings) {
		this.settings = settings;
		this.#chat_id = settings.id;
		this.#history = settings.history;
		this.#messageConstructor = settings.Message;
		this.#roles = settings.roles;
	}
	static async create(dataAccess, Message, history = []) {
		return new this({
			id: generateRandom12DigitInt(),
			Message,
			history,
			roles: [
				{ native: AIMessage, role: "bot" },
				{ native: HumanMessage, role: "user" },
			],
		});
	}
	static async load(dataAccess, Message, id) {
		return new this._constructor({
			id,
			Message,
			history: [],
			roles: [
				{ native: AIMessage, role: "bot" },
				{ native: HumanMessage, role: "user" },
			],
		});
	}
	async save(dataAccess, chat) {}
	#translateMessageToNative(message, msgConstructor, roles) {
		let messageFormat = roles.find((role) => message.from === role.role);
		if (messageFormat === undefined)
			throw new Error(`Unsupported abstract message type: ${message.from}`);
		return msgConstructor.convert(message, messageFormat.native);
	}
	#translateNativeToMessage(natMessage, msgConstructor, roles) {
		let messageRole = roles.find((role) => natMessage instanceof role.native);
		if (messageRole === undefined)
			throw new Error("Unsupported native message type");
		return msgConstructor.convert(natMessage, null, messageRole.role);
	}
	addMessages(...list) {
		for (let msg of list) {
			this.#history.push(msg);
		}
	}
	get id() {
		return this.#chat_id;
	}
	get title() {
		return this.#title;
	}
	get history() {
		return this.#history;
	}
	get translator() {
		return {
			roles: this.#roles,
			interface: this.#messageConstructor,
			messageToNative: (message) => {
				if (Array.isArray(message)) {
					if (message.length === 0) return [];
					let acm = [];
					for (let msg of message) {
						acm.push(
							this.#translateMessageToNative(
								msg,
								this.#messageConstructor,
								this.#roles
							)
						);
					}
					return acm;
				} else {
					return this.#translateMessageToNative(
						message,
						this.#messageConstructor,
						this.#roles
					);
				}
			},
			nativeToMessage: (message) => {
				if (Array.isArray(message)) {
					if (message.length === 0) return [];
					let acm = [];
					for (let msg of message) {
						acm.push(
							this.#translateNativeToMessage(
								msg,
								this.#messageConstructor,
								this.#roles
							)
						);
					}
					return acm;
				} else {
					return this.#translateNativeToMessage(
						message,
						this.#messageConstructor,
						this.#roles
					);
				}
			},
		};
	}
}
export { LangchainChat };
