const fs = require("node:fs/promises");
const pdf = require("pdf-parse");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const PARENT_FOLDER = path.dirname(__dirname);
const fileURI = path.resolve(PARENT_FOLDER, process.env.TEST_PDF_FILENAME);

const databuffer = async (uri) => {
	try {
		const text = await fs.readFile(uri);
		const buffer = Buffer.from(text);
		return buffer;
	} catch (err) {
		if (err.code === "ENOENT") {
			console.log("Error: archivo no encontrado");
		} else {
			console.log("Error al leer el archivo:", err);
		}
		throw err;
	}
};
const read = async (uri) => {
	// Check if URI is valid
	if (typeof uri !== "string") throw new Error();

	const info = await databuffer(uri);
	const rawData = await pdf(info);
	const trimData = rawData.text.trim();
	const lines = trimData.split("\n");
	const trimmedLines = lines.map((line) => line.trim());
	const data = trimmedLines.join("\n");
	return data;
};
const chunk = async (textoCrudo) => {
	const tamano = process.env.CHUNK_SIZE ?? 10000;
	const desplazamiento = process.env.CHUNK_OVERLAP ?? 9000;
	const chunks = [];
	for (let i = 0; i < textoCrudo.length; i += desplazamiento) {
		let trozo = textoCrudo.substring(i, i + tamano);
		chunks.push(trozo);
	}
	console.log(chunks);
};
const text = read(fileURI);
console.log(text);
module.exports = { read, chunk };
