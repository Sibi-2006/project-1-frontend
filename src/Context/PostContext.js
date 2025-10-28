import React, { createContext } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const baseUrl =  "http://192.168.114.101:3500/api";
 // process.env.REACT_APP_BASE_URL || 
  return (
    <PostContext.Provider value={{ baseUrl }}>
      {children}
    </PostContext.Provider>
  );
}
