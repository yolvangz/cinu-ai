import * as fs from "fs";
import * as dotenv from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from "url";
import * as dir from "../../lib/dir.js";
import {
	implementsInterface,
	Loader,
} from "../../infrastructure/interfaces.js";
import { DocumentsLoader } from "../../infrastructure/loaders.js";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputFileURI = dir.resolve(
	["extract", process.env.TEST_PDF_FILENAME],
	__dirname
);
const expectedFileURI = dir.resolve(
	["extract", process.env.TEST_EXPECTED_FILENAME],
	__dirname
);
const resultFileURI = dir.resolve(
	["extract", process.env.TEST_OUTPUT_FILENAME],
	__dirname
);
const langchainLoader = new DocumentsLoader({
	chunkSize: 15,
	chunkOverlap: 5,
});
test("Check if interface is correctly implemented", () => {
	expect(implementsInterface(langchainLoader, Loader)).toBe(true);
});

test("Extract test-document.pdf to raw text", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await langchainLoader.readFile(inputFileURI);
	await expect(result).toBe(expectedText);
});
test("Extract test-document.pdf to Document object", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await langchainLoader.readFile(inputFileURI, true);
	await expect(result.pageContent).toBe(expectedText);
});

test("Chunking text file from raw text to raw text array", async () => {
	const text = "Lorem ipsum dolor sit amet.";
	const expected = ["Lorem ipsum", "dolor sit", "sit amet."];
	const result = await langchainLoader.chunk(text);
	expect(result).toStrictEqual(expected);
});

test("Chunking text file from raw text to Document array", async () => {
	const text = "Lorem ipsum dolor sit amet.";
	const expected = ["Lorem ipsum", "dolor sit", "sit amet."];
	const result = await langchainLoader.chunk(text, true);
	expect(result.map((result) => result.pageContent)).toStrictEqual(expected);
});

test("Extract test-document.pdf to Document object and chunk it", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const doc = await langchainLoader.readFile(inputFileURI, true);
	const chunked = await langchainLoader.chunk(doc, true);
	const expected = [
		"PDF de prueba",
		"Texto de",
		"de prueba.",
		"Yolo",
		"Yolo, Tengo",
		"carácteres",
		"extraños para",
		"para todos los",
		"los idiomas.",
	];
	expect(chunked.map((chunk) => chunk.pageContent)).toStrictEqual(expected);
});

test("Check some location", async () => {
	const result = await langchainLoader.checkLocation(__dirname);
	expect(result).toBe(true);
});

const inputFolderURI = dir.resolve([
	"tests",
	"infrastructure",
	"faiss",
	"documents",
]);
test("Extract test-document.pdf from folder to Document object", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const docs = await langchainLoader.readFolder(inputFolderURI, true);
	for (const doc of docs) {
		expect(doc.pageContent).toBe(expectedText);
	}
});
