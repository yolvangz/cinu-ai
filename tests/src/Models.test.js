const { resolve } = require("../../lib/dir.js");
const InterfaceAIModel = require(resolve([
	"src",
	"infrastructure",
	"Models",
	"interface.js",
]));
const {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");
const Gemini = require(resolve([
	"src",
	"infrastructure",
	"Models",
	"gemini.js",
]));
const dotenv = require("dotenv");
dotenv.config();

describe("InterfaceAIModel", () => {
	let model;

	beforeEach(() => {
		model = new InterfaceAIModel({
			options: {
				embedding: {
					model: "embedding-001",
				},
				text: {
					temperature: 1,
					model: "text-001",
				},
				vision: {}
			},
		});
	});

	test("should have a constructor that sets settings and options", () => {
		expect(model.settings).toBeDefined();
		expect(model.options).toBeDefined();
	});

	test("should have a text property that returns an object", () => {
		const result = model.text;
		expect(result).toEqual({});
	});

	test("should have a embedding property that returns an object", () => {
		const result = model.embedding;
		expect(result).toEqual({});
	});

	test("should have a vision property that returns an object", () => {
		const result = model.vision;
		expect(result).toEqual({});
	});
});

describe("Gemini", () => {
	const gemini = new Gemini({
		credentials: process.env.GEMINI_API_KEY,
		options: {
			embedding: {
				model: "embedding-001",
			},
			text: {
				temperature: 1,
				model: "gemini-1.0-pro",
			},
			vision: {
				model: "gemini-1.0-pro-vision",
			},
		},
	});

	test("should have a constructor that sets settings and options", () => {
		expect(gemini.settings).toBeDefined();
		expect(gemini.options).toBeDefined();
	});

	test("should have a text property that returns an object", () => {
		const result = gemini.text;
		expect(result).toBeInstanceOf(ChatGoogleGenerativeAI);
	});

	test("should have a embedding property that returns an object", () => {
		const result = gemini.embedding;
		expect(result).toBeInstanceOf(GoogleGenerativeAIEmbeddings);
	});

	test("should have a vision property that returns an object", () => {
		const result = gemini.vision;
		console.log(gemini.vision);
		expect(result).toBeInstanceOf(ChatGoogleGenerativeAI);
	});
});
