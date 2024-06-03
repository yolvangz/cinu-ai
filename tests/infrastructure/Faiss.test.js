import fs from "node:fs/promises";
import { Document } from "langchain/document";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { resolve } from "../../lib/dir.js";
import { implementsInterface, Embedding } from "../../infrastructure/interfaces.js";
import {Faiss as FaissEmbedding} from "../../infrastructure/embeddings.js";
import { DocumentsLoader as Loader } from "../../infrastructure/loaders.js";
import {Gemini as AIModel} from "../../infrastructure/models.js";
import dotenv from "dotenv";
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
		documentsAddress: resolve(["tests", "infrastructure", "faiss", "documents"]),
		vectorStoreAddress: resolve(["tests", "infrastructure", "faiss", "faiss_index"]),
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
		const text = response.reduce((acc, result) => {
			return acc + result.pageContent;
		}, "");
		console.log("content of search", text);
		expect(text.search(query)).toBeGreaterThan(-1);
	}, 10000);
});
