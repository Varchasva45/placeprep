import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_APIKEY;

export const openai = new OpenAI({
  apiKey,
});
export const openai2 = new OpenAI({
  baseURL: 'https://api.deepinfra.com/v1/openai',
  apiKey: 'dxo7YtTnI3CltQC7sarQuni4yNNVUv84',
});

export const embeddings = new OpenAIEmbeddings({
  apiKey
});
