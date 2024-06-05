import { S3 } from "@aws-sdk/client-s3";

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_AWS_REGION;
const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;

const s3 = new S3({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export async function uploadToS3(file: File): Promise<{ file_key: string; file_name: string }> {
  try {
    const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: bucketName,
      Key: file_key,
      Body: file,
    };

    await s3.putObject(params)
    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}

// import fs from "fs";
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
// import { Pinecone } from '@pinecone-database/pinecone';
// export const pinecone = new Pinecone({
//  
// });

// export async function indexSavedFile({ fileUrl, fileId} : { fileUrl: string; fileId: string}) {
//   // indexing and vecctorising the file and storing it in pinecone
//   try {
//     const response = await fetch(fileUrl);
//     const blob = await response.blob();
//     const loader = new PDFLoader(blob);
//     const pageLevelDocs = await loader.load();
//     const pineconeIndex = pinecone.Index('placeprep');
//     const embeddings = new OpenAIEmbeddings({
//     
//     });  
//     await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {pineconeIndex, namespace: fileId});
//   } catch (error) {
//     console.log(error);
//   }
// }
