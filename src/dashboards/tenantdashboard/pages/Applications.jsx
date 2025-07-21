import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { FaHome, FaEye } from "react-icons/fa";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";

/**
 * Applications Component
 *
 * Displays a list of rental applications submitted by the tenant, including
 * property details, status, and actions to view properties. Handles token
 * validation, API requests, error states, and provides a user-friendly experience.
 */
const Applications = () => {
  const [applications, setApplications] = useState([]); // Store tenant applications
  const [properties, setProperties] = useState({}); // Map of property details by ID
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [propertyLoading, setPropertyLoading] = useState(false); // Loading state for property fetches
  const [error, setError] = useState(null); // Error message to display
  const [errorType, setErrorType] = useState(null); // Type of error (auth, network, server, unknown)
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  /**
   * Decodes a JWT token to extract its payload.
   * @param {string} token - The JWT token to decode.
   * @returns {Object|null} - The decoded payload or null if decoding fails.
   */
  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== "string" || !token.includes(".")) {
        console.error("Invalid token format:", token);
        return null;
      }
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        console.error("Token payload is missing");
        return null;
      }
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      console.log("Decoded token payload:", payload);
      return payload;
    } catch (err) {
      console.error("Error decoding token:", err.message);
      return null;
    }
  };

  /**
   * Fetches tenant applications and related property details using tenantApi.
   * Handles token validation, API errors, and sets appropriate states.
   */
  const fetchApplications = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        console.log("Token retrieved from localStorage:", token);

        // Validate token presence
        if (!token) {
          setError(
            "You are not logged in. Please log in to view your applications."
          );
          setErrorType("auth");
          toast.error("Please log in to view your applications.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
          return;
        }

        // Decode token for logging purposes
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          const expirationDate = new Date(decodedToken.exp * 1000);
          console.log("Token expiration:", expirationDate.toISOString());
          console.log("Current time:", new Date().toISOString());
        } else {
          console.warn(
            "Token could not be decoded, proceeding with API call to validate"
          );
        }

        toast.info("Fetching your applications...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Fetch tenant applications using tenantApi
        const data = await tenantApi.fetchApplications(
          token,
          controller.signal
        );
        console.log("Fetched applications:", data);
        setApplications(data);

        // Fetch property details for each application
        if (data.length > 0) {
          setPropertyLoading(true);
          const propertyIds = [...new Set(data.map((app) => app.propertyId))];
          const propertyPromises = propertyIds.map((id) =>
            tenantApi.fetchProperty(token, id, controller.signal)
          );
          const propertyData = await Promise.all(propertyPromises);
          const propertyMap = propertyData.reduce((acc, property) => {
            acc[property.id] = property;
            return acc;
          }, {});
          setProperties(propertyMap);
          setPropertyLoading(false);
        }
      } catch (err) {
        if (err.type === "cancelled") {
          console.log("Request was cancelled:", err.message);
          return;
        }
        console.error("Error fetching applications:", err.message);
        console.log("Error details:", {
          type: err.type,
          status: err.status,
          details: err.details,
        });

        setError(
          err.type === "auth"
            ? "Your session appears to be invalid. Please log in again to continue."
            : err.type === "network"
            ? "We’re having trouble connecting. Please check your network and try again."
            : err.type === "server"
            ? "The server is currently unavailable. Please try again later."
            : "An error occurred while fetching your applications. Please try again."
        );
        setErrorType(err.type || "unknown");
        toast.error(err.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        if (err.type === "auth") {
          localStorage.removeItem("token"); // Clear token on auth error
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
        } else {
          // For non-auth errors, keep the UI visible and allow retry
          setApplications([]); // Ensure UI shows "no applications" state
          setProperties({});
          setLoading(false);
        }
      } finally {
        if (!error || errorType !== "auth") {
          setLoading(false);
        }
      }
    },
    [navigate, error, errorType]
  );

  // Fetch applications on component mount with request cancellation
  useEffect(() => {
    const controller = new AbortController();
    fetchApplications(controller);
    return () => {
      controller.abort(); // Cancel requests on component unmount
    };
  }, [fetchApplications]);

  // Handle retry for network or server errors
  const handleRetry = () => {
    const controller = new AbortController();
    fetchApplications(controller);
  };

  // Loading state for initial fetch
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <h1
          className={`text-2xl font-bold mb-6 text-center lg:text-4xl lg:text-left lg:mb-8 ${
            darkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          Your Applications
        </h1>
        <div
          className={`rounded-lg shadow ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <GlobalSkeleton
            type="grid"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
            items={3}
          />
        </div>
      </div>
    );
  }

  // Render the UI even if there’s an error (except for auth errors, which redirect)
  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 lg:max-w-7xl lg:p-8">
      <h1
        className={`text-2xl font-bold mb-6 text-center lg:text-4xl lg:text-left lg:mb-8 ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Your Applications
      </h1>

      {error && errorType !== "auth" && (
        <div className="mb-6 text-center">
          <p
            className={`text-base lg:text-lg ${
              darkMode ? "text-red-400" : "text-red-500"
            }`}
          >
            {error}
          </p>
          {(errorType === "network" || errorType === "server") && (
            <Button
              variant="primary"
              onClick={handleRetry}
              className="mt-2 text-base lg:text-lg px-4 py-2"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`rounded-xl shadow-md p-4 transition-all duration-200 ${
                darkMode
                  ? "bg-gray-900 shadow-gray-700 hover:bg-gray-800"
                  : "bg-white shadow-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center mb-4">
                {propertyLoading ? (
                  <div
                    className={`animate-pulse w-16 h-16 rounded-lg mr-4 ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  />
                ) : properties[application.propertyId]?.primaryImageUrl ? (
                  <img
                    src={`${BASE_URL}${
                      properties[application.propertyId].primaryImageUrl
                    }`}
                    alt={
                      properties[application.propertyId]?.title || "Property"
                    }
                    className="w-16 h-16 rounded-lg mr-4 object-cover"
                  />
                ) : (
                  <div
                    className={`w-16 h-16 rounded-lg mr-4 flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <FaHome
                      className={`text-2xl ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                )}
                <div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {propertyLoading
                      ? "Loading..."
                      : properties[application.propertyId]?.title ||
                        "Unknown Property"}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      application.status === "Submitted"
                        ? darkMode
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                        : application.status === "Under Review"
                        ? darkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                        : application.status === "Approved"
                        ? darkMode
                          ? "bg-green-900 text-green-300"
                          : "bg-green-100 text-green-800"
                        : darkMode
                        ? "bg-red-900 text-red-300"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Move-In Date
                  </span>
                  <span
                    className={`ml-2 text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {application.moveInDate || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Occupants
                  </span>
                  <span
                    className={`ml-2 text-sm ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {application.occupants || "Not specified"}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      `/dashboard/tenant/property/${application.propertyId}`
                    )
                  }
                  className="w-full text-sm flex items-center justify-center transition-all duration-200 hover:bg-gray-600 dark:hover:bg-gray-700"
                >
                  <FaEye className="mr-2" />
                  View Property
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`rounded-xl shadow-md p-6 text-center ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
          role="alert"
          aria-live="polite"
        >
          <FaHome
            className={`text-4xl mx-auto mb-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p
            className={`mb-4 text-base lg:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            You haven’t applied to any properties yet. Start your journey by
            finding the perfect place!
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/tenant/search")}
            className="text-base lg:text-lg px-6 py-3 hover:shadow-md transition-all duration-200"
          >
            Search for Properties
          </Button>
        </div>
      )}
    </div>
  );
};

export default Applications;
