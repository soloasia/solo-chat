import React, { createContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children } : any) => {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const _key = "theme";

  const toggleTheme = async () => {
    if (theme === "light") {
      setTheme("dark");
      StatusBar.setBarStyle("light-content");
      await storeTheme("dark");
    } else {
      setTheme("light");
      StatusBar.setBarStyle("dark-content");
      await storeTheme("light");
    }
    console.log("set theme ",theme);

  };


  const storeTheme = async (value : string) => {
    try {
     await AsyncStorage.setItem(_key, value);
    
    } catch (e) {
      // saving error
      
    }
  }

  const getTheme = async () => {
    try {
      const value = await AsyncStorage.getItem(_key)
      if(value != null) {
        setTheme(value);
        value === "light" ?  StatusBar.setBarStyle("dark-content") :  StatusBar.setBarStyle("light-content");
      } else {
        storeTheme("light");
      }
    } catch(e) {
      // error reading value
    }
  }

  

  useEffect(() => {
    getTheme();
  }, []);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
