import ImageKit from "imagekit";
import dotenv from "dotenv";
import { toast } from "react-toastify";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

export const handleUpload = async (file, fileName, fileTag) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      tags: [fileTag],
    });

    return result.url;
  } catch (error) {
    throw error;
  }
};
