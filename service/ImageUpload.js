// ✅ Correct SDK for server use
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config(); // Only required if you're not using Next.js built-in env support

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
});

// ✅ Server-compatible upload function
export const handleUpload = async (file, fileName, fileTag) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await imagekit.upload({
      file: buffer, // ✅ Buffer or base64
      fileName: fileName,
      tags: [fileTag],
    });

    return result.url;
  } catch (error) {
    console.error("Server ImageKit Upload Error:", error);
    throw error;
  }
};
