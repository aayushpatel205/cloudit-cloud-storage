"use client";
import axios from "axios";
import { useState, useRef } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MdOutlineUploadFile } from "react-icons/md";
import NameModal from "@/components/NameModal";
import { useUser } from "@clerk/nextjs";
import imageCompression from "browser-image-compression";
import UserFiles from "@/components/UserFiles";
import { toast } from "react-toastify";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useUser();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      const formData = new FormData();
      formData.append("selectedFile", compressedFile);
      formData.append("fileName", compressedFile.name);
      formData.append("fileTag", "image");
      formData.append("userId", user.id);
      formData.append("folderId", null);

      const response = await axios.post("/api/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("File uploaded successfully");
      setSelectedFile(null);
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen px-20 flex gap-12 items-center justify-center overflow-hidden">
        <div className="rounded-xl flex flex-col border-1 border-gray-700 border-dashed min-h-[500px] w-[25%] px-5 py-5 gap-5 mt-5">
          <div className="flex gap-2 items-center">
            <MdOutlineUploadFile className="text-darkblue-500" size={35} />
            <p className="text-xl font-semibold">Upload</p>
          </div>

          <div className="w-[100%] flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-darkblue-500 px-4 py-2 rounded-full text-white font-semibold text-sm cursor-pointer transition w-[50%]"
            >
              Add New Folder
            </button>
            <button
              onClick={handleBrowseClick}
              className="bg-darkblue-500 px-4 py-2 rounded-full text-white font-semibold text-sm cursor-pointer transition w-[45%]"
            >
              Add Image
            </button>
          </div>

          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex justify-center items-center w-full h-[170px] mt-5 rounded-lg transition ${
              isDragging
                ? "border-2 border-darkblue-500 bg-gray-500/10"
                : "border-1 border-gray-700 border-dashed"
            }`}
          >
            <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
              {!selectedFile ? (
                <>
                  <MdOutlineUploadFile
                    className="text-darkblue-500"
                    size={40}
                  />
                  <span className="text-xs">
                    Drag and drop to upload or{" "}
                    <span
                      className="text-darkblue-500 cursor-pointer"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              ) : (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={uploadFile}
                className="bg-darkblue-500 px-4 py-2 rounded-full text-white font-semibold text-xs cursor-pointer transition"
              >
                Upload
              </button>
              <button
                
                onClick={() => setSelectedFile(null)}
                className="bg-gray-600 px-4 py-2 rounded-full text-white font-semibold text-xs cursor-pointer transition"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-2">
            <p className="text-lg font-semibold">Tips:</p>
            <ul className="gap-2 flex flex-col">
              <li className="text-sm">Use a unique folder name</li>
              <li className="text-sm">Images are private</li>
              <li className="text-sm">Maximum file size: 2MB</li>
            </ul>
          </div>
        </div>

        <UserFiles />
      </div>

      <NameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={null}
      />
    </ProtectedRoute>
  );
};

export default Dashboard;
