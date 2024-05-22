const fs = require("node:fs/promises");
const { Document } = require("langchain/document");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { resolve } = require("../../lib/dir.js");
const { implementsInterface, Embedding } = require(resolve([
	"src",
	"infrastructure",
	"interfaces.js",
]));
const FaissEmbedding = require(resolve([
	"src",
	"infrastructure",
	"Embeddings",
	"faiss.js",
]));
const Loader = require(resolve([
	"src",
	"infrastructure",
	"Loaders",
	"langchain-documents.js",
]));
const AIModel = require(resolve([
	"src",
	"infrastructure",
	"Models",
	"gemini.js",
]));
const dotenv = require("dotenv");
dotenv.config();

describe("Faiss class with Gemini and langchain Document Loaders", () => {
	const gemini = new AIModel({
		credentials: process.env.GEMINI_API_KEY,
		options: {
			embedding: {
				model: "embedding-001",
			},
		},
	});
	const loader = new Loader({
		chunkSize: Number(process.env.CHUNK_SIZE),
		chunkOverlap: Number(process.env.CHUNK_OVERLAP),
	});
	let faiss;
	let faissSettings = {
		model: gemini.getEmbeddingModel(),
		loader: loader,
		documentsAddress: resolve(["tests", "src", "faiss", "documents"]),
		vectorStoreAddress: resolve(["tests", "src", "faiss", "faiss_index"]),
	};

	beforeAll(async () => {
		faiss = await new FaissEmbedding(faissSettings);
		await faiss.setup();
	});

	test("Class should have implemented interface correctly", async () => {
		expect(implementsInterface(faiss, Embedding)).toBe(true);
	});

	test("should check if storage exists", async () => {
		const result = await faiss.checkStorage();
		expect(result).toBe(true);
	});

	test("should search", async () => {
		const query = "Yolo";
		const response = await faiss.search(query);
		text = response.reduce((acc, result) => {
			return acc + result.pageContent;
		}, "");
		console.log("content of search", text);
		expect(text.search(query)).toBeGreaterThan(-1);
	});
});
