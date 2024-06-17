import * as path from "node:path";
import { fileURLToPath } from "url";

const reference = path.dirname(fileURLToPath(import.meta.url));
const parent = (dir = reference) => path.dirname(dir);
const root = () => parent(reference);
/**
 * Resolve a path based on the given directions array.
 *
 * @param {Array} directions - Array of strings representing the path directions.
 * @param {string} [ref=root()] - Optional reference path to start resolving from.
 * @return {string} The resolved path based on the given directions.
 */
const resolve = (directions, ref = root()) => {
	if (!Array.isArray(directions)) throw new Error("parameter not array");
	if (directions.length < 1) throw new Error("length less than 1 element");
	if (directions.some((val) => typeof val !== "string"))
		throw new Error("some array element is not string");
	return directions.reduce((dirString, dirAppend) => {
		return path.resolve(dirString, dirAppend);
	}, ref);
};

export { parent, root, resolve };
