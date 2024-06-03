import * as fs from "fs";
import dotenv from "dotenv";
import * as dir from "../../lib/dir.js";
import * as path from "node:path";
import { fileURLToPath } from "url";
import {
	implementsInterface,
	Loader,
} from "../../infrastructure/interfaces.js";
import { PDFParse } from "../../infrastructure/loaders.js";
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
const pdfParse = new PDFParse({
	chunkSize: 15,
	chunkOverlap: 5,
});
test("Check if interface is correctly implemented", () => {
	expect(implementsInterface(pdfParse, Loader)).toBe(true);
});

test("Extract test-document.pdf", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await pdfParse.readFile(inputFileURI);
	fs.writeFileSync(resultFileURI, result);
	await expect(result).toBe(expectedText);
});

test("Chunking text file", async () => {
	const text = "Lorem ipsum dolor sit amet.";
	const expected = ["Lorem ipsum dol", "m dolor sit ame", "dolor sit amet."];
	const result = await pdfParse.chunk(text);
	expect(result).toStrictEqual(expected);
});

test("Check some location", async () => {
	const result = await pdfParse.checkLocation(__dirname);
	expect(result).toBe(true);
});
