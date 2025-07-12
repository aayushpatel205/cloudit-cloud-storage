import ImageKit from "imagekit";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

console.log("Next public key: ", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);

export const handleUpload = async (file, fileName, fileTag) => {
  try {
    const authRes = await axios.get("/api/imagekit-auth");
    const auth = await authRes.data;

    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      authenticationEndpoint: "/api/imagekit-auth",
    });

    const result = await imagekit.upload({
      file: file,
      fileName: fileName,
      tags: [fileTag],
      signature: auth.signature,
      expire: auth.expire,
      token: auth.token,
    });
    return result.url;
  } catch (error) {
    throw error;
  }
};
