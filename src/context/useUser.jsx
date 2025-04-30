
import { useContext } from "react";
import { UserContext } from "./UserProvider";

export const useUser = () => {
  const context = useContext(UserContext);
  // If context is undefined, return a fallback to prevent errors during initial render
  return context || {
    user: null,
    setUser: () => {},
    loading: true,
    validateToken: async () => ({ success: false, data: null }),
    login: () => {},
    logout: () => {},
  };
};