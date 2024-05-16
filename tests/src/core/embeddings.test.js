const dotenv = require("dotenv");
const fs = require("node:fs");
const { resolve } = require("../../lib/dir.js");
const { Embeddings } = require(resolve([
	"src",
	"core",
	"application",
	"embeddings.js",
]));
dotenv.config();

describe("Embeddings", () => {
	let embeddings;
	let mockVectorAddress = resolve([process.env.VECTOR_STORE_ADDRESS]);
	let backupMockVectorAddress = resolve([`.${process.env.VECTOR_STORE_ADDRESS}`]);
	embeddings = new Embeddings(mockVectorAddress, "documentsAddress");

	test('createVectorStore should return an object with action "create"', () => {
		if (fs.existsSync(mockVectorAddress)){
			fs.renameSync(mockVectorAddress, backupMockVectorAddress);
			embeddings = new Embeddings(mockVectorAddress, "documentsAddress");
			fs.renameSync(backupMockVectorAddress, mockVectorAddress);
		} else {
			embeddings = new Embeddings(mockVectorAddress, "documentsAddress");
		}
		const result = embeddings.createVectorStore();
		expect(result).toEqual({ action: "create" });
	});

	test('loadVectorStore should return an object with action "load"', () => {
		let embeddings;
		if (!fs.existsSync(mockVectorAddress)) {
			fs.mkdirSync(mockVectorAddress);
			embeddings = new Embeddings(mockVectorAddress, "documentsAddress");
			fs.rmdirSync(mockVectorAddress, { recursive: false });
		} else {
			embeddings = new Embeddings(mockVectorAddress, "documentsAddress");
		}
		const result = embeddings.loadVectorStore();
		expect(result).toEqual({ action: "load" });
	});

	test("search should log the query", () => {
		const consoleSpy = jest.spyOn(console, "log");
		const query = "test query";
		embeddings.search(query);
		expect(consoleSpy).toHaveBeenCalledWith(`Make a search about: ${query}`);
		consoleSpy.mockRestore();
	});
});
