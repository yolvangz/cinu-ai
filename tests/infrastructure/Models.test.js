const { resolve } = require("../../lib/dir.js");
const { implementsInterface, Model } = require(resolve([
	"infrastructure",
	"interfaces.js",
]));
const {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIEmbeddings,
} = require("@langchain/google-genai");
const { Gemini } = require(resolve(["infrastructure", "models.js"]));
const dotenv = require("dotenv");
dotenv.config();

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
	test("Class should have implemented interface correctly", () => {
		expect(implementsInterface(gemini, Model)).toBe(true);
	});
	test("should have a constructor that sets settings and options", () => {
		expect(gemini.settings).toBeDefined();
		expect(gemini.options).toBeDefined();
	});

	test("should have a text property that returns an object", () => {
		const result = gemini.getTextModel();
		expect(result).toBeInstanceOf(ChatGoogleGenerativeAI);
	});

	test("should have a embedding property that returns an object", () => {
		const result = gemini.getEmbeddingModel();
		expect(result).toBeInstanceOf(GoogleGenerativeAIEmbeddings);
	});

	test("should have a vision property that returns an object", () => {
		const result = gemini.getVisionModel();
		expect(result).toBeInstanceOf(ChatGoogleGenerativeAI);
	});
});
