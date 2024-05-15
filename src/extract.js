const fs = require("node:fs/promises");
const pdf = require("pdf-parse");

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
const chunk = (textoCrudo, tamano = 1, desplazamiento = 0) => {
	const chunks = [];
	const step = tamano - desplazamiento;
	const length = textoCrudo.length;
	for (let i = 0, trozo = ""; i < length; i += step) {
		trozo =
			i + tamano < length
				? textoCrudo.substr(i, tamano)
				: textoCrudo.substring(length - tamano, length);
		chunks.push(trozo);
	}
	return chunks;
};

module.exports = { read, chunk };
