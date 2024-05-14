const { GoogleGenerativeAI }= require("@google/generative-ai");
const os = require("node:os")
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts")
const { loadQAStuffChain } = require("langchain/chains")
const { FaissStore } = require("@langchain/community/vectorstores/faiss")
const { chunk } = require("./pdf-extrac")
const { argv } = require("node:process")

const get_vector_store = async () => {
  let text = await chunk();
  let metadata = [{"name":"archivo"}]
  let embedding = new GoogleGenerativeAIEmbeddings({apiKey: "AIzaSyA1KvMEhxY5fk0ObK9_OYNC0ZxgKfYLj5A",modelName: "embedding-001"});;
  let vector_store = await FaissStore.fromTexts(text,metadata,embedding)
  return await vector_store.save("faiss_index")
}
const conversational_chain = async () =>{

  const prompt_template = `
  Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
  provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
  Context:\n {context}?\n
  Question: \n{question}\n
  Answer:
  `
  const model = new ChatGoogleGenerativeAI({apiKey: "AIzaSyA1KvMEhxY5fk0ObK9_OYNC0ZxgKfYLj5A",emperature: 0.3,modelName: "gemini-pro"})
  
  const prompt = new PromptTemplate({inputVariables:["context", "question"],template:prompt_template})
  const chain = loadQAStuffChain(llm=model,params=prompt)

  return chain
}

const user_input = async (user_question) =>{
  const embeddings = new GoogleGenerativeAIEmbeddings({apiKey: "AIzaSyA1KvMEhxY5fk0ObK9_OYNC0ZxgKfYLj5A",modelName: "embedding-001"})
  const new_db = await FaissStore.load("faiss_index", embeddings)
  const docs = await new_db.similaritySearch(user_question)
  const chain = await conversational_chain()
  
  const response = chain.prepOutputs({inputs:docs, outputs:user_question , returnOnlyOutputs:true})
  console.log(response)
  console.log("Reply: ", response["output_text"])
}

const main = () =>{
  console.log("Chat with PDF using Gemini")
  user_question = argv
  if (user_question){
      user_input(user_question[2])
    }
  }
  main()