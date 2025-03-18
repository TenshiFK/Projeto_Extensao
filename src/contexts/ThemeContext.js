import React, { createContext, useState, useContext, Children } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState('dark')

  const toggleTheme = () =>{
    setTheme((curr) => (curr === 'light' ? 'dark': 'light'))
  }


  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
        {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);