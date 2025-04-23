// import { createContext, useState } from "react";
// import PropTypes from "prop-types";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Add PropTypes validation for children
// UserProvider.propTypes = {
//   children: PropTypes.node.isRequired, // Validates that children is required and can be any renderable node
// };

// src/hooks/useUser.jsx
import { useContext } from "react";
import { UserContext } from "../context/UserContext";  // Correct import from UserContext.jsx

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
