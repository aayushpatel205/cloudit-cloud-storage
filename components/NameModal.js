"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";

const NameModal = ({ isOpen, onClose, parentId }) => {
  const [folderName, setFolderName] = useState("");
  const { user } = useUser();

  const handleConfirm = () => {
    if (!folderName) {
      return;
    }

    const uploadFolder = async () => {
      try {
        const response = await axios.post("/api/folders", {
          folderName,
          userId: user.id,
          parentId,
        });
        toast.success("Folder created successfully");
        setFolderName("");
      } catch (error) {
        toast.error("Folder creation failed");
      }
    };
    uploadFolder();
    onClose();
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black text-white rounded-2xl p-6 w-full max-w-sm border border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaFolderPlus className="text-blue-500" size={20} />
                  <h2 className="text-lg font-semibold">New Folder</h2>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  className="w-full bg-transparent border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter folder name..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleConfirm("eac6ba99-72c4-4019-8c22-d71e03c2d2b2");
                  }}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg  bg-darkblue-500 transition text-sm"
                >
                  Create <IoMdArrowForward size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NameModal;
