"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import FileDisplayComponent from "./FileDisplayComponent";
import FolderDisplayComponent from "./FolderDisplayComponent";

const TrashFiles = ({ setRefresh, setImageUrl, setIsPreviewModalOpen }) => {
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trashPageRefresh, setTrashPageRefresh] = useState(Date.now());
  const { user } = useUser();

  useEffect(() => {
    const getTrashFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/trash", {
          params: {
            userId: user.id,
          },
        });
        console.log("response for trash: ", response.data.userTrashedItems);
        setTrashFiles(response?.data.userTrashedItems);
      } catch (error) {
        console.error("Error fetching trash files:", error);
      }
      setLoading(false);
    };

    getTrashFiles();
  }, [trashPageRefresh]);

  return (
    <div>
      <div className="border border-gray-700 h-[363px] rounded-lg p-3 flex flex-col">
        {/* Header Row */}
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur mb-3">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[14%]">Size</p>
          <p className="w-[21%]">Added</p>
          <p className="w-[26%]">Actions</p>
        </div>

        {/* File List */}
        <div className="flex h-[90%] flex-col overflow-y-scroll">
          {loading ? (
            <p className="text-gray-400 text-lg text-center py-4 mt-[15%]">
              Loading...
            </p>
          ) : trashFiles?.length === 0 ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              No files here...
            </p>
          ) : (
            trashFiles?.map((element, index) =>
              element?.type?.startsWith("image/") ? (
                <FileDisplayComponent
                  setRefresh={setRefresh}
                  setImageUrl={setImageUrl}
                  key={index}
                  file={element}
                  setIsPreviewModalOpen={setIsPreviewModalOpen}
                  currentPage={"trash"}
                  setTrashPageRefresh={setTrashPageRefresh}
                />
              ) : (
                <FolderDisplayComponent
                  file={element}
                  key={index}
                  currentPage={"trash"}
                  setTrashPageRefresh={setTrashPageRefresh}
                  setRefresh={setRefresh}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashFiles;
