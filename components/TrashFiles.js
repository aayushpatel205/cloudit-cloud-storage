"use client";
import axios from "axios";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import FileDisplayComponent from "./FileDisplayComponent";
import FolderDisplayComponent from "./FolderDisplayComponent";

const fetchTrashFiles = async (userId) => {
  const res = await axios.get("/api/trash", {
    params: { userId },
  });
  return res.data.userTrashedItems;
};

const TrashFiles = ({ setRefresh, setImageUrl, setIsPreviewModalOpen }) => {
  const { user } = useUser();

  const { data: trashFiles = [], isLoading } = useQuery({
    queryKey: ["trash-files", user?.id],
    queryFn: () => fetchTrashFiles(user.id),
    enabled: !!user?.id,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000
  });

  return (
    <div>
      <div className="border border-gray-700 h-[363px] rounded-lg p-3 flex flex-col">
        {/* Header */}
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur mb-3">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[14%]">Size</p>
          <p className="w-[21%]">Added</p>
          <p className="w-[26%]">Actions</p>
        </div>

        {/* List */}
        <div className="flex h-[90%] flex-col overflow-y-scroll">
          {isLoading ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              Loading...
            </p>
          ) : trashFiles.length === 0 ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              No files here...
            </p>
          ) : (
            trashFiles.map((element) =>
              element.type?.startsWith("image/") ? (
                <FileDisplayComponent
                  key={element.id}
                  file={element}
                  currentPage="trash"
                  setRefresh={setRefresh}
                  setImageUrl={setImageUrl}
                  setIsPreviewModalOpen={setIsPreviewModalOpen}
                />
              ) : (
                <FolderDisplayComponent
                  key={element.id}
                  file={element}
                  currentPage="trash"
                  setRefresh={setRefresh}
                />
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashFiles;
