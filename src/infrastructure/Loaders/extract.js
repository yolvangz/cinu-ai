const fs = require("node:fs/promises");
const path = require("node:path");
const PDF = require("pdf-parse");

/**
 * Asynchronously reads the content of a file at the specified URI and converts it into a Buffer.
 *
 * @param {string} uri - The URI of the file to read.
 * @return {Promise<Buffer>} A promise that resolves with the content of the file as a Buffer.
 */
const databuffer = async (uri) => {
	try {
		return await fs.readFile(uri, { encoding: null });
	} catch (err) {
		console.error(
			err.code === "ENOENT"
				? new Error(`Error: archivo ${uri} no encontrado`)
				: new Error(`Error al leer el archivo: ${err}`)
		);
	}
};
/**
 * Asynchronously reads a URI, processes the data (specifically for PDF files), and returns the trimmed lines.
 *
 * @param {string} uri - The URI to read (supports only PDF files)
 * @return {string} The processed and trimmed data
 */
const readFile = async (uri) => {
	const info = await databuffer(uri);
	const rawData = await PDF(info);
	const trimData = rawData.text.trim();
	const lines = trimData.split(/\s*\n\s*/);
	const trimmedLines = lines.map((line) => line.trim());
	return trimmedLines.join("\n");
};
const readFolder = async (uri) => {
	try {
		const exists = await checkLocation(uri);
		if (!exists) throw new Error(`no existe el directorio ${uri}`);
		const files = await fs.readdir(uri);
		const readFiles = files.map((fileName) => {
			return path.join(uri, fileName);
		});
		return await readFiles.map(async (file) => await readFile(file));
	} catch (err) {
		console.error(err);
		throw err;
	}
};
/**
 * Splits the input text into chunks of a specified size with an optional offset.
 *
 * @param {string|Array<string>} input - The input text or array of input texts to be chunked.
 * @param {number} [tamano=1] - The size of each chunk (default is 1).
 * @param {number} [desplazamiento=0] - The offset for chunking (default is 0).
 * @return {Array<string>} An array of text chunks based on the specified size and offset.
 */
async function chunk(input, docObject = false) {
	const tamano = this.chunkSize;
	const desplazamiento = this.chunkOverlap;
	const textoCrudo = Array.isArray(input) ? input.join("\n\n") : input;
	const step = tamano - desplazamiento;
	const chunks = [];
	for (let i = 0; i < textoCrudo.length; i += step) {
		const end = Math.min(i + tamano, textoCrudo.length);
		const start = end === textoCrudo.length ? textoCrudo.length - tamano : i;
		chunks.push(textoCrudo.slice(start, end));
	}
	return chunks;
}
const checkLocation = async (location) => {
	try {
		await fs.access(location);
		return true;
	} catch (err) {
		return false;
	}
};

function newLoader(settings) {
	this.settings = settings;
	this.chunkSize = settings.chunkSize;
	this.chunkOverlap = settings.chunkOverlap;
	this.readFile = readFile;
	this.readFolder = readFolder;
	this.chunk = chunk.bind(this);
	this.checkLocation = checkLocation;
	return this;
}

module.exports = newLoader;
