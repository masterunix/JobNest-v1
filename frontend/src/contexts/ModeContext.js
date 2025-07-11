import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem('mode') || 'jobseeker'
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const updateMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ModeContext.Provider value={{ 
      mode, 
      setMode: updateMode, 
      darkMode, 
      toggleDarkMode 
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext); 