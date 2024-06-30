import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "",
});

export const embeddings = new OpenAIEmbeddings({
  apiKey: "",
});
