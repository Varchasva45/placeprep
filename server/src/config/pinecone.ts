import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

export const pinecone = new Pinecone({
  apiKey: "d99df904-f8d7-4825-bc82-2db1726bcff6",
});
