import React from "react";
import { MdDeleteOutline, MdOutlineRestore } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TrashPageButtons = ({ file }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const trashKey = ["trash-files", user.id];
  const allFilesKey = ["files", user.id , file?.folderId ?? null];

  const removeFromTrashCache = () => {
    queryClient.setQueryData(trashKey, (old = []) =>
      old.filter((f) => f.id !== file.id)
    );
  };

  const restoreToAllFiles = async () => {
    // optimistic remove from trash
    removeFromTrashCache();

    try {
      // Remove from trash in backend
      await axios.delete("/api/trash", {
        params: {
          userId: user.id,
          fileId: file.id,
        },
      });

      // Re-create file in backend (your exact logic)
      const newFile = {
        type: file.type,
        size: file.size,
      };

      const formData = new FormData();
      formData.append("newFileRaw", JSON.stringify(newFile));
      formData.append("fileName", file.name);
      formData.append("fileTag", "image");
      formData.append("userId", user.id);
      formData.append("folderId", file.parentId);
      formData.append("newUrl", file.url);

      const response = await axios.post("/api/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const restoredFile = response.data?.file ?? file;

      // Add to all-files cache
      queryClient.setQueryData(allFilesKey, (old = []) => [
        restoredFile,
        ...old,
      ]);

      toast.success("File restored successfully");
    } catch (error) {
      // rollback
      queryClient.invalidateQueries(trashKey);
      toast.error("File restore failed");
    }
  };

  const deletePermanently = async () => {
    // optimistic remove
    removeFromTrashCache();

    try {
      await axios.delete("/api/trash", {
        params: {
          userId: user.id,
          fileId: file.id,
        },
      });

      toast.success("File deleted permanently");
    } catch (error) {
      // rollback
      queryClient.invalidateQueries(trashKey);
      toast.error("File deletion failed");
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={restoreToAllFiles}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2"
      >
        <MdOutlineRestore size={17} />
        <p>Restore</p>
      </button>

      <button
        onClick={deletePermanently}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2"
      >
        <MdDeleteOutline size={17} />
        <p>Delete</p>
      </button>
    </div>
  );
};

export default TrashPageButtons;
