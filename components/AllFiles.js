import React, { useEffect, useMemo } from "react";
import { useFileContext } from "@/context/FileContext";
import FolderDisplayComponent from "@/components/FolderDisplayComponent";
import FileDisplayComponent from "@/components/FileDisplayComponent";
import { FiRefreshCw } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

const AllFiles = ({
  files = [],
  isFetching,
  setActive,
  setImageUrl,
  setIsPreviewModalOpen,
  setIsModalOpen,
}) => {
  const { currentFolderPath, setCurrentFolderPath } = useFileContext();
  const queryClient = useQueryClient();
  const { user } = useUser();

  useEffect(() => {
    console.log(
      "Cache files:",
      queryClient.getQueryData(["files", user?.id, null])
    );
  }, [queryClient, user?.id]);

  const sortedFiles = useMemo(() => {
    return [...files]
      .filter((file) => file?.createdAt)
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [files]);

  return (
    <div className="flex flex-col gap-7">
      {/* Breadcrumb */}
      <div className="flex gap-2">
        {currentFolderPath.map((element, index) => (
          <div
            key={index}
            className="gap-2 flex items-center cursor-pointer"
          >
            <button
              onClick={() =>
                setCurrentFolderPath(
                  currentFolderPath.slice(0, index + 1)
                )
              }
              className="cursor-pointer bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md"
            >
              {element.folder}
            </button>
            {index !== currentFolderPath.length - 1 && <p>/</p>}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between border-b border-b-gray-700 pb-4">
        <p className="text-2xl font-semibold">All Files</p>

        <button
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["files"],
            })
          }
          className="cursor-pointer bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2"
        >
          <FiRefreshCw />
          <p>Refresh</p>
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-700 h-[230px] rounded-lg p-3 flex flex-col">
        {/* Table Header */}
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[14%]">Size</p>
          <p className="w-[21%]">Added</p>
          <p className="w-[26%]">Actions</p>
        </div>

        {/* Table Body */}
        <div className="flex h-[68%] flex-col mt-3 gap-2 overflow-y-scroll">
          {/* EMPTY STATE */}
          {!sortedFiles.length && !isFetching && (
            <div className="flex flex-col items-center">
              <p className="text-gray-400 py-4 mt-4">
                No files or folders found.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-darkblue-500 px-3 py-1 rounded-md text-sm font-semibold"
              >
                Create Folder
              </button>
            </div>
          )}

          {/* FILE LIST (NEWEST → OLDEST) */}
          {sortedFiles.map((file) =>
            file?.type?.startsWith("image/") ? (
              <FileDisplayComponent
                key={file.id}
                file={file}
                setImageUrl={setImageUrl}
                setIsPreviewModalOpen={setIsPreviewModalOpen}
                currentPage="allFiles"
              />
            ) : (
              <FolderDisplayComponent
                key={file.id}
                file={file}
                currentPage="allFiles"
                setActive={setActive}
              />
            )
          )}

          {/* BACKGROUND FETCH INDICATOR */}
          {isFetching && sortedFiles.length > 0 && (
            <p className="text-xs text-gray-500 text-center">
              Updating…
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFiles;
