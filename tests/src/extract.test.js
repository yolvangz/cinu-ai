const fs = require("fs");
const dotenv = require("dotenv");
const dir = require("../../lib/dir.js");
const { implementsInterface, Loader } = require(dir.resolve([
	"src",
	"infrastructure",
	"interfaces.js",
]));
const extract = require(dir.resolve([
	"src",
	"infrastructure",
	"Loaders",
	"extract.js",
]));
dotenv.config();

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
const pdfParse = new extract({
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
