const path = require("path");

const reference = __dirname;
const parent = (dir = reference) => path.dirname(dir);
const root = () => parent(reference);
const resolve = (directions, ref = root()) => {
	if (!Array.isArray(directions)) throw new Error("parameter not array");
	if (directions.length < 1) throw new Error("length less than 1 element");
	if (directions.some(val => typeof val !== "string"))
		throw new Error("some array element is not string");
	return directions.reduce((dirString, dirAppend) => {
		return path.resolve(dirString, dirAppend);
	}, ref);
};

module.exports = { parent, root, resolve };
