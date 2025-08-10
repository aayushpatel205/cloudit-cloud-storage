import React from "react";

const ImagePreviewModal = ({ imageUrl, onClose, isPreviewModalOpen }) => {
  if (!isPreviewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
      <div className="relative max-w-[90%] max-h-[90%] overflow-auto no-scrollbar">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all backdrop-blur-sm z-10"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="object-contain rounded-lg shadow-lg"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
