import { EmbeddingsInstance, RagQuery } from "../interfaces/interface";
import { DocumentInterface } from "@langchain/core/documents";
import calulateSimilarity from "../utils/calculateSimilarity";


/**
 * Re-ranks a list of documents based on their similarity to a given query.
 * 
 * This function calculates embeddings for both the query and documents, then re-ranks the documents based on their
 * similarity score to the query. It uses a specified similarity measure (e.g., "dot" or "cosine") for ranking the documents.
 * Only documents with a similarity score above a threshold are considered, and the top `topK` documents are returned.
 * 
 * @param queryConfig - The configuration for the query, including the query string, rerank method, and number of top documents to retrieve.
 * @param documents - The list of documents to be ranked, where each document contains the `pageContent` to be embedded and compared.
 * @param embeddings - The embeddings instance used to generate embeddings for both documents and the query.
 * 
 * @returns A list of documents that are ranked based on their similarity to the query. Only the top `topK` documents with the highest similarity scores are returned.
 * 
 * @example
 * const queryConfig: RagQuery = { query: "What is the capital of France?", rerank: "cosine", topK: 5 };
 * const documents: DocumentInterface[] = [{ pageContent: "The capital of France is Paris." }, { pageContent: "Berlin is the capital of Germany." }];
 */
export async function RerankDocuments(queryConfig: RagQuery, documents: DocumentInterface<Record<string, any>>[], embeddings: EmbeddingsInstance) {
    try {
            const [docsEmbedding, queryEmbedding] = await Promise.all([
                embeddings.embedDocuments(documents.map((doc)=> doc.pageContent)),
                embeddings.embedQuery(queryConfig.query)
            ])

            const similarity = docsEmbedding.map((documenEmbedding, i) => {
                const score = calulateSimilarity(documenEmbedding, queryEmbedding, queryConfig.rerank);

                return({
                    index: i,
                    similarityScore: score
                })
            });
            
            const sortedDocs = similarity.
            filter((similarity) => similarity.similarityScore > 0.3).
            sort((a,b) => b.similarityScore - a.similarityScore).
            slice(0, queryConfig.topK).
            map((similarity) => documents[similarity.index])
            
            return sortedDocs;
    } catch (error) {
        console.error(error)
    }
}