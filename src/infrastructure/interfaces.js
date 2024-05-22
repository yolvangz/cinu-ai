const Model = {
	constructor: function (settings) {},
	getTextModel: function () {},
	getEmbeddingModel: function () {},
	getVisionModel: function () {},
};

const Loader = {
	constructor(settings) {},
	readFile: async function (location) {},
	readFolder: async function (location) {},
	chunk: async function (input, docObject = false) {},
	checkLocation: async function (location) {},
};

const Embedding = {
	constructor: function (settings) {},
	setup: function () {},
	settings: {},
	search: function (query) {},
};

const Bot = {
	constructor: function (settings) {},
	persona: "",
	instructions: "",
	examples: [""],
	template: "",
	model: {},
	getInstructions: function () {},
	answer: function (question) {},
};

const Chat = {
	constructor: function (settings) {},
	ID: "",
	title: "",
	addMessage: function () {},
};

const Message = {
	constructor: function () {},
	chatID: "",
	order: 0,
	from: "",
	getContent: function () {},
};

const Question = {
	...Message,
	getContext: function () {},
	getFullContent: function () {},
};

const Answer = {
	...Message,
	to: "",
};

function implementsInterface(obj, interfaceToCheck) {
	for (const methodOrProperty in interfaceToCheck) {
		if (
			!(methodOrProperty in obj) ||
			typeof obj[methodOrProperty] !== typeof interfaceToCheck[methodOrProperty]
		){
			console.log(`${typeof obj[methodOrProperty]} !== ${typeof interfaceToCheck[methodOrProperty]}`);
			return false;
		}
		if (Object.keys(interfaceToCheck[methodOrProperty]).length > 0) {
			if (Array.isArray(interfaceToCheck[methodOrProperty])) continue;
			if (
				!implementsInterface(
					obj[methodOrProperty],
					interfaceToCheck[methodOrProperty]
				)
			)
				return false;
		}
	}
	return true;
}

module.exports = {
	implementsInterface,
	Model,
	Embedding,
	Loader,
	Bot,
	Chat,
	Message,
	Question,
	Answer,
};
