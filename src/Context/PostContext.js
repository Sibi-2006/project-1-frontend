import React, { createContext } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3500/api";

  return (
    <PostContext.Provider value={{ baseUrl }}>
      {children}
    </PostContext.Provider>
  );
}
