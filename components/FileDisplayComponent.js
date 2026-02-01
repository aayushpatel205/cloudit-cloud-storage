"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import StarredPageButtons from "./StarredPageButtons";
import TrashPageButtons from "./TrashPageButtons";
import AllFilesButtons from "./AllFilesButtons";

const FileDisplayComponent = ({
  file,
  setIsPreviewModalOpen,
  setImageUrl,
  currentPage
}) => {
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024)
      return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const pageButtonRender = {
    starred: (
      <StarredPageButtons
        file={file}
        // setRefresh={setRefresh}
        // setStarredPageRefresh={setStarredPageRefresh}
      />
    ),
    trash: (
      <TrashPageButtons
        file={file}
        // setRefresh={setRefresh}
        // setTrashPageRefresh={setTrashPageRefresh}
      />
    ),
    allFiles: (
      <AllFilesButtons
        file={file}
        // setRefresh={setRefresh}
      />
    ),
  };

  return (
    <div className="flex items-center h-20 my-1 gap-2">
      {/* Name */}
      <div
        onClick={() => {
          setImageUrl(file.url);
          setIsPreviewModalOpen(true);
        }}
        className="w-[22%] h-full px-3 py-2 flex gap-5 items-center cursor-pointer overflow-hidden"
      >
        <Image src={file.url} alt="File" width={40} height={40} />
        <p className="w-[50%] text-sm break-words line-clamp-3">
          {file.name}
        </p>
      </div>

      {/* Type */}
      <div className="w-[13%] px-3 h-full py-2 flex items-center">
        <p className="text-sm">Image</p>
      </div>

      {/* Size */}
      <div className="w-[14%] px-1 h-full py-2 flex items-center">
        <p className="text-sm">{formatFileSize(file.size)}</p>
      </div>

      {/* Added */}
      <div className="w-[19%] h-full py-2 flex items-center">
        <p className="text-sm">{relativeTime}</p>
      </div>

      {/* Actions */}
      {pageButtonRender[currentPage]}
    </div>
  );
};

export default FileDisplayComponent;
