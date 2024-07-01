import { S3 } from "@aws-sdk/client-s3";

const accessKeyId = import.meta.env.VITE_S3_ACCESS_KEY;
const secretAccessKey = import.meta.env.VITE_S3_SECRET_ACCESS_KEY;
const region = import.meta.env.VITE_S3_REGION;
const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;

const s3 = new S3({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export async function uploadToS3(
  file: File,
): Promise<{ file_key: string; file_name: string }> {
  try {
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: bucketName,
      Key: file_key,
      Body: file,
    };

    await s3.putObject(params);
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
