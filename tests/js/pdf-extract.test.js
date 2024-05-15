const fs = require("fs");
const dotenv = require("dotenv");
const dir = require("../../js/dir.js");
const pdfParse = require(dir.resolve(["js", "pdf-extract.js"]));
dotenv.config();

const inputFileURI = dir.resolve([process.env.TEST_PDF_FILENAME], __dirname);
const expectedFileURI = dir.resolve([process.env.TEST_EXPECTED_FILENAME], __dirname);
const resultFileURI = dir.resolve([process.env.TEST_OUTPUT_FILENAME], __dirname);

test("Extract test-document.pdf", async () => {
	const expectedText = fs.readFileSync(expectedFileURI, "utf8").toString();
	const result = await pdfParse.read(inputFileURI);
	fs.writeFileSync(resultFileURI, result);
	await expect(result).toBe(expectedText);
});
