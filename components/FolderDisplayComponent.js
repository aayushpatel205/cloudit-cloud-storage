"use client";
import React, { useEffect, useState } from "react";
import { FaFolder, FaRegStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { useFileContext } from "@/context/FileContext";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const FolderDisplayComponent = ({ file }) => {
  const {
    starredFiles,
    setStarredFiles,
    setUserFiles,
    currentFolderPath,
    setCurrentFolderPath,
  } = useFileContext();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });

  // useEffect(() => {}, []);

  const getFolders = async () => {
    setLoading(true);
    const response = await axios.get("/api/folders", {
      params: {
        userId: user?.id,
        parentId: file.id,
      },
    });
    const response2 = await axios.get("/api/files", {
      params: {
        userId: user?.id,
        parentId: file.id,
      },
    });
    setCurrentFolderPath([
      ...currentFolderPath,
      { folder: file.name, id: file.id },
    ]);
    setUserFiles([...response2?.data.userFiles, ...response?.data.userFolders]);
    setLoading(false);
  };

  console.log("folder here", file);
  return (
    <div className="flex items-center h-10">
      <div
        onDoubleClick={() => {
          getFolders();
        }}
        className="w-[24%] h-full px-3 py-2 flex gap-3 items-center cursor-pointer select-none overflow-hidden whitespace-nowrap"
      >
        <FaFolder size={20} color="#0020fd" />
        <p className="text-sm truncate">{file.name}</p>
      </div>

      <div className="w-[15%] px-2 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">Folder</p>
      </div>
      <div className="w-[15%] px-2 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">-</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{relativeTime}</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <button
          onClick={() => {
            if (starredFiles.includes(file.id)) {
              setStarredFiles(starredFiles.filter((id) => id !== file.id));
            } else {
              setStarredFiles([...starredFiles, file.id]);
            }
          }}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
        >
          <FaRegStar size={15} />
          <p className="text-sm">Star</p>
        </button>

        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
          <MdDeleteOutline size={17} />
          <p className="text-sm">Delete</p>
        </button>
      </div>
    </div>
  );
};

export default FolderDisplayComponent;
