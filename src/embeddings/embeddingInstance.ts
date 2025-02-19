import { BaseEmbeddings } from "../interfaces/interface";
import { openAIEmbeddingInit } from "./openai/openaiEmbeding";


// NEED TO REMOVE

/* This function takes the provider and inatialised the Embedding provider*/
export async function embeddingInstance(embeddings: BaseEmbeddings) {
    try {
        switch (embeddings.provider.toLowerCase()) {
            case "openai": {
                const embeding = await openAIEmbeddingInit(embeddings);
                return embeding;
                break;
            }
            default:
                throw new Error(`Embedding provider ${embeddings.provider} not supported`);
    
        }   
    } catch (error) {
        throw new Error(`Error while inatialising the embedding model: , ${error}`);
    }
}