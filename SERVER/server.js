import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});

let vectorStore;

async function loadVectorStore() {
    vectorStore = await FaissStore.load("vectordatabase", embeddings);
    console.log("Vector store loaded.");
}
await loadVectorStore();

const messages = [
    ["system", `You are a host for a gaming related quiz. You ask the user 5 questions in total and give them 4 options 
        (A, B, C or D). Only one of the options is the correct answer, with the other 3 being false. After the 
        user chooses an answer, you give them another question. Give the user the freedom to choose whichever game
        he wants a do a quiz about. Give the user a score at the end of the quiz.`],
    ["ai", "Question 1: which game is made by Nintendo? A: Astrobot. B: Celeste. C: Super Mario Brothers 3. D: Terraria"],
    ["human", "C"]
]

const model = new AzureChatOpenAI({ 
    temperature: 1 
});

app.post("/ask", async (req, res)=> {
    let prompt = req.body.prompt
    let endresult = ""
    messages.push(["human", prompt]);

    const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");
    messages.push(["system", `Here is some additional information you can use to answer: \n${context}`]);

    const stream = await model.stream(messages);
    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of stream) {
        endresult += chunk.content
        res.write(chunk.content);
    }

    res.end();
    messages.push(["ai", endresult]);
});

app.listen(3000, () => console.log(`Server running on http://localhost:3000`))
