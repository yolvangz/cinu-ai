const fs = require("node:fs/promises");
const pdf = require("pdf-parse");

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
		throw err.code === "ENOENT" ? new Error("Error: archivo no encontrado") : new Error(`Error al leer el archivo: ${err}`);
	}
};
/**
 * Asynchronously reads a URI, processes the data (specifically for PDF files), and returns the trimmed lines.
 *
 * @param {string} uri - The URI to read (supports only PDF files)
 * @return {string} The processed and trimmed data
 */
const read = async (uri) => {
	if (typeof uri !== "string") throw new Error();

	const info = await databuffer(uri);
	const rawData = await pdf(info);
	const trimData = rawData.text.trim();
	const lines = trimData.split(/\s*\n\s*/);
	const trimmedLines = lines.map((line) => line.trim());
	return trimmedLines.join("\n");
};
/**
 * Splits the input text into chunks of a specified size with an optional offset.
 *
 * @param {string} textoCrudo - The input text to be chunked.
 * @param {number} [tamano=1] - The size of each chunk (default is 1).
 * @param {number} [desplazamiento=0] - The offset for chunking (default is 0).
 * @return {Array<string>} An array of text chunks based on the specified size and offset.
 */
const chunk = (textoCrudo, tamano = 1, desplazamiento = 0) => {
	const step = tamano - desplazamiento;
	const chunks = [];
	for (let i = 0; i < textoCrudo.length; i += step) {
		const end = Math.min(i + tamano, textoCrudo.length);
		const start = end === textoCrudo.length ? textoCrudo.length - tamano : i;
		chunks.push(textoCrudo.slice(start, end));
	}
	return chunks;
};

module.exports = { read, chunk };
