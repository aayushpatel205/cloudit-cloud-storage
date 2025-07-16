"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaRegFileAlt, FaRegFile, FaRegStar } from "react-icons/fa";
import { FiTrash, FiRefreshCw } from "react-icons/fi";
import FolderDisplayComponent from "@/components/FolderDisplayComponent";
import FileDisplayComponent from "@/components/FileDisplayComponent";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { useUser } from "@clerk/nextjs";
import { useFileContext } from "@/context/FileContext";
import NameModal from "./NameModal";

const UserFiles = () => {
  const [active, setActive] = useState("allfiles");
  const [loading, setLoading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { userFiles, setUserFiles, currentFolderPath, setCurrentFolderPath } =
    useFileContext();
  const [refresh, setRefresh] = useState(Date.now());
  const { user } = useUser();

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
  }, [user, refresh]);

  return (
    <div className="h-[520px] border-1 border-gray-700 border-dashed rounded-xl flex flex-col w-[65%] px-5 py-5 gap-7">
      <div className="flex gap-3 items-center">
        <FaRegFileAlt className=" text-darkblue-500" size={30} />
        <p className="text-2xl font-semibold">Your Files</p>
      </div>

      <div className="w-full flex justify-between px-10">
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
          <FaRegStar />
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

      <div className="flex gap-2">
        {currentFolderPath.map((element, index) => {
          return (
            <div className="gap-2 flex items-center" key={index}>
              <button
                onClick={() => {
                  const arr = currentFolderPath.slice(0, index + 1);
                  setCurrentFolderPath(arr);
                  setRefresh(Date.now());
                }}
                className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md cursor-pointer"
              >
                {element.folder}
              </button>
              {index !== currentFolderPath.length - 1 && <p>/</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between border-b border-b-gray-700 pb-4">
        <p className="text-2xl font-semibold">All Files</p>
        <button
          onClick={() => setRefresh(Date.now())}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
        >
          <FiRefreshCw />
          <p>Refresh</p>
        </button>
      </div>

      <div className="border border-gray-700 h-[225px] rounded-lg p-3 flex flex-col justify-center">
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[15%]">Size</p>
          <p className="w-[23%]">Added</p>
          <p className="w-[23%]">Actions</p>
        </div>

        <div className="flex h-[68%] flex-col mt-3 gap-2 overflow-y-scroll">
          {loading ? (
            <p className="text-gray-400 text-center text-lg mt-auto mb-auto">
              Loading...
            </p>
          ) : userFiles?.length > 0 ? (
            userFiles.map((file, index) =>
              file?.type === "image/png" ? (
                <>
                  <FileDisplayComponent
                    setImageUrl={setImageUrl}
                    key={index}
                    file={file}
                    setIsPreviewModalOpen={setIsPreviewModalOpen}
                  />
                </>
              ) : (
                <FolderDisplayComponent
                  key={index}
                  file={file}
                  setActive={setActive}
                />
              )
            )
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-gray-400 text-md text-center py-4 mt-4">
                No files or folders found.
              </p>
              <button onClick={() => setIsModalOpen(true)} className="cursor-pointer bg-darkblue-500 px-3 py-1 rounded-md text-sm font-semibold">
                Create Folder
              </button>
            </div>
          )}
        </div>
      </div>
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
