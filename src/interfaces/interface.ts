import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { DocumentInterface } from "@langchain/core/documents";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

/**
 * Interface to define the base configuration for initializing any Language Learning Model (LLM).
 * Currently supports OpenAI as the provider, with plans to add support for additional providers in the future.
 */
export interface BaseLLM {
  /**
   * The provider for the LLM service.
   * Currently supports only "openai".
   */
    provider: "openai";

  /**
   * The name of the LLM model to use.
   * Example: "gpt-3.5-turbo" or "gpt-4".
   */
    modelName: string;

  /**
   * Optional API key for authenticating with the LLM provider.
   * If not provided, a default key or environment variable may be used.
   */
    apiKey?: string;

  /**
   * Optional temperature setting for controlling the randomness of the model's output.
   * Values range from 0 to 1, where higher values result in more creative and random responses.
   * Default: 0.7.
   */
    temprature?: number;

  /**
   * Optional maximum number of tokens for the model's response.
   * Determines the length of the output.
   * Example: 1000.
   */
    maxTokens?: number;

  /**
   * Optional top-p value for nucleus sampling.
   * Controls the diversity of the model's output by choosing tokens from the top probability mass.
   * Values range from 0 to 1.
   */
    topP?: number;

  /**
   * Optional top-k value for determining the number of documents or items to use during generation.
   * For example, if 100 similar documents are retrieved, and `topK` is set to 20, only the top 20
   * documents will be used for the generation process.
   * Default: 20.
   */
    topK?: number;
};


/**
 * Type definition for the instance of an LLM model.
 * Represents the specific LLM model used in the application.
 */
export type LLMInstance = ChatOpenAI;



/**
 * Interface defining the configuration for creating embeddings using a provider.
 * Currently supports OpenAI as the provider.
 */
export interface BaseEmbeddings {
  
  /**
   * The provider for generating embeddings.
   * Currently limited to "openai".
   */
    provider: "openai";

  /**
   * The name of the embedding model to use.
   * Available options:
   * - "text-embedding-3-small": Suitable for smaller, faster embedding tasks.
   * - "text-embedding-3-large": Suitable for larger, more complex embedding tasks requiring higher accuracy.
   */
    modelName: "text-embedding-3-small" | "text-embedding-3-large";

  /**
   * Optional API key for authenticating with the embedding service provider.
   * If not provided, the default API key from environment variables will be used.
   */
    apiKey?: string;
};


/**
 * Interface defining the configuration for creating embeddings from a document.
 * Allows specifying document location and optional chunking strategy for processing large documents.
 */
export interface DocumentEmbedding {
  
  /**
   * The URL or file path of the document to generate embeddings for.
   * Example: "https://example.com/document.pdf" or "./local-document.txt".
   */
    documentUrl: string;

    // chunkingStra

  /**
   * Optional size of the chunks the document should be split into, in terms of characters.
   * Used to process large documents by dividing them into smaller parts for embedding generation.
   * Default: 400.
   */
    chunkSize?: number;

  /**
   * Optional overlap size between consecutive chunks, in terms of characters.
   * Helps maintain context continuity between chunks during embedding generation.
   * Default: 50.
   */
    chunkOverlap?: number;
}


/**
 * Type definition for the instance of an embeddings model.
 * Represents the specific embeddings model used in the application.
 */
export type EmbeddingsInstance = OpenAIEmbeddings;


/**
 * Interface for configuring and initializing a Vector Database (VectorDB).
 * Defines the database provider, connection details, table information, and optional embedding configuration.
 */
export interface BaseVectorDb {
  
  /**
   * The provider for the Vector Database.
   * Currently supports "neonPg" (Neon Postgres).
   */
    dbProvider: "neonPg";

  /**
   * The connection string used to connect to the Vector Database.
   * Example: "postgresql://user:password@host:port/database".
   */
    connectionString: string;

  /**
   * The name of the table in the Vector Database where data will be stored.
   * Example: "embeddings_table".
   */
    tableName: string;

  /**
   * Optional embedding configuration to define the model used for generating embeddings.
   * Based on the `BaseEmbeddings` interface, which allows specifying the embedding provider, model, and API key.
   */
    embedding?: BaseEmbeddings
}


/**
 * Type definition for the instance of a Vector Database (VectorDB).
 * Represents the specific database instance used for storing and retrieving vectorized data.
 */
export type VectorDbInstacne = NeonPostgres;


/**
 * Interface for querying a Retrieval-Augmented Generation (RAG) system.
 * Defines the structure for a query, including options for filtering and reranking results.
 */
export interface RagQuery {
    query: string;

  /**
   * Optional number of top documents or items to retrieve from the system.
   * Specifies how many of the most relevant results should be considered.
   * Default: 10.
   */
    topK?: number;

  /**  
   * Optional reranking method to refine the retrieved results.
   * Represents the name of the reranking strategy or model to apply.
   * Example: "dot" or "cosine".
   * Default: cosine
   */
    rerank?: RerankMethods
}

/**
 * Type representing the available RAG pipelines that can be used.
 * 
 * Currently, only the "naiveRag" pipeline is available. This can be expanded in the future to include
 * other pipelines as needed.
 * 
 */
export type RagPipeline = "naiveRag"


/**
 * Type representing the available methods for reranking retrieved documents in a RAG pipeline.
 * 
 * The valid options are "dot" for dot product-based reranking and "cosine" for cosine similarity-based reranking.
 */
export type RerankMethods = "dot" | "cosine"


/**
 * Interface for defining the input configuration of a Retrieval-Augmented Generation (RAG) pipeline.
 * Specifies the query, retrieval, reranking options, document content, and models used in the pipeline.
 */
export interface RagPiplineInput {
    query: string,
    topK: number,
    rerank: RerankMethods,
    docContent: DocumentInterface<Record<string, any>>[],
    ragPipeline: RagPipeline,
    embeddings: EmbeddingsInstance,
    llm: LLMInstance
}

