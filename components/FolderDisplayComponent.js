import React from "react";
import { FaFolder, FaRegStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";

const FolderDisplayComponent = ({ file }) => {
  const relativeTime = formatDistanceToNow(new Date(file.createdAt), {
    addSuffix: true,
  });
  return (
    <div className="flex items-center h-10">
        
      <div className="w-[24%] h-full px-3 py-2 flex gap-3 items-center">
        <FaFolder size={20} color="#0020fd" />
        <p className="text-sm">{file.name}</p>
      </div>
      <div className="w-[15%] px-2 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">Folder</p>
      </div>
      <div className="w-[15%] px-2 h-full py-2 flex gap-3 items-center">
        <p className="text-sm">-</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <p className="text-sm">{relativeTime}</p>
      </div>
      <div className="w-[23%] h-full py-2 flex gap-3 items-center">
        <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
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

export default FolderDisplayComponent;
