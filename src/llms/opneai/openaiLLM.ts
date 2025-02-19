import { BaseLLM } from "../../interfaces/interface";
import {ChatOpenAI} from "@langchain/openai";

// NEED TO CHECK
export class OpneAILLM {
    private config: BaseLLM;
    private llm: ChatOpenAI;

    constructor(config: BaseLLM) {
        this.config = config;

        const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        
        if(!apiKey) {
            throw new Error("Open AI API key required");
        }
        this.llm = new ChatOpenAI({
            model: this.config.modelName,
            apiKey: this.config.apiKey,
            maxTokens: this.config.maxTokens || null,
            topP: this.config.topP || null,
            temperature: this.config.temprature || null,
        })
    }

    run() {
        try {
            // WIP
        } catch (error) {
            console.log(`Failed to get response from Open AI LLM: `, error);
            throw new Error(`Failed to get response from Open AI LLM: ${error}`);
        }
    }

    /* This Method initialize ChatOpenAI and returns the initalize llm */
    async initOpenAILLM() {
        try {
            const llm = new ChatOpenAI({
                model: this.config.modelName,
                apiKey: this.config.apiKey,
                maxTokens: this.config.maxTokens || null,
                topP: this.config.topP || null,
                temperature: this.config.temprature || null,
            });
            return llm;
        } catch (error) {
            throw new Error(`error occured while initalizing opnen ai llm: ${error}`);
        }
    }
}

/**
 * Initializes an instance of an OpenAI language model (LLM) using the provided configuration.
 * This function creates an instance of `ChatOpenAI` with the specified parameters.
 *
 * @param {BaseLLM} llmConfig - The configuration object for initializing the LLM.
 * @param {string} llmConfig.modelName - The name of the model to be used (e.g., "gpt-3.5-turbo").
 * @param {string} [llmConfig.apiKey] - The API key for authenticating with OpenAI. Defaults to the key set in the environment if not provided.
 * @param {number} [llmConfig.maxTokens] - Optional. The maximum number of tokens to include in the response.
 * @param {number} [llmConfig.topP] - Optional. Controls nucleus sampling; specifies the cumulative probability threshold for token selection.
 * @param {number} [llmConfig.temprature] - Optional. Determines the randomness of the output; higher values result in more random responses.
 *
 * @returns {ChatOpenAI} An instance of the `ChatOpenAI` model initialized with the provided configuration.
 */
export const openAILLMInit = (llmConfig: BaseLLM) => {
    const llm = new ChatOpenAI({
        model: llmConfig.modelName,
        apiKey: llmConfig.apiKey,
        maxTokens: llmConfig.maxTokens || null,
        topP: llmConfig.topP || null,
        temperature: llmConfig.temprature || null,
    })
    return llm;
}