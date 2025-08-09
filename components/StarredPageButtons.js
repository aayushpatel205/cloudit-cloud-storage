import React from "react";
import { IoIosCloudDownload } from "react-icons/io";
import { RiStarOffLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { downloadImage } from "@/service/ImageDownload";
const StarredPageButtons = ({ file, setRefresh, setStarredPageRefresh }) => {
  const { user } = useUser();
  console.log("files here: ", file);
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          try {
            downloadImage(file.url, file.name);
            toast.success("File downloaded successfully");
          } catch (error) {
            console.log(error);
            toast.error("File download failed");
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[60%]"
      >
        <IoIosCloudDownload size={17} />
        <p>Download</p>
      </button>
      <div className="flex gap-2">
        <button
          onClick={async () => {
            try {
              await axios.delete(`/api/starred`, {
                params: {
                  userId: user.id,
                  originalFileId: file.originalFileId,
                },
              });
              setStarredPageRefresh(Date.now());
              toast.success("Removed from starred");
            } catch (error) {
              toast.error("Failed to remove from starred");
            }
          }}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]"
        >
          <RiStarOffLine size={17} />
          <p>Remove</p>
        </button>
        <button
          onClick={async () => {
            try {
              const formData = new FormData();
              formData.append("originalFileId", file.id);
              formData.append("fileName", file.name);
              formData.append("fileType", file.type);
              formData.append("fileSize", file.size);
              formData.append("fileUrl", file.url);
              formData.append("userId", user.id);
              formData.append("folderId", file.folderId);

              await axios.post("/api/trash", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              await axios.delete(`/api/starred`, {
                params: {
                  userId: user.id,
                  originalFileId: file.originalFileId,
                },
              });
              setStarredPageRefresh(Date.now());
              toast.success("Moved to trash");
            } catch (error) {
              toast.error("Failed to move to trash");
            }
          }}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[60%]"
        >
          <MdDeleteOutline size={17} />
          <p>Delete</p>
        </button>
      </div>
    </div>
  );
};

export default StarredPageButtons;
