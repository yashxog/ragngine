import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { OpenAIEmbeddings } from "@langchain/openai";


/**
 * Initializes a connection to the Neon Postgres vector database with retry logic.
 * This function attempts to establish a connection to the database up to 5 times in case of failure,
 * with a 2-second delay between retries.
 * 
 * @param embeddings - The embeddings instance to be used for generating document embeddings.
 * @param tableName - The name of the table where embeddings will be stored in the Neon Postgres database.
 * @param connectionString - The connection string used to connect to the Neon Postgres database.
 * 
 * @returns A Promise that resolves to the Neon Postgres database connection instance once successfully connected.
 * 
 * @throws Error if the database connection fails after 5 retry attempts.
 */
export const initializeNeonDb = async (embeddings: OpenAIEmbeddings, tableName: string, connectionString: string) => {
    let retry = 1;
    while (retry <= 5) {
        try {
            const DbConnection = await NeonPostgres.initialize(
                embeddings,
                {
                    connectionString,
                    tableName,
                }
            )
            console.log("DB connection established successfully");
            return DbConnection;
        } catch (error) {
            retry++;

            if (retry > 5) {
                console.log("Error while connecting to Neon Database connection timeout: ", error);
                throw error;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    if(retry  > 5) {
        console.error("Max Retries Reached, DB Connection Failed")
        return null;
    }
}