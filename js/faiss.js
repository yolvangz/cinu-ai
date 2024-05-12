const { GoogleGenerativeAI }= require("@google/generative-ai");
const os = require("node:os")
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts")
const { loadQAChain } = require("langchain/chains")
const { FaissStore } = require("@langchain/community/vectorstores/faiss")
const { chunk } = require("./pdf-extrac")

const get_vector_store = async () => {
  let text = await chunk();
  let metadata = [{"name":"archivo"}]
  let embedding = new GoogleGenerativeAIEmbeddings({apiKey: "AIzaSyA1KvMEhxY5fk0ObK9_OYNC0ZxgKfYLj5A",modelName: "embedding-001"});
  console.log(text);
  let vector_store = await FaissStore.fromTexts(text,metadata,embedding)
  return await vector_store.save("faiss_index")
}
get_vector_store()

