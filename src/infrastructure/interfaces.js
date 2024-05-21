const Model = {
	constructor: function (settings) {},
	getTextModel: function () {},
	getEmbeddingModel: function () {},
	getVisionModel: function () {},
};

const Embedding = {
	constructor: function (settings) {},
	setup: function () {},
	engine: {},
	model: {},
	splitter: {},
	search: function (query) {},
};

const Loader = {
	readFile: function (location) {},
	readFolder: function (location) {},
	chunk: function (input, size, overlap) {},
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
		)
			return false;
	}
	return true;
}

module.exports = { implementsInterface, Model, Embedding, Loader, Bot, Chat, Message, Question, Answer };
