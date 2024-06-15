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
		return new PDFLoader(path, { splitPages: false });
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

export { DocumentsLoader };
