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
	const data = await pdf(info);
	console.log(data.text);
	return data.text;
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
chunk();
module.exports = { read, chunk };
