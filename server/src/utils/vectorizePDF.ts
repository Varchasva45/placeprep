import { embeddings } from "../config/openAI";
import { pinecone } from "../config/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

type vectorizePDFProps = {
  fileUrl: string;
  fileKey: string;
};

export const vectorizePinconePDF = async ({
  fileUrl,
  fileKey,
}: vectorizePDFProps) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    const pineconeIndex = pinecone.Index("placeprep");

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
      namespace: fileKey,
    });

    return { success: true, message: "PDF vectorized successfully" };
  } catch (error) {
    console.log("error in vectorizing PDF: ", error);
    return { success: false, message: "Error in vectorizing PDF" };
  }
};
