const { resolve } = require("../../lib/dir.js");

const TestEmbedding = require(resolve([
	"src",
	"infrastructure",
	"Embeddings",
	"test.js",
]));

describe("Test class", () => {
	const testEmbedding = new TestEmbedding({
		engine: "test",
		model: {},
	});
	test("should return true when calling storageExists", () => {
		expect(testEmbedding.storageExists()).toBe(true);
	});

	test("should return an object with action 'create' when calling createStorage", () => {
		expect(testEmbedding.createStorage()).toEqual({ action: "create" });
	});

	test("should return an object with action 'load' when calling loadStorage", () => {
		expect(testEmbedding.loadStorage()).toEqual({ action: "load" });
	});

	test("should return an empty array when calling search with an invalid query", () => {
		expect(testEmbedding.search()).toEqual([]);
	});

	test("should return an empty array when calling search with a valid query", () => {
		expect(testEmbedding.search("test query")).toEqual([]);
	});
});
