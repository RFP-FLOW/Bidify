import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // localStorage se saved preference lo, default "light"
  const [theme, setTheme] = useState(
    () => localStorage.getItem("bidify-theme") || "light"
  );

  useEffect(() => {
    // HTML root pe class lagao — Tailwind dark mode ke liye
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("bidify-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook — har component mein import karke use karo
export const useTheme = () => useContext(ThemeContext);