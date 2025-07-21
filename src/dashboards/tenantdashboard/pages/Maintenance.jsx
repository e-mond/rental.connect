import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import Button from "../../../components/Button";
import TenantSkeleton from "../../../components/skeletons/TenantSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import tenantApi from "../../../api/tenant/tenantApi";

/**
 * Maintenance Component
 *
 * Displays a list of maintenance requests for the authenticated tenant.
 * Fetches data using tenantApi with a minimum 2-second skeleton loader for UX consistency.
 * Provides a responsive, accessible UI with dark mode support and structured error handling.
 */
const Maintenance = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches maintenance requests using tenantApi.
   */
  const fetchMaintenanceRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const data = await tenantApi.withRetry(
        tenantApi.fetchMaintenanceRequests,
        [token],
        3,
        2000
      );
      setRequests(data || []);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      if (err.message.includes("log in")) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setTimeout(() => navigate("/tenantlogin"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch maintenance requests on component mount
  useEffect(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        if (loading) setLoading(false); // Only set to false if still loading
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // Handle retry for errors
  const handleRetry = useCallback(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  // Render error state
  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen space-y-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {error}
        </p>
        <div className="flex gap-4">
          {!error.includes("log in") && (
            <Button
              variant="primary"
              onClick={handleRetry}
              className="text-sm sm:text-base flex items-center gap-2"
              aria-label="Retry loading maintenance requests"
            >
              Retry
            </Button>
          )}
          {error.includes("log in") && (
            <Button
              variant="secondary"
              onClick={() => navigate("/tenantlogin")}
              className="text-sm sm:text-base"
              aria-label="Go to login page"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-3 sm:p-4 lg:max-w-7xl lg:p-12">
        <TenantSkeleton
          layout="maintenance-list"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="1.5s"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-4 lg:max-w-7xl lg:p-12">
      <div
        className={`rounded-lg shadow-md p-4 sm:p-6 lg:p-10 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-10 gap-4">
          <h2
            className={`text-2xl font-bold text-center sm:text-left lg:text-4xl ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Maintenance Requests
          </h2>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/tenant/maintenance/submit")}
            className="text-sm sm:text-base w-full sm:w-auto"
            aria-label="Submit a new maintenance request"
          >
            Submit New Request
          </Button>
        </div>

        {requests.length === 0 ? (
          <div
            className="text-center py-4 sm:py-6"
            role="alert"
            aria-live="polite"
          >
            <p
              className={`text-sm sm:text-base lg:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No maintenance requests found.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {requests.map((request) => (
              <Link
                key={request.id}
                to={`/dashboard/tenant/maintenance/${request.id}`}
                className={`block p-4 sm:p-6 lg:p-8 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                aria-label={`View details for maintenance request: ${request.type}`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  {request.status === "Urgent" ? (
                    <AlertTriangle
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        darkMode ? "text-red-400" : "text-red-500"
                      }`}
                      aria-label="Urgent status"
                    />
                  ) : request.status === "In Progress" ? (
                    <Clock
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        darkMode ? "text-yellow-400" : "text-yellow-500"
                      }`}
                      aria-label="In Progress status"
                    />
                  ) : request.status === "Open" ? (
                    <CheckCircle
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        darkMode ? "text-teal-500" : "text-blue-500"
                      }`}
                      aria-label="Open status"
                    />
                  ) : (
                    <CheckCircle
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${
                        darkMode ? "text-green-400" : "text-green-500"
                      }`}
                      aria-label="Completed status"
                    />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-lg sm:text-xl lg:text-2xl font-semibold ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {request.type} - {request.address}
                    </h3>
                    <p
                      className={`text-sm sm:text-base lg:text-lg ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Status: {request.status}
                    </p>
                    {request.scheduledDate && (
                      <p
                        className={`text-sm sm:text-base lg:text-lg ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Scheduled for: {request.scheduledDate}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
