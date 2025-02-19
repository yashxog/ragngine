// /need to be removed
import { EmbeddingNgine } from "./embeddings/universalEmbedding"
import { BaseEmbeddings, BaseLLM, BaseVectorDb, RagQuery } from "./interfaces/interface"
import { RagNgine } from "./rag/ragNgine"
import { NeonPostgres } from "./vectorDb/neonPg/neonPg"
import { OpenAIEmbedding, openAIEmbeddingInit } from "./embeddings/openai/openaiEmbeding";
import { openAILLMInit, OpneAILLM } from "./llms/opneai/openaiLLM";

const test = new EmbeddingNgine({
    provider: "openai",
    modelName: "text-embedding-3-small",
    apiKey: "OPEN_AI_API_KEY"
})

test.createDocumentEmbedding({
    documentUrl: "./testingFiles/textfile.txt",
    chunkSize:400,
    chunkOverlap: 50
})
// // // //

const embedding: BaseEmbeddings = {
    provider: "openai",
    modelName: "text-embedding-3-small",
    apiKey: "OPEN_AI_API_KEY"
}

const vecctorDb: BaseVectorDb = {
    dbProvider: "neonPg",
    connectionString: "NEON_PG_URL",
    tableName: "test_document_rag",
    embedding
}

const llm: BaseLLM = {
    provider: "openai",
    modelName: "gpt-3.5-turbo",
    apiKey: "OPEN_AI_API_KEY"
}

const document = {
    documentUrl: "./testingFiles/textfile.txt",
    chunkSize:400,
    chunkOverlap: 50
}

const queryConfig = {
    query: "what is data mining"
}

// Improvements -> New Improved code should be able to uuse in following way.
async function  runRAG( ){

console.log("INTO RAG FUNCTION")
const oe =  openAIEmbeddingInit(embedding);
const vs =  await NeonPostgres(
    {
        embedding: oe,
        dbUrl: "NEON_PG_URL",
        tableName: "test_rag_1"
     });
const lm =  openAILLMInit(llm);

const rag = new RagNgine(oe, vs, lm);

// const response = rag.createDocumentRag(document);
const response =  await rag.queryRagModel(queryConfig);
}

runRAG();