import React from "react";
import { useUser } from "@clerk/nextjs";
import FileDisplayComponent from "./FileDisplayComponent";
import { useUserFiles } from "@/hooks/useUserFiles";

const StarredFiles = ({ setImageUrl, setIsPreviewModalOpen }) => {
  const { user } = useUser();

  const { data: files = [], isFetching } = useUserFiles({
    userId: user?.id,
    parentId: null,
  });

  const starredFiles = files.filter(
    (file) => file.isStarred && file.type.startsWith("image/")
  );

  return (
    <div>
      <div className="border border-gray-700 h-[363px] rounded-lg p-3 flex flex-col">
        {/* Header */}
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur mb-2">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[15%]">Size</p>
          <p className="w-[23%]">Added</p>
          <p className="w-[23%]">Actions</p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {isFetching ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              Loading...
            </p>
          ) : starredFiles.length === 0 ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              No starred files.
            </p>
          ) : (
            starredFiles.map((file) => (
              <FileDisplayComponent
                key={file.id}
                file={file}
                currentPage="starred"
                setImageUrl={setImageUrl}
                setIsPreviewModalOpen={setIsPreviewModalOpen}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StarredFiles;
