
// import { createContext, useState, useEffect, useContext } from "react";
// import PropTypes from "prop-types";

// // Create the DarkMode context
// export const DarkModeContext = createContext({
//   darkMode: false,
//   setDarkMode: () => {},
//   toggleDarkMode: () => {},
// });

// // Create the DarkMode provider
// export const DarkModeProvider = ({ children }) => {
//   // Initialize darkMode state based on localStorage or system preference
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("darkMode");
//     if (saved !== null) {
//       return JSON.parse(saved);
//     }
//     // Fallback to system preference
//     return window.matchMedia("(prefers-color-scheme: dark)").matches;
//   });

//   // Update localStorage and apply dark mode class to document
//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   // Provide a toggle function for convenience
//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//   };

//   return (
//     <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// };

// // PropTypes for DarkModeProvider
// DarkModeProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// // Custom hook to use the DarkMode context
// export const useDarkMode = () => {
//   const context = useContext(DarkModeContext);
//   if (!context) {
//     throw new Error("useDarkMode must be used within a DarkModeProvider");
//   }
//   return context;
// };


import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

// Create the DarkMode context with default values
export const DarkModeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

/**
 * DarkModeProvider Component
 *
 * Provides a context for managing dark mode state across the application.
 * Initializes dark mode based on localStorage or system preference, updates
 * localStorage on changes, and applies the `dark` class to the document root
 * for Tailwind CSS theming.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The DarkMode context provider
 */
export const DarkModeProvider = ({ children }) => {
  // Initialize darkMode state based on localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update localStorage and apply dark mode class to document
  useEffect(() => {
    // Debug: Log darkMode state to confirm initialization and changes
    console.log("DarkModeProvider - Dark Mode State:", darkMode);

    // Save darkMode state to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    // Toggle the `dark` class on document root for Tailwind theming
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Provide a toggle function for convenience
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// PropTypes for DarkModeProvider
DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use the DarkMode context
 *
 * @returns {Object} The dark mode context value
 * @throws {Error} If used outside a DarkModeProvider
 */
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};