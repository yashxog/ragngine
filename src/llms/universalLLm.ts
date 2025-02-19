import { BaseLLM } from "../interfaces/interface";
import { OpneAILLM } from "./opneai/openaiLLM";

// NEED TO CHECK
export class LLMNgine {
    private config: BaseLLM;  

    constructor(config: BaseLLM) {
        this.config = config;
    }

    create() {
        try {
            const provider = this.config?.provider;

            if(!provider) {
                throw new Error("LLM Model Provider required");
            }

            switch(provider) {
                case "openai": 
                    return new OpneAILLM(this.config);
                    break;
                default: 
                    throw new Error(`Unsupported model provider: ${provider}`);
            }
        } catch (error) {
            throw new Error(`LLM creation failure: ${error}`)
        }
    }

    /* this Method initalizes RAG according to LLM provider */
    async initRagLLM() {
        try {
            const llmProvider = this.config.provider;

            switch(llmProvider) {
                case "openai": {
                    const llm = new OpneAILLM(this.config)
                    return llm.initOpenAILLM();
                }
                default : {
                    throw new Error(`LLm provider ${llmProvider} not supported`);
                }
            }
        } catch (error) {
            throw new Error(`Error occured while initalizing LLM fro RAG: ${error}`);
        }
    }
}