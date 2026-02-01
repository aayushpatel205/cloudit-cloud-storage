"use client";
import React, { useState } from "react";
import { FaRegFileAlt, FaRegFile } from "react-icons/fa";
import { RiStarLine } from "react-icons/ri";
import { FiTrash } from "react-icons/fi";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { useUser } from "@clerk/nextjs";
import { useFileContext } from "@/context/FileContext";
import NameModal from "./NameModal";
import AllFiles from "./AllFiles";
import StarredFiles from "./StarredFiles";
import TrashFiles from "./TrashFiles";
import { useUserFiles } from "@/hooks/useUserFiles";

const UserFiles = () => {
  const [active, setActive] = useState("allfiles");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { currentFolderPath } = useFileContext();
  const { user } = useUser();

  const parentId =
    currentFolderPath[currentFolderPath.length - 1]?.id;

  // Query for all Files
  const {
    data: files = [],
    isFetching,
  } = useUserFiles({
    userId: user?.id,
    parentId
  });


  const renderComponent = {
    allfiles: (
      <AllFiles
        files={files}
        isFetching={isFetching}
        setActive={setActive}
        setImageUrl={setImageUrl}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    ),

    // ✅ NOW POWERED BY TANSTACK
    starred: (
      <StarredFiles
        setImageUrl={setImageUrl}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
      />
    ),

    // ✅ NOW POWERED BY TANSTACK
    trash: (
      <TrashFiles
        setImageUrl={setImageUrl}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
      />
    ),
  };

  return (
    <div className="mt-10 h-[520px] border border-gray-700 border-dashed rounded-xl flex flex-col w-[65%] px-5 py-5 gap-7">
      <div className="flex gap-3 items-center">
        <FaRegFileAlt className="text-darkblue-500" size={30} />
        <p className="text-2xl font-semibold">Your Files</p>
      </div>

      <div className="w-full flex justify-between px-7">
        {[
          { key: "allfiles", label: "All Files", icon: <FaRegFile /> },
          { key: "starred", label: "Starred", icon: <RiStarLine /> },
          { key: "trash", label: "Trash", icon: <FiTrash /> },
        ].map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%]
              ${
                active === tab.key
                  ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
                  : "text-gray-500"
              }`}
          >
            {tab.icon}
            <p>{tab.label}</p>
          </div>
        ))}
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
        parentId={parentId}
      />
    </div>
  );
};

export default UserFiles;
