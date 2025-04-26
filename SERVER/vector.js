import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from 'dotenv';
dotenv.config();

const model = new AzureChatOpenAI({ temperature: 1 });

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore;

async function createVectorStore() {
    const loader = new TextLoader("../celestescript.txt");
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`Document split into ${splitDocs.length} chunks. Now saving into vector store`);

    vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("vectordatabase");
    console.log("Vector store saved.");
}

await createVectorStore();
