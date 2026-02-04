"use client";
import React from "react";
import { IoIosCloudDownload } from "react-icons/io";
import { RiStarOffLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { downloadImage } from "@/service/ImageDownload";
import { useQueryClient } from "@tanstack/react-query";

const StarredPageButtons = ({ file }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const parentKey = file?.folderId ?? null;
  const filesKey = ["files", user?.id, parentKey];

  const removeFromStarred = async () => {
    // Optimistic cache update , here as the data is changed directly in cache the corresponsing UI changes immediately !!
    queryClient.setQueryData(filesKey, (old = []) =>
      old.map((f) =>
        f.id === file.id ? { ...f, isStarred: false } : f
      )
    );

    try {
      // Backend sync by making actual request
      await axios.delete("/api/starred", {
        params: {
          userId: user.id,
          originalFileId: file.id,
        },
      });

      toast.success("Removed from starred");

      // Optional silent reconciliation
      queryClient.invalidateQueries({
        queryKey: filesKey,
        refetchType: "inactive",
      });
    } catch (error) {
      // Rollback if backend fails
      queryClient.invalidateQueries({ queryKey: filesKey });
      toast.error("Failed to remove from starred");
    }
  };

  /* MOVE TO TRASH */
  const moveToTrash = async () => {
    queryClient.setQueryData(filesKey, (old = []) =>
      old.filter((f) => f.id !== file.id)
    );

    try {
      await axios.post("/api/trash", {
        userId: user.id,
        originalFileId: file.id,
      });

      toast.success("Moved to trash");

      queryClient.invalidateQueries({
        queryKey: filesKey,
        refetchType: "inactive",
      });
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: filesKey });
      toast.error("Failed to move to trash");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* DOWNLOAD */}
      <button
        onClick={() => {
          try {
            downloadImage(file.url, file.name);
            toast.success("File downloaded");
          } catch {
            toast.error("Download failed");
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[60%]"
      >
        <IoIosCloudDownload size={17} />
        <p>Download</p>
      </button>

      <div className="flex gap-2">
        {/* REMOVE FROM STARRED */}
        <button
          onClick={removeFromStarred}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[55%]"
        >
          <RiStarOffLine size={17} />
          <p>Remove</p>
        </button>

        {/* TRASH */}
        <button
          onClick={moveToTrash}
          className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer w-[60%]"
        >
          <MdDeleteOutline size={17} />
          <p>Trash</p>
        </button>
      </div>
    </div>
  );
};

export default StarredPageButtons;
