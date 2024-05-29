// Common dependencies
const fs = require("node:fs");
const path = require("node:path");
// DocumentLoader dependencies
const { Document } = require("langchain/document");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { DocxLoader } = require("langchain/document_loaders/fs/docx");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// PDFparse aditional dependencies
const fsPromise = require("node:fs/promises");
const pdfParse = require("pdf-parse");

//DBConect dependence
const sql = require("mysql")

class PDFParse {
	constructor(settings) {
		this.settings = settings;
		this.chunkSize = settings.chunkSize;
		this.chunkOverlap = settings.chunkOverlap;
	}
	/**
	 * Asynchronously reads the content of a file at the specified URI and converts it into a Buffer.
	 *
	 * @param {string} uri - The URI of the file to read.
	 * @return {Promise<Buffer>} A promise that resolves with the content of the file as a Buffer.
	 */
	async databuffer(uri) {
		try {
			return await fsPromise.readFile(uri, { encoding: null });
		} catch (err) {
			console.error(
				err.code === "ENOENT"
					? new Error(`Error: archivo ${uri} no encontrado`)
					: new Error(`Error al leer el archivo: ${err}`)
			);
		}
	}
	/**
	 * Asynchronously reads a URI, processes the data (specifically for PDF files), and returns the trimmed lines.
	 *
	 * @param {string} uri - The URI to read (supports only PDF files)
	 * @return {string} The processed and trimmed data
	 */
	async readFile(uri) {
		const info = await this.databuffer(uri);
		const rawData = await pdfParse(info);
		const trimData = rawData.text.trim();
		const lines = trimData.split(/\s*\n\s*/);
		const trimmedLines = lines.map((line) => line.trim());
		return trimmedLines.join("\n");
	}
	async readFolder(uri) {
		try {
			const exists = await this.checkLocation(uri);
			if (!exists) throw new Error(`no existe el directorio ${uri}`);
			const files = await fsPromise.readdir(uri);
			const readFiles = files.map((fileName) => {
				return path.join(uri, fileName);
			});
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

class DBConect{
  #host
  #user
  #password
  #database
  constructor(dbdata){
    this.#host = dbdata.host
    this.#user = dbdata.user
    this.#password = dbdata.password
    this.#database = dbdata.database
    this.conection = sql.createConnection({
      host : this.#host,user : this.#user,password :this.#password,database : this.#database
    })
  }

  async conector(consult,box){
    try{
      const result = await new Promise ((resolve, reject) => {
        this.conection.query(consult,box,(error, result) => {
          if (error) {
            reject(error);
          }
            resolve(result);
        })
      })
      return result
    }catch(Error){
      console.log(Error);
      process.exit(1)
    }
  }

  async readmany(table) {
    let consult = "SELECT * From ??";
    const box = [table]
    const result = await this.conector(consult,box)
    console.log(result)
    return result
  }
  async readsingle(table,where){
    const consult = "SELECT * From ?? where email = ?"
    const box = [table, where]
    const result = await this.conector(consult,box)
    console.log(result)
    return result
  }

  async findOut(table,data){
    const result = await this.readmany(table)
    try {
      for (const key of result) {
        if( key["email"] === data[0] ) throw new Error("Email ya existente")
        if( key["cedula"] === data[1] ) throw new Error("Cedula ya existente")
      }
      return false
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }

  async insert(index,data,table) {
    let consult = "INSERT INTO ?? (??) VALUES (?)";
    const box = [table,index,data]
    const result = await this.conector(consult,box)
    console.log(result.affectedRows)
  }

  async update(table,index,data,Id){
    const consult = "Update ?? SET ?? = ? where Id = ?"
    const box = [table,index,data,Id]
    const result = await this.conector(consult,box)
    console.log(result.affectedRows)
  }

  async delete(table,where){
    if(where == null || where === "") throw new Error("No se permite realziar esta accion") 
    let consult="Delete from ?? where email = ?"
    const box = [table,where]
    const result = await this.conector(consult,box)
    console.log(result)
  }
}

module.exports = { DocumentsLoader, PDFParse, DBConect };
