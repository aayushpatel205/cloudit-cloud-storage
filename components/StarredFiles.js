import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import FileDisplayComponent from "./FileDisplayComponent";
import { toast } from "react-toastify";

const StarredFiles = ({ setImageUrl, setIsPreviewModalOpen, setRefresh }) => {
  const { user } = useUser();
  const [userStarredFiles, setUserStarredFiles] = useState([]);
  const [ starredPageRefresh , setStarredPageRefresh] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchStarredFiles = async () => {
      try {
        const response = await axios.get("/api/starred", {
          params: {
            userId: user.id,
          },
        });
        setUserStarredFiles(response?.data.userStarredFiles);
      } catch (error) {
        toast.error("Failed to fetch starred files");
      }
      setLoading(false);
    };
    fetchStarredFiles();
  }, [starredPageRefresh]);
  return (
    <div>
      <div className="border border-gray-700 h-[363px] rounded-lg p-3 flex flex-col">
        <div className="bg-[rgba(255,255,255,0.05)] h-[40px] rounded-md px-4 flex items-center font-semibold text-sm sticky top-0 z-10 backdrop-blur mb-2">
          <p className="w-[24%]">Name</p>
          <p className="w-[15%]">Type</p>
          <p className="w-[15%]">Size</p>
          <p className="w-[23%]">Added</p>
          <p className="w-[23%]">Actions</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">Loading...</p>
          ) : userStarredFiles?.length === 0 ? (
            <p className="text-gray-400 text-lg text-center mt-[15%]">
              No starred files.
            </p>
          ) : (
            userStarredFiles?.map((element, index) => (
              <FileDisplayComponent
                setRefresh={setRefresh}
                setImageUrl={setImageUrl}
                key={index}
                file={element}
                setIsPreviewModalOpen={setIsPreviewModalOpen}
                currentPage={"starred"}
                setStarredPageRefresh={setStarredPageRefresh}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StarredFiles;
