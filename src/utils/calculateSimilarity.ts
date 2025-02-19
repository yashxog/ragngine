import dot from "compute-dot";
import cosineSimilarity from "compute-cosine-similarity";
import { RerankMethods } from "../interfaces/interface";


/**
 * Calculates the similarity between a document embedding and a query embedding using a specified similarity measure.
 * 
 * This function supports two types of similarity measures: cosine similarity and dot product similarity. 
 * Based on the `rerank` parameter, it will choose the appropriate method to calculate the similarity score.
 * 
 * @param docEmbedding - The embedding vector representing the document. This is a list of numbers generated from the document content.
 * @param queryEmbedding - The embedding vector representing the query. This is a list of numbers generated from the query text.
 * @param rerank - The similarity measure to use for ranking the documents. Can be either "cosine" or "dot".
 * 
 * @returns A similarity score between the document and the query embedding. The score can be a value between -1 and 1 for cosine similarity, and a real number for dot product similarity.
 * 
 * @throws Error if an invalid similarity measure is provided (other than "cosine" or "dot").
 */
export default function calulateSimilarity(docEmbedding:number[], queryEmbedding:number[], rerank:RerankMethods) {

    if(rerank === "cosine"){
        return cosineSimilarity(docEmbedding, queryEmbedding)
    } else if(rerank === "dot"){
        return dot(docEmbedding, queryEmbedding)
    }else{
        throw new Error("Invalid Similarity Measure")
    }
}