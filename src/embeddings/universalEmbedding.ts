import { BaseEmbeddings, DocumentEmbedding, RagQuery } from "../interfaces/interface";
import { OpenAIEmbedding, openAIEmbeddingInit } from "./openai/openaiEmbeding";
import { embeddingInstance } from "./embeddingInstance";
import { DocumentInterface } from "@langchain/core/documents";
import computeSimilarity from "../utils/calculateSimilarity";

// NEED TO REMOVE

export class EmbeddingNgine {
    private config: BaseEmbeddings;
    private embedding: OpenAIEmbedding;

    constructor(config: BaseEmbeddings) {
        this.config = config;

        this.validateInput(config);
        
        const provider = this.config.provider;

        switch (provider.toLowerCase()) {
            case "openai":
                this.embedding =  new OpenAIEmbedding(config);
                break;
            default:
                throw new Error(`Embedding model provider ${provider} not supported`)
        }
    }

    validateInput(config: BaseEmbeddings) {

        if(!config.modelName || !config.provider) {
            throw new Error("please provide embedding model and provider");
        }

        if(config.modelName !== "text-embedding-3-small" && config.modelName !== "text-embedding-3-large" ) {
            throw new Error(`Embedding model ${config.modelName} are not supported`);
        }
    }

    async createDocumentEmbedding(splittingConfig: DocumentEmbedding) {
        try {
            const embedding = await this.embedding.documentEmbedding(splittingConfig);
            return embedding;
        } catch (error) {
            throw new Error(`Embedding model creation failed: ${error}`)
        }
    }

    /* This Method initializes embedding model according to provider */
    async initRagEmbedding() {
        try {
            const embeddingProvider = this.config;
            const embeddingInit = await embeddingInstance(embeddingProvider);
            return embeddingInit
        } catch (error) {
            throw new Error(`Error occured while initilazing Embedding model for creating Rag: ,${error}`);
        }
    }

    /* This Method is used to find the similarity between docs and query and rank docs on the basis of similarity*/
    async rerankData({queryConfig, documents}:{queryConfig: RagQuery, documents: DocumentInterface<Record<string, any>>[]}){
        try {
            const embeddingProvider = this.config;
            const embeddingInit = await embeddingInstance(embeddingProvider);

            const [docsEmbedding, queryEmbedding] = await Promise.all([
                embeddingInit.embedDocuments(documents.map((doc)=> doc.pageContent)),
                embeddingInit.embedQuery(queryConfig.query)
            ])

            const similarity = docsEmbedding.map((documenEmbedding, i) => {
                const score = computeSimilarity(documenEmbedding, queryEmbedding, queryConfig.rerank);

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
            console.error(error);
        }
    }
}