"use client";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineRestore } from "react-icons/md";
import { IoIosCloudDownload } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { useFileContext } from "@/context/FileContext";
import NameModal from "./NameModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const FolderDisplayComponent = ({ file, currentPage }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { currentFolderPath, setCurrentFolderPath } = useFileContext();

  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });

  /* ---------------- FOLDER NAVIGATION ---------------- */
  const openFolder = () => {
    if (currentPage === "trash") return;

    setCurrentFolderPath([
      ...currentFolderPath,
      { folder: file.name, id: file.id },
    ]);
    // 🔥 NO FETCH HERE — query key changes, cache handles it
  };

  /* ---------------- UPLOAD ON DROP ---------------- */
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      await axios.post("/api/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-files"] });
      toast.success("File uploaded");
    },
    onError: () => {
      toast.error("Upload failed");
    },
  });

  /* ---------------- DELETE FOLDER ---------------- */
  const deleteFolderMutation = useMutation({
    mutationFn: async () => {
      if (currentPage === "trash") {
        await axios.delete("/api/trash", {
          params: { userId: user.id, fileId: file.id },
        });
      } else {
        const formData = new FormData();
        formData.append("originalFileId", file.id);
        formData.append("fileName", file.name);
        formData.append("fileType", "folder");
        formData.append("fileSize", 0);
        formData.append("userId", user.id);
        formData.append("folderId", file.parentId);

        await axios.post("/api/trash", formData);
        await axios.delete("/api/folders", {
          params: { userId: user.id, folderId: file.id },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-files"] });
      toast.success("Folder deleted");
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  /* ---------------- RESTORE FOLDER ---------------- */
  const restoreFolderMutation = useMutation({
    mutationFn: async () => {
      await axios.delete("/api/trash", {
        params: { userId: user.id, fileId: file.id },
      });

      await axios.post("/api/folders", {
        userId: user.id,
        parentId: null,
        folderName: file.name,
        originalFileId: file.originalFileId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-files"] });
      toast.success("Folder restored");
    },
    onError: () => {
      toast.error("Restore failed");
    },
  });

  /* ---------------- DOWNLOAD ---------------- */
  const downloadFolder = async () => {
    try {
      const zip = new JSZip();
      const root = zip.folder(file.name);

      const walk = async (folderId, path = "") => {
        const [foldersRes, filesRes] = await Promise.all([
          axios.get("/api/folders", {
            params: { userId: user.id, parentId: folderId },
          }),
          axios.get("/api/files", {
            params: { userId: user.id, parentId: folderId },
          }),
        ]);

        for (const f of filesRes.data.userFiles) {
          const res = await fetch(f.url);
          const blob = await res.blob();
          root.file(`${path}${f.name}`, blob);
        }

        for (const d of foldersRes.data.userFolders) {
          root.folder(`${path}${d.name}`);
          await walk(d.id, `${path}${d.name}/`);
        }
      };

      await walk(file.id);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${file.name}.zip`);
      toast.success("Folder downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setShowCreateModal(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggedOver(true);
        }}
        onDragLeave={() => setIsDraggedOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggedOver(false);

          const image = e.dataTransfer.files[0];
          if (!image?.type.startsWith("image/")) return;

          const formData = new FormData();
          formData.append("selectedFile", image);
          formData.append("fileName", image.name);
          formData.append("fileType", image.type);
          formData.append("fileSize", image.size);
          formData.append("userId", user.id);
          formData.append("folderId", file.id);

          uploadMutation.mutate(formData);
        }}
        className={`flex items-center h-10 transition ${
          isDraggedOver ? "bg-blue-100 border border-blue-400 rounded-md" : ""
        }`}
      >
        <div
          onDoubleClick={openFolder}
          className="w-[25%] px-3 py-2 flex gap-3 items-center cursor-pointer truncate"
        >
          <FaFolder size={18} color="#0020fd" />
          <p className="text-sm truncate">{file.name}</p>
        </div>

        <div className="w-[14%] px-2 text-sm">Folder</div>
        <div className="w-[14%] px-2 text-sm">-</div>
        <div className="w-[20%] text-sm">{relativeTime}</div>

        <div className="w-[28%] flex gap-2">
          {currentPage === "trash" ? (
            <button
              onClick={() => restoreFolderMutation.mutate()}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
            >
              <MdOutlineRestore size={17} />
              <p>Restore</p>
            </button>
          ) : (
            <button
              onClick={downloadFolder}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]"
            >
              <IoIosCloudDownload size={12} />
              <p>Download</p>
            </button>
          )}

          <button
            onClick={() => deleteFolderMutation.mutate()}
            className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
          >
            <MdDeleteOutline size={17} />
            <p className="text-sm">Delete</p>
          </button>
        </div>
      </div>

      <NameModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        parentId={file.id}
      />
    </>
  );
};

export default FolderDisplayComponent;
