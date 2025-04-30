// Provides user authentication context and handles token validation, login, and logout

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";

// Create the UserContext to share user state across the app
const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  validateToken: async () => ({ success: false, data: null }),
  login: () => {},
  logout: () => {},
});

// Rate-limit toast notifications to avoid spamming the user
const toastId = "auth-error";
const showToast = (message) => {
  if (!toast.isActive(toastId)) {
    toast.error(message, {
      toastId,
      position: "top-right",
      autoClose: 3000,
    });
  }
};

/**
 * UserProvider component to manage user state and authentication.
 * Provides user context to the app, including user data, loading state, and authentication functions.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the provider
 */
const UserProvider = ({ children }) => {
  // State for the current user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Validates the JWT token by checking expiration and making a server request to /api/auth/welcome.
   * @returns {Promise<Object>} - Result of the token validation
   */
  const validateToken = async () => {
    const token = localStorage.getItem("token")?.trim();
    // Check if token exists in localStorage
    if (!token) {
      if (import.meta.env.MODE !== "production") {
        console.log("[UserProvider] No token found in localStorage");
      }
      return { success: false, data: null, error: "No token found" };
    }

    try {
      // Check token expiration client-side
      const decoded = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate <= new Date()) {
        if (import.meta.env.MODE !== "production") {
          console.log("[UserProvider] Token expired:", decoded);
        }
        return { success: false, data: null, error: "Token expired" };
      }

      if (import.meta.env.MODE !== "production") {
        console.log("[UserProvider] Token payload:", decoded);
      }

      // Validate token with the server by calling /api/auth/welcome
      const response = await fetch(`${BASE_URL}/api/auth/welcome`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Log the raw response status and headers for debugging
      if (import.meta.env.MODE !== "production") {
        console.log("[UserProvider] Raw response status:", response.status);
        console.log("[UserProvider] Response headers:", [
          ...response.headers.entries(),
        ]);
      }

      // Handle failed validation (e.g., 401, 404)
      if (!response.ok) {
        const responseText = await response.text();
        if (import.meta.env.MODE !== "production") {
          console.log(
            "[UserProvider] Token validation failed with status:",
            response.status,
            "Response:",
            responseText
          );
        }
        return {
          success: false,
          data: null,
          error: `Token validation failed, status: ${response.status}`,
        };
      }

      // Parse the response and map it to the user state format
      const data = await response.json();
      return {
        success: true,
        data: {
          userId: data.userId || "",
          username: data.username || "",
          role: data.role || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          fullName:
            data.fullName ||
            `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
            "",
        },
      };
    } catch (error) {
      if (import.meta.env.MODE !== "production") {
        console.error(
          "[UserProvider] Error during token validation INTEGRAL:",
          error
        );
      }
      return { success: false, data: null, error: error.message };
    }
  };

  /**
   * Logs the user in by storing the token in localStorage and validating it.
   * Updates the user state if the token is valid, otherwise logs the user out.
   * @param {string} token - The JWT token received from the server
   */
  const login = (token) => {
    localStorage.setItem("token", token?.trim());
    validateToken().then((response) => {
      if (response.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        showToast("Authentication failed. Please log in again.");
        navigate("/landlordlogin");
      }
    });
  };

  /**
   * Logs the user out by clearing the token and user state.
   * Redirects to the login page.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    showToast("You have been logged out.");
    navigate("/landlordlogin");
  };

  // Initialize user state on mount by validating any existing token
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await validateToken();
        if (response.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem("token");
          setUser(null);
          if (
            response.error.includes("Token expired") ||
            response.error.includes("401")
          ) {
            showToast("Session expired. Please log in again.");
            navigate("/landlordlogin");
          } else if (response.error.includes("No token found")) {
            // Skip toast for initial load with no token
          } else {
            showToast("Authentication failed. Please log in again.");
            navigate("/landlordlogin");
          }
          if (import.meta.env.MODE !== "production") {
            console.log(
              "[UserProvider] Token validation failed on init:",
              response.error
            );
          }
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, [navigate]);

  // Provide the user context to children components
  return (
    <UserContext.Provider
      value={{ user, setUser, loading, validateToken, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// PropTypes validation for the children prop
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider, UserContext };
