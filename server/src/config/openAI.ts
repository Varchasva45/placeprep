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
