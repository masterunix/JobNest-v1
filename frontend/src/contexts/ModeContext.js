import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem('mode') || 'jobseeker'
  );

  const updateMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext); 