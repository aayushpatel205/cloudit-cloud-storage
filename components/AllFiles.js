import React, { useState } from "react";
import { useFileContext } from "@/context/FileContext";
import FolderDisplayComponent from "@/components/FolderDisplayComponent";
import FileDisplayComponent from "@/components/FileDisplayComponent";
import { FiRefreshCw } from "react-icons/fi";

const AllFiles = ({
  setActive,
  setRefresh,
  setImageUrl,
  setIsPreviewModalOpen,
  loading,
}) => {
  const { userFiles, currentFolderPath, setCurrentFolderPath } =
    useFileContext();
  return (
    <div className="flex flex-col gap-7">
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

      <div className="border border-gray-700 h-[230px] rounded-lg p-3 flex flex-col">
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[14%]">Size</p>
          <p className="w-[21%]">Added</p>
          <p className="w-[26%]">Actions</p>
        </div>

        <div className="flex h-[68%] flex-col mt-3 gap-2 overflow-y-scroll">
          {loading ? (
            <p className="text-gray-400 text-center text-lg m-auto">
              Loading...
            </p>
          ) : userFiles?.length === 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-gray-400 text-md text-center py-4 mt-4">
                No files or folders found.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer bg-darkblue-500 px-3 py-1 rounded-md text-sm font-semibold"
              >
                Create Folder
              </button>
            </div>
          ) : (
            userFiles?.map((file, index) =>
              file?.type === "image/png" ? (
                <FileDisplayComponent
                  setRefresh={setRefresh}
                  setImageUrl={setImageUrl}
                  key={index}
                  file={file}
                  setIsPreviewModalOpen={setIsPreviewModalOpen}
                  currentPage={"allFiles"}
                />
              ) : (
                <FolderDisplayComponent
                  setRefresh={setRefresh}
                  key={index}
                  file={file}
                  setActive={setActive}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFiles;
