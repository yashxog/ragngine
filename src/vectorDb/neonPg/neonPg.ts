// import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { BaseVectorDb, EmbeddingsInstance } from "../../interfaces/interface";
import { initializeNeonDb } from "./neonRetry";
import { OpenAIEmbeddings } from "@langchain/openai";
import { openAIEmbeddingInit } from "../../embeddings/openai/openaiEmbeding.js";
import { Url } from "url";


// export class NeonPGVectorDb {
//     private config: BaseVectorDb;
//     private vectorDb: NeonPostgres;

//     constructor(config: BaseVectorDb) {
//         this.config = config;

//         const connectionString = config.connectionString || process.env.DB_URL;

//         if(!connectionString) {
//             throw new Error("Dabtabase Connenction Url Required");
//         }
//         const embedding = new OpenAIEmbeddings({
//             apiKey: config.embedding.apiKey,
//             modelName: config.embedding.modelName,
//         })
//         this.vectorDb = new NeonPostgres({
//             embedding,
//             {
//             connectionString: config.connectionString,
//             tableName: config.tableName || "ragngine_vector_db"
//             }
//         })
//     }  

//     async createVectorDb() {
//         try {
//             const embeddingConfig = this.config.embedding;
//             const embeddings = await openAIEmbeddingInit(embeddingConfig);
//             this.vectorDb = await initializeNeonDb(embeddings, this.config.tableName, this.config.connectionString);
//             console.log("Neon Connection established successfully");
//             return this.vectorDb;
//         } catch (error) {

//             throw new Error(`Neon Postgres vector Db initilization failed: ${error.message}`);
//         }
//     }       
// };

/**
 * Initializes a Neon Postgres vector database connection for storing and querying embeddings.
 * This function establishes a connection to the database,creates table if not present, initializes the vector database,
 * and returns the vector database instance.
 *
 * @param embedding - The embeddings instance that will be used for embedding documents before storing them in the database.
 * @param dbUrl - The URL of the database connection. If not provided, it will use the environment variable `dbUrl`.
 * @param tableName - The name of the table to store embeddings. Defaults to `"rag_embedding_table"` if not provided.
 *
 * @returns A Promise that resolves to the initialized vector database instance.
 * 
 * @throws Error if the database connection URL is not provided or if the initialization of the database fails.
 */
export async function  NeonPostgres({embedding, dbUrl, tableName = "rag_embedding_table"}:{embedding: EmbeddingsInstance, dbUrl?: string, tableName?: string}) {
    try {
        const databaseConnection = dbUrl || process.env.DATABASE_URL;
        if(!databaseConnection){
            throw new Error("Dabtabase Connenction Url Required");
        }
        const vectorDb = await initializeNeonDb(embedding, tableName, databaseConnection);
        return vectorDb;
    } catch (error) {
        throw new Error(`Neon Postgres vector Db initilization failed: ${error.message}`);
    }
}