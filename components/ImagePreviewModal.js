import React from "react";

const ImagePreviewModal = ({ imageUrl, onClose, isPreviewModalOpen }) => {
  if (!isPreviewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative max-w-[70%] max-h-[80%] flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-1 right-2 text-white bg-black bg-opacity-50 rounded-full h-7 w-7 hover:bg-opacity-70 transition flex items-center justify-center"
        >
          <p>x</p>
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
