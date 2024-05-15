const path = require("path");
const fs = require("fs");
const pdfParse = require("./pdf-extract.js");
const dotenv = require("dotenv");
dotenv.config();

const PARENT_FOLDER = path.dirname(__dirname);
const inputFileURI = path.resolve(PARENT_FOLDER, process.env.TEST_PDF_FILENAME);
const expectedFileURI = path.resolve(PARENT_FOLDER, "expected-output.txt");
const resultFileURI = path.resolve(PARENT_FOLDER, "result-output.txt");

test("Extract test-document.pdf", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await pdfParse.read(inputFileURI);
	fs.writeFileSync(resultFileURI, result);
	await expect(result).toBe(expectedText);
});
