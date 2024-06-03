import * as dir  from "../../lib/dir.js";
import * as path  from "node:path";
import { fileURLToPath } from 'url';
import * as dotenv  from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
	expect(dir.resolve(directions, "tests/js")).toBe(
		"/home/yolvangz/projects/cinu-ai/tests/js/test-document.pdf"
	);
});
