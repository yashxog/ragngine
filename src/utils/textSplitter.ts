import { RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import path from 'path';
import pdfParse from 'pdf-parse';
import * as fs from 'fs';


/**
 * Splits a document into smaller chunks based on the specified chunk size and overlap.
 * The function supports PDF and text files, and will process them accordingly.
 * 
 * @param documentUrl - The URL or file path of the document to be split. 
 * The document should be either a PDF or a text file (`.txt`).
 * @param chunkSize - The maximum size of each chunk (in number of characters). Default is 400.
 * @param chunkOverlap - The number of characters that should overlap between consecutive chunks. Default is 50.
 * 
 * @returns A Promise that resolves to an array of chunks, where each chunk is a part of the document. 
 * If the document type is not supported (not a PDF or text file), the function will return `null`.
 * 
 * @throws Error if the document URL is not provided or if there is an error while splitting the document.
 */
export async function splitDocumnet(documentUrl: string, chunkSize: number = 400, chunkOverlap: number = 50) {
    try {
        if(!documentUrl) {
            throw new Error("Please Provide document to generate chunks");
        }

        const type = path.extname(documentUrl).toLowerCase();

        switch(type) {
            case ".pdf":
                return await pdfSplitter(documentUrl, chunkSize, chunkOverlap);
            case ".txt":
                return await textSplitter(documentUrl, chunkSize, chunkOverlap);
            default:
                return null;
        }
            
        
    } catch (error) {
        throw new Error(`Error occured while splitting text: ${error}`);
    }
}


/**
 * Splits a PDF document into smaller chunks of text, based on the provided chunk size and overlap.
 * This function retrieves the text content from a PDF file and splits it using a character-based 
 * text splitter, which divides the content into manageable chunks.
 * 
 * @param documentUrl - The URL or file path of the PDF document to be split.
 * @param chunkSize - The maximum size of each chunk (in number of characters).
 * @param chunkOverlap - The number of characters that should overlap between consecutive chunks.
 * 
 * @returns A Promise that resolves to an array of text chunks extracted from the PDF document.
 * 
 * @throws Error if there is a problem fetching the PDF text or during the splitting process.
 */
async function pdfSplitter( documentUrl: string, chunkSize: number, chunkOverlap: number ) {
    try {
        const text = (await getPdfText(documentUrl)).toString();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
            separators: ['\n\n']
        })

        const chunks = await splitter.createDocuments([text]);

        return chunks;
    } catch (error) {
        console.log('Error during PDF splitting:', error);
        throw new Error('Failed to split PDF into chunks');
    }
}


/**
 * Splits a plain text document into smaller chunks of text, based on the provided chunk size and overlap.
 * This function reads a plain text file and splits its content into chunks, using a character-based text splitter.
 * The text is divided into chunks using specified separators, which allows for chunking based on paragraph breaks or lines.
 * 
 * @param documentUrl - The file path of the plain text document to be split.
 * @param chunkSize - The maximum size of each chunk (in number of characters).
 * @param chunkOverlap - The number of characters that should overlap between consecutive chunks.
 * 
 * @returns A Promise that resolves to an array of text chunks extracted from the plain text document.
 * 
 * @throws Error if there is an issue reading the text file or during the splitting process.
 */
async function textSplitter( documentUrl: string, chunkSize: number, chunkOverlap: number ) {
    try {
        const text = (fs.readFileSync(documentUrl)).toString();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
            separators: ['\n\n', '\n']
        });

        const chunks = splitter.createDocuments([text]);

        return chunks;
    } catch (error) {
        console.log('Error during text splitting:', error);
        throw new Error('Failed to split text into chunks');
    }
}


/**
 * Extracts text from a PDF document located at the specified file path.
 * This function reads a PDF file, parses it, and returns the extracted text content.
 * 
 * @param documentUrl - The file path of the PDF document to extract text from.
 * 
 * @returns A Promise that resolves to the extracted text from the PDF document.
 * 
 * @throws Error if there is an issue reading the PDF file or parsing its content.
 */
async function getPdfText( documentUrl: string ) {
    try {
        const dataBuffer = fs.readFileSync(documentUrl);
        const pdfData = await pdfParse(dataBuffer);
        console.log("PDF DATA: ", pdfData.text);
        return pdfData.text;
    } catch (error) {
        throw new Error(`Error occured while converting PDF to text: ${error}`);
    };
}