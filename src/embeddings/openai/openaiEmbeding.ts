import { OpenAIEmbeddings } from "@langchain/openai";
import { BaseEmbeddings, DocumentEmbedding } from "../../interfaces/interface";
import { splitDocumnet } from "../../utils/textSplitter";

/**
 * Class to handle the creation of embeddings using OpenAI's embedding service from langchain.
 * This class encapsulates the logic for configuring the OpenAI API key, model, and document splitting
 * for embedding generation.
 */

export class OpenAIEmbedding {

    private config: BaseEmbeddings;
    private embedding: OpenAIEmbeddings;


  /**
   * Constructor initializes the OpenAIEmbedding instance with the given configuration.
   * @param {BaseEmbeddings} config - The configuration object for the embedding.
   * @throws {Error} Throws an error if the OpenAI API key is not provided.
   */

    constructor(config: BaseEmbeddings) {
        this.config = config;

        const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            throw new Error("Open AI API key required");
        }

        this.embedding = new OpenAIEmbeddings({
            openAIApiKey: apiKey,
            modelName: this.config.modelName
        })
    }


  /**
   * Method to generate embeddings for a document by splitting it into chunks and processing each chunk.
   * @param {DocumentEmbedding} splittingConfig - Configuration for document splitting and embedding generation.
   * @param {string} splittingConfig.documentUrl - The URL of the document to process.
   * @param {number} [splittingConfig.chunkSize=400] - The size of each chunk (number of characters) set default to 400.
   * @param {number} [splittingConfig.chunkOverlap=50] - The overlap between consecutive chunks set default to 50.
   * @returns {Promise<number[][]>} A promise that resolves to an array of embeddings for the document chunks.
   * @throws {Error} Throws an error if there is an issue during the embedding generation process.
   */

    async documentEmbedding(splittingConfig: DocumentEmbedding) {
        try {
            const chunkOverlap = splittingConfig.chunkOverlap ?? 50;
            const chunkSize = splittingConfig.chunkSize ?? 400

            const splitedDoc = await splitDocumnet(splittingConfig.documentUrl, chunkSize, chunkOverlap);

            const embedding = await Promise.all(splitedDoc.map((chunk) => this.embedding.embedDocuments([chunk.pageContent])));

            return embedding;
        } catch (error) {
            throw new Error("Error occured while generating embeddings for document");
        }
    }
}

/**
 * Initializes and returns an OpenAIEmbeddings instance using the LangChain library.
 * 
 * @param {BaseEmbeddings} config - The configuration object required to initialize the OpenAI embedding.
 * @param {string} config.apiKey - The OpenAI API key for authentication.
 * @param {"text-embedding-3-small" | "text-embedding-3-large"} config.modelName - The name of the OpenAI embedding model to use.
 * 
 * @returns {OpenAIEmbeddings} An instance of OpenAIEmbeddings configured with the provided API key and model name.
 */

export const openAIEmbeddingInit = (config: BaseEmbeddings)=> {
    const embedding = new OpenAIEmbeddings({
        openAIApiKey: config.apiKey || process.env.OPENAI_API_KEY,
        modelName: config.modelName,
    })
    return embedding;
}