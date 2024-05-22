const fs = require("node:fs/promises");
const path = require("node:path");
const { Document } = require("langchain/document");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

class DocumentsLoader {
	#chunkSize;
	#chunkOverlap;
	constructor(settings) {
		this.settings = settings;
		this.#setup();
	}
	#setup() {
		this.fileSystem = fs;
		this.#chunkSize = this.settings.chunkSize;
		this.#chunkOverlap = this.settings.chunkOverlap;
	}
	async #accessFolder(uri) {
		try {
			this.fileSystem.access(uri);
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
	#trim(text) {
		const trimData = text.trim();
		const lines = trimData.split(/\s*\n\s*/);
		const trimmedLines = lines.map((line) => line.trim());
		return trimmedLines.join("\n");
	}
	async readFile(uri, docObject = false) {
		let loader;
		switch (path.extname(uri)) {
			case ".pdf":
				loader = this.#pdf(uri);
				break;
			case ".docx":
				loader = this.#docx(uri);
				break;
			default:
				throw new Error("extension not supported");
		}
		const result = await loader.load();
		const doc = result[0];
		doc.pageContent = this.#trim(doc.pageContent);
		return docObject ? doc : doc.pageContent;
	}
	async readFolder(documentsFolder, docObject = false) {
		if (!(await this.#accessFolder(documentFolder)))
			throw new Error(`No existe el directorio ${this.documentFolder}`);
		const directoryLoader = new DirectoryLoader(documentFolder, {
			".pdf": this.#pdf,
			".docx": this.#docx,
		});
		documentsObjects = await this.directoryLoader.load();
		return docObject
			? documentsObjects
			: documentsObjects.map((doc) => doc.pageContent);
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
		return await this.#accessFolder(location);
	}
}

module.exports = DocumentsLoader;
