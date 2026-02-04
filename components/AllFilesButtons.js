import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiStarLine, RiStarOffLine } from "react-icons/ri";
import { IoIosCloudDownload } from "react-icons/io";
import { downloadImage } from "@/service/ImageDownload";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const AllFilesButtons = ({ file }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const parentKey = file.folderId ?? null;

  const filesKey = ["files", user?.id, parentKey];

  console.log("file in allFilesButtons: ", file);
  const deleteFile = async () => {
    try {
      const response = await axios.delete("/api/files", {
        params: {
          userId: user.id,
          fileId: file?.id,
        },
      });
      console.log("response in deleting file:", response.data);
    } catch (error) {
      console.log("error in deleting file:", error);
      throw error;
    }
  };

  const moveToTrash = async () => {
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

      if (file.isStarred) {
        await axios.delete("/api/starred", {
          params: {
            userId: user.id,
            originalFileId: file.id,
          },
        });
      }

      await deleteFile();
      // setRefresh(Date.now());
      toast.success("Moved to trash");
    } catch (error) {
      toast.error("Failed to move to trash");
    }
  };

  const toggleStar = async () => {
    // Optimistic cache update
    queryClient.setQueryData(filesKey, (old = []) =>
      old.map((f) =>
        f.id === file.id ? { ...f, isStarred: !f.isStarred } : f,
      ),
    );

    try {
      // Backend sync
      if (file.isStarred) {
        await axios.delete("/api/starred", {
          params: {
            userId: user.id,
            originalFileId: file.id,
          },
        });
        toast.success("Removed from starred");
      } else {
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
        toast.success("Added to starred");
      }

      // Optional silent reconciliation
      queryClient.invalidateQueries({
        queryKey: filesKey,
        refetchType: "inactive",
      });
    } catch (error) {
      // Rollback on failure
      queryClient.invalidateQueries({ queryKey: filesKey });
      toast.error("Star action failed");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Download */}
      <button
        onClick={() => {
          try {
            downloadImage(file.url, file.name);
            toast.success("File downloaded");
          } catch (error) {
            toast.error("Download failed");
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex justify-center items-center gap-2 cursor-pointer"
      >
        <IoIosCloudDownload size={17} />
        <p>Download</p>
      </button>

      <div className="flex gap-2">
        {/* Star / Unstar */}
        <button
          onClick={toggleStar}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex justify-center items-center gap-2 cursor-pointer w-[55%]"
        >
          {file?.isStarred ? (
            <>
              <RiStarOffLine size={17} />
              <p>Remove</p>
            </>
          ) : (
            <>
              <RiStarLine size={16} />
              <p>Star</p>
            </>
          )}
        </button>

        {/* Trash */}
        <button
          onClick={moveToTrash}
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
