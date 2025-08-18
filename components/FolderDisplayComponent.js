"use client";
import React, { useState } from "react";
import { FaFolder, FaFolderPlus, FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useFileContext } from "@/context/FileContext";
import { IoIosCloudDownload } from "react-icons/io";
import { MdOutlineRestore } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import NameModal from "./NameModal";

const FolderDisplayComponent = ({
  file,
  currentPage,
  setRefresh,
  setTrashPageRefresh,
}) => {
  const { setUserFiles, currentFolderPath, setCurrentFolderPath } =
    useFileContext();

  const [loading, setLoading] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const { user } = useUser();
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });
  const [newFolderName, setNewFolderName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleRightClick = (e) => {
    e.preventDefault();
    setShowCreateModal(true);
  };

  const getAllContentsRecursively = async (
    folderId,
    accumulated = [],
    basePath = ""
  ) => {
    const foldersRes = await axios.get("/api/folders", {
      params: { userId: user?.id, parentId: folderId },
    });

    const filesRes = await axios.get("/api/files", {
      params: { userId: user?.id, parentId: folderId },
    });

    const folders = foldersRes.data.userFolders;
    const files = filesRes.data.userFiles;

    for (let file of files) {
      accumulated.push({
        ...file,
        type: "file",
        path: `${basePath}${file.name}`,
      });
    }

    for (let folder of folders) {
      const folderPath = `${basePath}${folder.name}/`;

      accumulated.push({
        ...folder,
        type: "folder",
        path: folderPath,
      });

      await getAllContentsRecursively(folder.id, accumulated, folderPath);
    }

    return accumulated;
  };

  const getFolders = async () => {
    setLoading(true);
    setCurrentFolderPath([
      ...currentFolderPath,
      { folder: file.name, id: file.id },
    ]);
    setLoading(false);
  };

  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggedOver(true);
        }}
        onDragLeave={() => setIsDraggedOver(false)}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDraggedOver(false);

          const files = e.dataTransfer.files;
          if (files.length === 0) return;

          const imageFile = files[0];

          if (!imageFile.type.startsWith("image/")) {
            console.warn("Only image files are supported");
            return;
          }

          const formData = new FormData();
          formData.append("selectedFile", imageFile);
          formData.append("fileName", imageFile.name);
          formData.append("fileType", imageFile.type);
          formData.append("fileSize", imageFile.size);
          formData.append("userId", user.id);
          formData.append("folderId", file.id);

          try {
            await axios.post("/api/files", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setRefresh(Date.now());
          } catch (error) {
            console.error("Error uploading dropped file", error);
          }
        }}
        onContextMenu={handleRightClick}
        className={`flex items-center h-10 transition-all duration-150 ${
          isDraggedOver ? "bg-blue-100 border border-blue-400 rounded-md" : ""
        }`}
      >
        <div
          onDoubleClick={() => {
            if (currentPage !== "trash") {
              getFolders();
            }
          }}
          className="w-[25%] h-full px-3 py-2 flex gap-3 items-center cursor-pointer select-none overflow-hidden whitespace-nowrap"
        >
          <FaFolder size={20} color="#0020fd" />
          <p className="text-sm truncate">{file.name}</p>
        </div>

        <div className="w-[14%] px-2 h-full py-2 flex gap-3 items-center">
          <p className="text-sm">Folder</p>
        </div>
        <div className="w-[14%] px-2 h-full py-2 flex gap-3 items-center">
          <p className="text-sm">-</p>
        </div>
        <div className="w-[20%] h-full py-2 flex gap-3 items-center">
          <p className="w-[85%] text-sm">{relativeTime}</p>
        </div>
        <div className="w-[28%] py-2 flex gap-2 items-center">
          {currentPage === "trash" ? (
            <button
              onClick={async () => {
                try {
                  const response2 = await axios.delete(`/api/trash`, {
                    params: {
                      userId: user.id,
                      fileId: file.id,
                    },
                  });
                  const response = await axios.post("/api/folders", {
                    userId: user.id,
                    parentId: null,
                    folderName: file.name,
                    originalFileId: file.originalFileId,
                  });
                  toast.success("Folder restored successfully");
                  setTrashPageRefresh(Date.now());
                } catch (error) {
                  toast.error("Folder restore failed");
                }
              }}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
            >
              <MdOutlineRestore size={17} />
              <p>Restore</p>
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  const allContents = await getAllContentsRecursively(file.id);
                  const zip = new JSZip();
                  const root = zip.folder(file.name);

                  for (const item of allContents) {
                    const relativePath = item.path;

                    if (item.type === "folder") {
                      root.folder(relativePath);
                    } else if (item.type === "file" && item.url) {
                      try {
                        const res = await fetch(item.url);
                        const blob = await res.blob();
                        root.file(relativePath, blob);
                      } catch (err) {
                        toast.error("File download failed");
                      }
                    }
                  }
                  const blob = await zip.generateAsync({ type: "blob" });
                  saveAs(blob, `${file.name}.zip`);
                  toast.success("File downloaded successfully");
                } catch (error) {
                  toast.error("File download failed");
                }
              }}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]"
            >
              <IoIosCloudDownload size={12} />
              <p>Download</p>
            </button>
          )}
          <button
            onClick={async () => {
              try {
                if (currentPage === "trash") {
                  const allContents = await getAllContentsRecursively(
                    file.originalFileId
                  );
                  const fileIds = allContents
                    .filter((item) => item.type === "file")
                    .map((item) => item.id);

                  const folderIds = allContents
                    .filter((item) => item.type === "folder")
                    .map((item) => item.id);

                  if (fileIds.length === 0 && folderIds.length === 0) {
                    await axios.delete(`/api/trash`, {
                      params: {
                        userId: user.id,
                        fileId: file.id,
                      },
                    });
                  } else {
                    await axios.post("/api/trash/permanent-delete", {
                      userId: user.id,
                      fileIds,
                      folderIds,
                    });
                    await axios.delete(`/api/trash`, {
                      params: {
                        userId: user.id,
                        fileId: file.id,
                      },
                    });
                  }
                  toast.success("Folder deleted permanently");
                  setTrashPageRefresh(Date.now());
                } else {
                  const formData = new FormData();
                  formData.append("originalFileId", file.id);
                  formData.append("fileName", file.name);
                  formData.append("fileType", "folder");
                  formData.append("fileSize", 0);
                  formData.append("fileUrl", null);
                  formData.append("userId", user.id);
                  formData.append("folderId", file.parentId);

                  await axios.post("/api/trash", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });

                  await axios.delete(`/api/folders`, {
                    params: {
                      userId: user.id,
                      folderId: file.id,
                    },
                  });
                }
                setRefresh(Date.now());
                toast.success("Folder deleted successfully");
              } catch (error) {
                toast.error("Folder delete failed");
              }
            }}
            className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
          >
            <MdDeleteOutline size={17} />
            <p className="text-sm">Delete</p>
          </button>
        </div>
      </div>

      <NameModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} parentId={file.id} />
    </>
  );
};

export default FolderDisplayComponent;
