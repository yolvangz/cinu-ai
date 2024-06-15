// Common dependencies
import * as fs from "node:fs";
import * as path from "node:path";
// DocumentLoader dependencies
import { Document } from "langchain/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// PDFparse aditional dependencies
import * as fsPromise from "node:fs/promises";
import * as PDFJS from "pdfjs-dist/legacy/build/pdf.mjs";

class PDFParse {
	constructor(settings) {
		this.settings = settings;
		this.chunkSize = settings.chunkSize;
		this.chunkOverlap = settings.chunkOverlap;
	}
	/**
	 * Asynchronously reads a URI, processes the data (specifically for PDF files), and returns the trimmed lines.
	 *
	 * @param {string} uri - The URI to read (supports only PDF files)
	 * @return {string} The processed and trimmed data
	 */
	async readFile(uri) {
		try {
			// Load the PDF document
			const pdf = await PDFJS.getDocument(uri).promise;

			// Get the number of pages
			const numPages = pdf.numPages;

			// Create an empty array to store extracted text
			const extractedText = [];

			// Extract text from each page
			for (let i = 1; i <= numPages; i++) {
				const page = await pdf.getPage(i);
				const content = await page.getTextContent();

				// Combine page text into a single string
				const pageText = content.items
					.map((item) => item.str)
					.filter((item) => item.length > 0)
					.join("\n");
				extractedText.push(pageText);
			}
			// Return the combined text from all pages
			const trimmedLines = extractedText.map((line) => line.trim());
			return trimmedLines.join("\n\n");
		} catch (err) {
			console.error("Error extracting text:", err);
			throw err; // Handle errors gracefully, return empty string or throw
		}
	}
	async readFolder(uri) {
		try {
			const exists = await this.checkLocation(uri);
			if (!exists) throw new Error(`no existe el directorio ${uri}`);
			const files = (await fsPromise.readdir(uri)).filter((filename) =>
				filename.endsWith(".pdf")
			);
			const readFiles = files.map((fileName) => path.join(uri, fileName));
			return await readFiles.map(async (file) => await readFile(file));
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
	/**
	 * Splits the input text into chunks of a specified size with an optional offset.
	 *
	 * @param {string|Array<string>} input - The input text or array of input texts to be chunked.
	 * @param {number} [tamano=1] - The size of each chunk (default is 1).
	 * @param {number} [desplazamiento=0] - The offset for chunking (default is 0).
	 * @return {Array<string>} An array of text chunks based on the specified size and offset.
	 */
	async chunk(input, docObject = false) {
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
	async checkLocation(location) {
		try {
			await fsPromise.access(location);
			return true;
		} catch (err) {
			return false;
		}
	}
}
class DocumentsLoader {
	#chunkSize;
	#chunkOverlap;
	constructor(settings) {
		this.settings = settings;
		this.#setup();
	}
	#setup() {
		this.#chunkSize = this.settings.chunkSize;
		this.#chunkOverlap = this.settings.chunkOverlap;
	}
	#access(uri) {
		try {
			fs.accessSync(uri);
			return true;
		} catch (err) {
			return false;
		}
	}
	#pdf(path) {
		return new PDFLoader(path, {
			splitPages: false,
			pdfjs: () => import("pdfjs-dist/legacy/build/pdf.mjs"),
		});
	}
	#docx(path) {
		return new DocxLoader(path);
	}
	#txt(path) {
		return new TextLoader(path);
	}
	#trim(text) {
		const trimData = text.trim();
		const lines = trimData.split(/\s*\n\s*/);
		const trimmedLines = lines.map((line) => line.trim());
		return trimmedLines.join("\n");
	}
	async readFile(uri, docObject = false) {
		let loader;
		try {
			switch (path.extname(uri)) {
				case ".pdf":
					loader = this.#pdf(uri);
					break;
				case ".docx":
					loader = this.#docx(uri);
					break;
				case ".txt":
					loader = this.#txt(uri);
					break;
				default:
					throw new Error("extension not supported");
			}
			if (!this.#access(uri)) throw new Error("No existe el archivo");
			const result = await loader.load();
			const doc = result[0];
			doc.pageContent = doc.pageContent ?? "";
			doc.pageContent = this.#trim(doc.pageContent);
			return docObject ? doc : doc.pageContent;
		} catch (err) {
			console.error("Error cargando archivo " + uri, err.message);
			return null;
		}
	}
	async readFolder(documentsFolder, docObject = false) {
		let documentsObjects;
		const checkFolder = await this.#access(documentsFolder);
		if (!checkFolder)
			throw new Error(`No existe el directorio ${documentFolder}`);
		const directory = new DirectoryLoader(documentsFolder, {
			".pdf": (path) => this.#pdf(path),
			".docx": (path) => this.#docx(path),
		});
		try {
			documentsObjects = await directory.load();
		} catch (err) {
			console.error(err);
		}
		const trimmedDocumentsObjects = documentsObjects.map((doc) => {
			doc.pageContent = this.#trim(doc.pageContent);
			return doc;
		});
		return docObject
			? trimmedDocumentsObjects
			: trimmedDocumentsObjects.map((doc) => doc.pageContent);
	}
	async chunk(input, docObject = false) {
		let documents;
		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: this.#chunkSize,
			chunkOverlap: this.#chunkOverlap,
		});
		if (Array.isArray(input)) {
			if (input.every((doc) => doc instanceof Document)) {
				documents = input;
			} else if (input.every((doc) => typeof doc === "string")) {
				documents = input.map((doc) => new Document({ pageContent: doc }));
			} else {
				throw new Error("input must be an array of strings or documents");
			}
		} else {
			documents =
				input instanceof Document
					? [input]
					: [new Document({ pageContent: input })];
		}
		const result = await textSplitter.splitDocuments(documents);
		if (docObject) return result;
		return result.map((doc) => doc.pageContent);
	}
	async checkLocation(location) {
		return this.#access(location);
	}
}

export { DocumentsLoader, PDFParse };
