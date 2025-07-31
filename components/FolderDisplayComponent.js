"use client";
import React, { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useFileContext } from "@/context/FileContext";
import { IoIosCloudDownload } from "react-icons/io";
import { MdOutlineRestore } from "react-icons/md";
import { RiStarLine, RiStarOffLine } from "react-icons/ri";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const FolderDisplayComponent = ({
  file,
  currentPage,
  setUserStarredFiles,
  setRefresh,
}) => {
  const { setUserFiles, currentFolderPath, setCurrentFolderPath } =
    useFileContext();

  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });

  const getFolders = async () => {
    setLoading(true);
    let id = file.id;
    const response = await axios.get("/api/folders", {
      params: {
        userId: user?.id,
        parentId: id,
      },
    });
    const response2 = await axios.get("/api/files", {
      params: {
        userId: user?.id,
        parentId: id,
      },
    });
    setUserFiles([...response2?.data.userFiles, ...response?.data.userFolders]);
    setCurrentFolderPath([
      ...currentFolderPath,
      { folder: file.name, id: file.id },
    ]);

    setLoading(false);
  };
  return (
    <div className="flex items-center h-10">
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
          <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
            <MdOutlineRestore size={17} />
            <p>Restore</p>
          </button>
        ) : (
          <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]">
            <IoIosCloudDownload size={12} />
            <p>Download</p>
          </button>
        )}
        <button
          onClick={async () => {
            console.log("The deleted folder details: ", file);
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
            setRefresh(Date.now());
          }}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
        >
          <MdDeleteOutline size={17} />
          <p className="text-sm">Delete</p>
        </button>
      </div>
    </div>
  );
};

export default FolderDisplayComponent;
