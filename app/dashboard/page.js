"use client";
import { useState, useRef, useEffect, use } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaRegFileAlt, FaRegFile, FaRegStar } from "react-icons/fa";
import { FiTrash, FiRefreshCw } from "react-icons/fi";
import { handleUpload } from "@/service/ImageUpload";
import NameModal from "@/components/NameModal";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import FolderDisplayComponent from "@/components/FolderDisplayComponent";

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const [active, setActive] = useState("allfiles");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [refresh , setRefresh] = useState(Date.now());
  const { user } = useUser();

  useEffect(() => {
    const getFolders = async () => {
      const response = await axios.get("/api/folders", {
        params: {
          userId: user?.id,
        },
      });
      setUserFiles(response.data.userFolders);
    };
    getFolders();
  }, [user , refresh]);

  const handleCreate = (name) => {
    console.log("Name entered:", name);
    // your folder/file creation logic here
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);

      // const url = await axios.post("/api/folders",{});
      // console.log("Uploaded URL:", url);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <ProtectedRoute>
      <div className="mt-5 min-h-screen px-20 flex gap-12 items-center justify-center">
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
            className={`flex justify-center items-center w-[100%] h-[170px] ${
              !selectedFile ? "border-1 border-gray-700 border-dashed " : ""
            } mt-5 rounded-lg`}
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
                <>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={async () => {
                  const url = await handleUpload(
                    selectedFile,
                    "userUpload",
                    "image"
                  );
                  console.log("Uploaded URL:", url);
                  setSelectedFile(null);
                }}
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
              <li className="text-sm">Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>

        <div className="h-[520px] border-1 border-gray-700 border-dashed rounded-xl flex flex-col w-[65%] px-5 py-5 gap-7">
          <div className="flex gap-3 items-center">
            <FaRegFileAlt className=" text-darkblue-500" size={30} />
            <p className="text-2xl font-semibold">Your Files</p>
          </div>

          <div className="w-full flex justify-between px-10">
            <div
              onClick={() => setActive("allfiles")}
              className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
                active === "allfiles"
                  ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
                  : "text-gray-500"
              }`}
            >
              <FaRegFile />
              <p>All Files</p>
            </div>

            <div
              onClick={() => setActive("starred")}
              className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
                active === "starred"
                  ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
                  : "text-gray-500"
              }`}
            >
              <FaRegStar />
              <p>Starred</p>
            </div>

            <div
              onClick={() => setActive("trash")}
              className={`cursor-pointer flex gap-3 items-center justify-center pb-1 w-[25%] ${
                active === "trash"
                  ? "text-darkblue-500 border-b-3 border-b-darkblue-500"
                  : "text-gray-500"
              }`}
            >
              <FiTrash />
              <p>Trash</p>
            </div>
          </div>

          <div>
            <button className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md">
              Home
            </button>
          </div>

          <div className="flex justify-between border-b border-b-gray-700 pb-4">
            <p className="text-2xl font-semibold">All Files</p>
            <button onClick={() => setRefresh(Date.now())} className="bg-[rgba(255,255,255,0.1)] text-sm px-3 py-1 rounded-md flex items-center gap-2 cursor-pointer">
              <FiRefreshCw />
              <p>Refresh</p>
            </button>
          </div>

          <div className="border border-gray-700 h-[225px] rounded-lg p-3">
            <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur">
              <p className="w-[24%]">Name</p>
              <p className="w-[15%]">Type</p>
              <p className="w-[15%]">Size</p>
              <p className="w-[23%]">Added</p>
              <p className="w-[23%]">Actions</p>
            </div>

            <div className="flex h-[68%] flex-col mt-3 gap-2 overflow-y-scroll">
              {userFiles.length > 0 ? (
                userFiles.map((file, index) => (
                  <FolderDisplayComponent
                    key={index}
                    file={file}
                    setActive={setActive}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No files or folders found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <NameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreate}
      />
    </ProtectedRoute>
  );
};
export default Dashboard;
