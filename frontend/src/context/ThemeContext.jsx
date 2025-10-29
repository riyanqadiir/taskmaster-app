import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextValue';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme 
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Update class on document root
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
    
    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#111827' : '#ffffff');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};