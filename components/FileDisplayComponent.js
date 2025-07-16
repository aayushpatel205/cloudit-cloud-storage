import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { FaRegStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useFileContext } from "@/context/FileContext";

const FileDisplayComponent = ({ file, setIsPreviewModalOpen , setImageUrl }) => {
  const { starredFiles, setStarredFiles } = useFileContext();
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });
  console.log("file", file);
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
        <p className="text-sm">{file.name}</p>
      </div>
      <div className="w-[15%] px-3 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">Image</p>
      </div>
      <div className="w-[15%] px-1 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{file.size}</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{relativeTime}</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <button onClick={()=>{
          if(starredFiles.includes(file.id)){
            setStarredFiles(starredFiles.filter((id) => id !== file.id));
          }else{
            setStarredFiles([...starredFiles, file.id]);
          }
        }} className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
          <FaRegStar size={15} />
          <p className="text-sm">Star</p>
        </button>

        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
          <MdDeleteOutline size={17} />
          <p className="text-sm">Delete</p>
        </button>
      </div>
    </div>
  );
};

export default FileDisplayComponent;
