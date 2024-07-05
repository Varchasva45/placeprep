import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.PINECONE_APIKEY || "";

export const pinecone = new Pinecone({
  apiKey,
});
