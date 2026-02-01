import ImageKit from "imagekit";
import dotenv from "dotenv";
import { toast } from "react-toastify";
import sharp from "sharp";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

export const handleUpload = async (file, fileName, fileTag) => {
  try {
    // original buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 🔽 image compression logic added
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true }) // optional resize
      .jpeg({ quality: 70 }) // compression quality
      .toBuffer();

    const result = await imagekit.upload({
      file: compressedBuffer, // upload compressed image
      fileName: fileName,
      tags: [fileTag],
    });

    return result.url;
  } catch (error) {
    throw error;
  }
};
