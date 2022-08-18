import React, { createContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children } : any) => {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      StatusBar.setBarStyle("light-content");
    } else {
      setTheme("light");
      StatusBar.setBarStyle("dark-content");
    }
  };

  useEffect(() => {
    console.log("switch theme");
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
