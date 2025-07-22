"use client";
import React, { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useFileContext } from "@/context/FileContext";
import { IoIosCloudDownload } from "react-icons/io";
import { RiStarLine, RiStarOffLine } from "react-icons/ri";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const FolderDisplayComponent = ({
  file,
  currentPage,
  setUserStarredFiles,
  setRefresh,
  starredFilesPath,
  setStarredFilesPath,
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
    let id = null;

    if (currentPage === "starred") {
      id = file.originalFileId;
    } else {
      id = file.id;
    }
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
    if (currentPage === "starred") {
      console.log("response2 for files: ", response2.data.userFiles);
      console.log("response for folders: ", response.data.userFolders);
      setUserStarredFiles([
        ...response2?.data.userFiles,
        ...response?.data.userFolders,
      ]);

      setStarredFilesPath([
        ...starredFilesPath,
        { folder: file.name, id: file.id },
      ]);
    } else {
      setUserFiles([
        ...response2?.data.userFiles,
        ...response?.data.userFolders,
      ]);
      setCurrentFolderPath([
        ...currentFolderPath,
        { folder: file.name, id: file.id },
      ]);
    }

    setLoading(false);
  };
  return (
    <div className="flex items-center h-10">
      <div
        onDoubleClick={() => {
          console.log("Current Pagre: ", currentPage);
          getFolders();
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
      <div className="w-[28%] py-2 flex gap-3 items-center">
        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
          <MdDeleteOutline size={17} />
          <p className="text-sm">Delete</p>
        </button>
        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]">
          <IoIosCloudDownload size={12} />
          <p>Download</p>
        </button>
      </div>
    </div>
  );
};

export default FolderDisplayComponent;
