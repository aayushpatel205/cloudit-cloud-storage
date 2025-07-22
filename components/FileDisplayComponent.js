"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";
import { RiStarOffLine, RiStarLine } from "react-icons/ri";
import { IoIosCloudDownload } from "react-icons/io";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const FileDisplayComponent = ({
  file,
  setIsPreviewModalOpen,
  setImageUrl,
  setRefresh,
  currentPage,
}) => {
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });
  const { user } = useUser();
  return (
    <div className="flex items-center h-20">
      <div
        onClick={() => {
          setImageUrl(file.url);
          setIsPreviewModalOpen(true);
        }}
        className="w-[24%] h-full px-3 py-2 flex gap-3 items-center cursor-pointer"
      >
        <Image src={file.url} alt="File" width={40} height={40} />
        <p className="w-[90%] text-sm">{file.name}</p>
      </div>
      <div className="w-[15%] px-3 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">Image</p>
      </div>
      <div className="w-[14%] px-1 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{file.size}</p>
      </div>
      <div className="w-[21%] h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{relativeTime}</p>
      </div>
      <div className="w-[26%] h-full py-2 flex flex-col gap-2">
        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]">
          <IoIosCloudDownload size={17} />
          <p>Download</p>
        </button>
        <div className="flex gap-2">
          {!file?.isStarred && currentPage !== "starred" ? (
            <button
              onClick={async () => {
                const formData = new FormData();
                formData.append("originalFileId", file.id);
                formData.append("fileName", file.name);
                formData.append("fileType", file.type);
                formData.append("fileSize", file.size);
                formData.append("fileUrl", file.url);
                formData.append("userId", user.id);

                const response = await axios.post("/api/starred", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
                setRefresh(Date.now());
              }}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
            >
              <RiStarLine size={15} />
              <p className="text-sm">Star</p>
            </button>
          ) : (
            <button
              onClick={() => {
                const response = axios.delete(`/api/starred`, {
                  params: {
                    userId: user.id,
                    originalFileId: file.id,
                  },
                });
                setRefresh(Date.now());
              }}
              className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
            >
              <RiStarOffLine size={15} />
              <p className="text-sm">Remove</p>
            </button>
          )}

          <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
            <MdDeleteOutline size={17} />
            <p className="text-sm">Delete</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDisplayComponent;
