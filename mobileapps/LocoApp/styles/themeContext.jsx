import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from './themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme); // Default to light theme

  // Gets and applies  the stored theme from localstorage if avaliable
  AsyncStorage.getItem('theme')
    .then((savedTheme) => {
      if (!savedTheme) return;
      if (savedTheme === 'lightTheme') {
        setTheme(lightTheme);
      } else if (savedTheme === 'darkTheme') {
        setTheme(darkTheme);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
    // Sets the new theme in localstorage
    try {
      AsyncStorage.setItem(
        'theme',
        theme === lightTheme ? 'darkTheme' : 'lightTheme'
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
