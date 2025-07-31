"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { MdDeleteOutline, MdOutlineRestore } from "react-icons/md";
import { RiStarOffLine, RiStarLine } from "react-icons/ri";
import { IoIosCloudDownload } from "react-icons/io";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { downloadImage } from "@/service/ImageDownload";
import toast, { Toaster } from "react-hot-toast";
import StarredPageButtons from "./StarredPageButtons";
import TrashPageButtons from "./TrashPageButtons";
import AllFilesButtons from "./AllFilesButtons";

const FileDisplayComponent = ({
  file,
  setIsPreviewModalOpen,
  setImageUrl,
  setRefresh,
  currentPage,
  setTrashPageRefresh,
  setStarredPageRefresh
}) => {
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });
  const { user } = useUser();

  const pageButtonRender = {
    starred: <StarredPageButtons file={file} setRefresh={setRefresh} setStarredPageRefresh={setStarredPageRefresh}/>,
    trash: <TrashPageButtons file={file} setRefresh={setRefresh} setTrashPageRefresh={setTrashPageRefresh}/>,
    allFiles: <AllFilesButtons file={file} setRefresh={setRefresh} />,
  };

  const notify = () => toast("Downloaded Successfully !!");

  return (
    <div className="flex items-center h-20 my-2 gap-2">
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

      {pageButtonRender[currentPage]}
    </div>
  );
};

export default FileDisplayComponent;
