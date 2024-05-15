const fs = require("fs");
const dotenv = require("dotenv");
const dir = require("../../lib/dir.js");
const pdfParse = require(dir.resolve(["src", "extract.js"]));
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

test("Extract test-document.pdf", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await pdfParse.read(inputFileURI);
	fs.writeFileSync(resultFileURI, result);
	await expect(result).toBe(expectedText);
});

test("Chunking text file", () => {
	const text = "Lorem ipsum dolor sit amet.";
	const expected = ["Lorem ipsum dol", "m dolor sit ame", "dolor sit amet."];
	expect(pdfParse.chunk(text, 15, 5)).toStrictEqual(expected);
});
