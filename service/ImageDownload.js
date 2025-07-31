import { saveAs } from "file-saver";

export const downloadImage = async (imageUrl, filename) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    throw error;
  }
};
