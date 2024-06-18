import OpenAI from "openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
  apiKey: "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",
});

export const embeddings = new OpenAIEmbeddings({
  apiKey: "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",
});
