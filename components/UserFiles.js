"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaRegFile } from "react-icons/fa";
import { RiStarLine } from "react-icons/ri";
import { FiTrash, FiRefreshCw } from "react-icons/fi";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { useUser } from "@clerk/nextjs";
import { useFileContext } from "@/context/FileContext";
import NameModal from "./NameModal";
import AllFiles from "./AllFiles";
import StarredFiles from "./StarredFiles";

const UserFiles = () => {
  const [active, setActive] = useState("allfiles");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userFiles, setUserFiles, currentFolderPath, setCurrentFolderPath } =
    useFileContext();
  const [refresh, setRefresh] = useState(Date.now());
  const { user } = useUser();

  const renderComponent = {
    allfiles: (
      <AllFiles
        setActive={setActive}
        setRefresh={setRefresh}
        setImageUrl={setImageUrl}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
      />
    ),
    starred: (
      <StarredFiles
        setRefresh={setRefresh}
        setImageUrl={setImageUrl}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
      />
    ),
  };

  useEffect(() => {
    const getFolders = async () => {
      const lastRoute = currentFolderPath[currentFolderPath.length - 1];
      setLoading(true);
      const response = await axios.get("/api/folders", {
        params: {
          userId: user?.id,
          parentId: lastRoute?.id,
        },
      });
      const response2 = await axios.get("/api/files", {
        params: {
          userId: user?.id,
          parentId: lastRoute?.id,
        },
      });
      console.log("response2 for files: ", response2.data.userFiles);
      setUserFiles([
        ...response2?.data.userFiles,
        ...response?.data.userFolders,
      ]);
      setLoading(false);
    };
    getFolders();
  }, [user, refresh , active]);

  return (
    <div className="h-[520px] border-1 border-gray-700 border-dashed rounded-xl flex flex-col w-[65%] px-5 py-5 gap-7">
      <div className="flex gap-3 items-center">
        <FaRegFileAlt className=" text-darkblue-500" size={30} />
        <p className="text-2xl font-semibold">Your Files</p>
      </div>

      <div className="w-full flex justify-between px-7">
        <div
          onClick={() => setActive("allfiles")}
          className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
            active === "allfiles"
              ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
              : "text-gray-500"
          }`}
        >
          <FaRegFile />
          <p>All Files</p>
        </div>

        <div
          onClick={() => setActive("starred")}
          className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
            active === "starred"
              ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
              : "text-gray-500"
          }`}
        >
          <RiStarLine/>
          <p>Starred</p>
        </div>

        <div
          onClick={() => setActive("trash")}
          className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
            active === "trash"
              ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
              : "text-gray-500"
          }`}
        >
          <FiTrash />
          <p>Trash</p>
        </div>
      </div>

      {renderComponent[active]}
      <ImagePreviewModal
        imageUrl={imageUrl}
        isPreviewModalOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />
      <NameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={currentFolderPath[currentFolderPath.length - 1]?.id}
        // onConfirm={handleCreate}
      />
    </div>
  );
};

export default UserFiles;
