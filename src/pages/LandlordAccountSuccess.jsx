import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GlobalSkeleton from "../components/GlobalSkeleton";
import ErrorDisplay from "../components/ErrorDisplay";
import Button from "../components/Button";
import { FaHome, FaCreditCard, FaUsers } from "react-icons/fa";
import { BASE_URL } from "../config";
import { useDarkMode } from "../hooks/useDarkMode";


/**
 * LandlordSuccess Component
 *
 * Displays a welcome message and next steps after a landlord successfully creates an account.
 * Validates the user's token via an API call and redirects to login if invalid.
 * Features a skeleton loader with a minimum 2-second display and error handling for token validation.
 */
const LandlordSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode(); // Access dark mode state

  // Validate token using react-query
  const { error, isLoading: validationLoading } = useQuery({
    queryKey: ["validateLandlordToken"],
    queryFn: () =>
      fetch(`${BASE_URL}/api/auth/welcome`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Token validation failed: HTTP ${response.status}`);
        }
        return response.text();
      }),
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!validationLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [validationLoading]);

  // Handle token validation and redirection
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      console.log("No token found, redirecting to login");
      navigate("/landlordlogin");
    } else if (error) {
      console.error("Token validation error:", error.message);
      if (error.message.includes("Failed to fetch")) {
        console.error(
          "Possible CORS or network issue. Check server configuration."
        );
      }
      localStorage.removeItem("token");
      navigate("/landlordlogin");
    }
  }, [navigate, error]);

  if (loading) {
    return (
      <div
        className={`flex h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="welcome"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <div className="p-6 w-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={error.message}
              className={darkMode ? "text-gray-200" : "text-gray-800"}
            />
            <Link to="/landlordlogin">
              <Button
                variant="primary"
                className="px-4 py-2 text-sm sm:text-base"
              >
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center min-h-screen p-6 ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-br from-blue-50 to-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-3xl p-6 rounded-xl shadow-xl mb-10 animate-fadeIn ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
              darkMode
                ? "bg-green-600 text-gray-200"
                : "bg-green-500 text-white"
            }`}
          >
            ✓
          </span>
          Account Created Successfully!
        </h2>
        <p
          className={`text-gray-600 mt-2 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Congratulations! Your landlord account is now active and ready to use.
        </p>
        <div className="mt-6 flex gap-4">
          <Button
            variant="primary"
            as={Link}
            to="/dashboard/landlord"
            className="px-6 py-3 shadow-md"
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/dashboard/landlord/properties"
            className="px-6 py-3 shadow-md"
            aria-label="Add More Properties"
          >
            Add More Properties
          </Button>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-6">Next Steps</h3>
        <div className="flex flex-col gap-6">
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaHome size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Add Property Details</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Upload photos and set rental terms to attract tenants.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaCreditCard size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Set Up Payment Methods</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Configure secure payment options to receive rent directly.
              </p>
            </div>
          </div>
          <div
            className={`flex items-start gap-6 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
              darkMode
                ? "bg-gray-900 shadow-gray-700 hover:shadow-gray-600"
                : "bg-white shadow-gray-200 hover:shadow-gray-300"
            }`}
          >
            <div
              className={`p-4 rounded-full ${
                darkMode
                  ? "bg-blue-900 text-blue-300"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <FaUsers size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium">Invite Tenants</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Easily connect and manage your existing or new tenants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordSuccess;
