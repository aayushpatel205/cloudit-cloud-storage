import axios from "axios";

export const fetchUserFiles = async ({ userId, parentId, mode }) => {
  if (!userId) return [];

  if (mode === "starred") {
    const res = await axios.get("/api/files/starred", { params: { userId } });
    return res.data.files;
  }

  if (mode === "trash") {
    const res = await axios.get("/api/files/trash", { params: { userId } });
    return res.data.files;
  }

  const [filesRes, foldersRes] = await Promise.all([
    axios.get("/api/files", { params: { userId, parentId } }),
    axios.get("/api/folders", { params: { userId, parentId } }),
  ]);

  return [...filesRes.data.userFiles, ...foldersRes.data.userFolders];
};
