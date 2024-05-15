const dir = require("../../js/dir.js");
const dotenv = require("dotenv");
dotenv.config();

test("Getting parent folder from this script", () =>
	expect(dir.parent(__dirname)).toBe("/home/yolvangz/projects/cinu-ai/tests"));

test("Getting parent folder default", () =>
	expect(dir.parent()).toBe("/home/yolvangz/projects/cinu-ai"));

test("Getting root folder", () =>
	expect(dir.root()).toBe("/home/yolvangz/projects/cinu-ai"));

test("Resolve temporal path: tests/js/test-document.pdf", () => {
	const directions = ["tests", "js", "test-document.pdf"];
	expect(dir.resolve(directions)).toBe(
		"/home/yolvangz/projects/cinu-ai/tests/js/test-document.pdf"
	);
});

test("Resolve temporal path: tests/js/test-document.pdf from current folder", () => {
	const directions = ["test-document.pdf"];
	expect(dir.resolve(directions, __dirname)).toBe(
		"/home/yolvangz/projects/cinu-ai/tests/js/test-document.pdf"
	);
});
