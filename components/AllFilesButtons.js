import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiStarLine, RiStarOffLine } from "react-icons/ri";
import { IoIosCloudDownload } from "react-icons/io";
import { downloadImage } from "@/service/ImageDownload";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

const AllFilesButtons = ({ file, setRefresh }) => {
  const { user } = useUser();

  const deleteFile = async () => {
    try {
      const response = await axios.delete(`/api/files`, {
        params: {
          userId: user.id,
          fileId: file?.id,
        },
      });
      console.log("response in deleting file: ", response.data);
    } catch (error) {
      console.log("error in deleting file: ", error);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          try {
            downloadImage(file.url, file.name);
          } catch (error) {
            console.log(error);
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex justify-center items-center gap-2 cursor-pointer"
      >
        <IoIosCloudDownload size={17} />
        <p>Download</p>
      </button>

      <div className="flex gap-2">
        {file?.isStarred ? (
          <button
            onClick={async () => {
              try {
                await axios.delete(`/api/starred`, {
                  params: {
                    userId: user.id,
                    originalFileId: file.id,
                  },
                });
                setRefresh(Date.now());
                toast.success("Removed from starred");
              } catch (error) {
                toast.error(error.response.data.message);
              }
            }}
            className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]"
          >
            <RiStarOffLine size={17} />
            <p>Remove</p>
          </button>
        ) : (
          <button
            onClick={async () => {
              const formData = new FormData();
              formData.append("originalFileId", file.id);
              formData.append("fileName", file.name);
              formData.append("fileType", file.type);
              formData.append("fileSize", file.size);
              formData.append("fileUrl", file.url);
              formData.append("userId", user.id);

              await axios.post("/api/starred", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              setRefresh(Date.now());
              toast.success("Added to starred");
            }}
            className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex justify-center items-center gap-2 cursor-pointer"
          >
            <RiStarLine size={16} />
            <p className="text-sm">Star</p>
          </button>
        )}

        <button
          onClick={async () => {
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

            if (file.isStarred) {
              await axios.delete(`/api/starred`, {
                params: {
                  userId: user.id,
                  originalFileId: file.id,
                },
              });
            }

            deleteFile();
            setRefresh(Date.now());
          }}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex justify-center items-center gap-2 cursor-pointer"
        >
          <MdDeleteOutline size={17} />
          <p>Trash</p>
        </button>
      </div>
    </div>
  );
};

export default AllFilesButtons;
