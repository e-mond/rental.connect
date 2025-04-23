import PropTypes from "prop-types"; 
import { useState, useMemo } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = () => {
    setUser(null);
    setLoading(false);
    setError(null);
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      error,
      setError,
      logout,
    }),
    [user, loading, error]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Add PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};
