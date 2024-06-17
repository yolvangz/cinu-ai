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
	setup: async function () {},
	settings: {},
	storage: {},
	search: async function (query) {},
};

const Bot = {
	constructor: function (settings) {},
	setup: async function () {},
	history: [],
	answer: function (question) {},
};

const Chat = {
	_constructor: function (settings) {},
	create: async function (dataAccess, Message, history) {},
	load: async function (dataAccess, Message, id) {},
	save: async function (dataAccess, chat) {},
	addMessages: function (...messages) {},
	translator: {},
	ID: "",
	title: "",
	history: [],
};

const Message = {
	constructor: function () {},
	from: "",
	content: "",
};

function implementsInterface(obj, interfaceToCheck) {
	for (const methodOrProperty in interfaceToCheck) {
		if (
			!(methodOrProperty in obj) ||
			typeof obj[methodOrProperty] !== typeof interfaceToCheck[methodOrProperty]
		) {
			console.log(
				`${typeof obj[methodOrProperty]} !== ${typeof interfaceToCheck[
					methodOrProperty
				]}`
			);
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
};
