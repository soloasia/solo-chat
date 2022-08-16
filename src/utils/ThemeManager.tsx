import React, { createContext, useState } from "react";
import { StatusBar } from "react-native";

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

  console.log(theme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
