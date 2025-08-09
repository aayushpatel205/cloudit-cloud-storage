import React from "react";
import { MdDeleteOutline, MdOutlineRestore } from "react-icons/md";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
const TrashPageButtons = ({ file, setTrashPageRefresh }) => {
  const { user } = useUser();
  return (
    <div className="flex gap-2">
      <button
        onClick={async () => {
          try {
            const response1 = await axios.delete(`/api/trash`, {
              params: {
                userId: user.id,
                fileId: file.id,
              },
            });

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

            const response2 = await axios.post("/api/files", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            setTrashPageRefresh(Date.now());
            toast.success("File restored successfully");
          } catch (error) {
            toast.error("File restore failed");
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
      >
        <MdOutlineRestore size={17} />
        <p>Restore</p>
      </button>
      <button
        onClick={async () => {
          try {
            await axios.delete(`/api/trash`, {
              params: {
                userId: user.id,
                fileId: file.id,
              },
            });
            setTrashPageRefresh(Date.now());
            toast.success("File deleted permanently");
          } catch (error) {
            toast.error("File deletion failed");
          }
        }}
        className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer"
      >
        <MdDeleteOutline size={17} />
        <p>Delete</p>
      </button>
    </div>
  );
};

export default TrashPageButtons;
