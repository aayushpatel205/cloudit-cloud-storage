"use client";
import { createContext, useContext, useState } from "react";
export const FileContext = createContext();

export const FileContextProvider = ({ children }) => {
  const [userFiles, setUserFiles] = useState();
  const [currentFolderPath, setCurrentFolderPath] = useState([
    { folder: "Home", id: null },
  ]);

  return (
    <FileContext.Provider
      value={{
        userFiles,
        setUserFiles,
        currentFolderPath,
        setCurrentFolderPath
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
export const useFileContext = () => useContext(FileContext);
