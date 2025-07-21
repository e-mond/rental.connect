import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  validateToken: async () => ({ success: false, data: null }),
  login: () => {},
  logout: () => {},
});

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

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("token")?.trim();
    if (!token) {
      console.log("[UserProvider] No token found in localStorage");
      return { success: false, data: null, error: "No token found" };
    }

    try {
      const decoded = jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate <= new Date()) {
        console.log("[UserProvider] Token expired:", decoded);
        localStorage.removeItem("token");
        return { success: false, data: null, error: "Token expired" };
      }

      const response = await fetch(`${BASE_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `User fetch failed, status: ${response.status}`;
        try {
          const errorData = await response.clone().json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }

        if (response.status === 400 || response.status === 401) {
          localStorage.removeItem("token");
          showToast("Authentication failed. Please log in again.");
          navigate("/signin");
        } else if (response.status === 404) {
          localStorage.removeItem("token");
          showToast("User not found. Please register or log in again.");
          navigate("/signin");
        } else {
          showToast("Failed to fetch user data. Please try again.");
        }

        return { success: false, data: null, error: errorMessage };
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          userId: data.id || "",
          customId: data.customId || "",
          username: data.email || "",
          role: data.role || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          fullName: data.fullName || "",
          phone: data.phoneNumber || "",
          profilePic: data.profilePic || "",
        },
      };
    } catch (error) {
      console.error("[UserProvider] Error during user fetch:", error.message);
      localStorage.removeItem("token");
      showToast("Authentication failed. Please try again.");
      navigate("/signin");
      return { success: false, data: null, error: error.message };
    }
  }, [navigate]);

  const login = async (token, expectedRole, isPostSignup = false) => {
    if (!token) {
      showToast("Invalid token. Please log in again.");
      navigate("/signin");
      return;
    }

    localStorage.setItem("token", token.trim());

    let actualRole = expectedRole;
    try {
      const decoded = jwtDecode(token);
      actualRole = decoded.role || expectedRole;
    } catch (err) {
      console.warn("[UserProvider] Failed to decode token for role:", err.message);
    }

    const response = await validateToken();
    if (response.success) {
      setUser(response.data);

      const userRole = response.data.role?.toUpperCase();
      const expected = actualRole?.toUpperCase();

      console.log(`[UserProvider] User role (from token): ${userRole}, Expected role: ${expected}`);

      if (expected && userRole !== expected) {
        localStorage.removeItem("token");
        setUser(null);
        showToast("Role mismatch. Please log in with the correct role.");
        navigate(expected === "LANDLORD" ? "/landlordlogin" : "/tenantlogin");
        return;
      }

      // Only redirect to dashboard for regular logins, not post-signup
      if (!isPostSignup) {
        if (userRole === "LANDLORD") {
          navigate("/dashboard/landlord", { replace: true });
        } else if (userRole === "TENANT") {
          navigate("/dashboard/tenant", { replace: true });
        } else {
          console.log("[UserProvider] Invalid user role");
          localStorage.removeItem("token");
          setUser(null);
          showToast("Invalid user role");
          navigate("/signin");
        }
      }
      // For post-signup, do not navigate; let the Signup component handle it
    } else {
      localStorage.removeItem("token");
      setUser(null);
      showToast(response.error || "Authentication failed. Please try again.");
      navigate(expectedRole === "LANDLORD" ? "/landlordlogin" : "/tenantlogin");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    showToast("Logged out successfully.");
    navigate("/signin");
  };

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
          if (response.error.includes("expired")) {
            showToast("Session expired. Please log in again.");
          } else if (response.error.includes("User not found")) {
            showToast("User not found. Please register or log in again.");
          } else if (!response.error.includes("No token")) {
            showToast("Authentication failed. Please log in again.");
          }
          navigate("/signin");
        }
      }
      setLoading(false);
    };
    initializeUser();
  }, [navigate, validateToken]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, validateToken, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserProvider, UserContext };