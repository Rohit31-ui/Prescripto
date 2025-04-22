import { createContext } from "react";
import React from "react";
import { doctors } from "../assets/frontend/assets";

// Create Context
export const AppContext = createContext();

// Context Provider Component

const currencySymbol ='$'

// we use context hook to handle prop drilling,global state management, simply state sharing
const AppContextProvider = ({ children }) => {
  const value = {
    doctors,currencySymbol
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
