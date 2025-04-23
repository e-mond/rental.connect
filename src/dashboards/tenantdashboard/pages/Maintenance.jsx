import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiTool, FiSend } from "react-icons/fi";
import Button from "../../../components/Button";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { BASE_URL } from "../../../config";
import { useDarkMode } from "../../../context/DarkModeContext";
import { UserContext } from "../../../context/UserContext";

/**
 * TenantMaintenance Component
 *
 * Allows tenants to submit maintenance requests and view their submitted requests.
 * Uses UserContext for authentication status, ensures UI remains interactive,
 * and provides clear error feedback for better UX.
 */
const TenantMaintenance = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const { user } = useContext(UserContext); // Access user from UserContext

  // Form state
  const [formData, setFormData] = useState({
    type: "",
    details: "",
  });

  // Requests state
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Get token
  const token = localStorage.getItem("token");

  /**
   * Fetches maintenance requests from the backend.
   */
  const fetchMaintenanceRequests = useCallback(
    async (isBackground = false) => {
      if (!user || !token) return; // Skip if not authenticated

      try {
        if (!isBackground) {
          setRequestsLoading(true);
        }
        setRequestsError("");

        const response = await fetch(
          `${BASE_URL}/api/tenant/maintenance-requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch maintenance requests: ${
              errorText || "Unknown error"
            } (HTTP ${response.status})`
          );
        }

        const data = await response.json();
        setMaintenanceRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch maintenance requests:", err);
        setRequestsError(
          "Unable to load your maintenance requests. You can still submit a new request or try again later."
        );
      } finally {
        if (!isBackground) {
          setRequestsLoading(false);
        }
      }
    },
    [user, token]
  );

  /**
   * Handles form input changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitSuccess("");
  };

  /**
   * Submits a new maintenance request.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess("");
    setRequestsError("");

    try {
      if (!token || !user) {
        setRequestsError("Please log in to submit a maintenance request.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/tenant/maintenance-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to submit maintenance request: ${
            errorText || "Unknown error"
          } (HTTP ${response.status})`
        );
      }

      setSubmitSuccess("Maintenance request submitted successfully!");
      setFormData({ type: "", details: "" });
      fetchMaintenanceRequests(true);
    } catch (err) {
      console.error("Error submitting maintenance request:", err);
      setRequestsError(
        "Failed to submit maintenance request. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handles cancel action.
   */
  const handleCancel = () => {
    setFormData({ type: "", details: "" });
    setSubmitSuccess("");
    navigate("/dashboard/tenant/maintenance");
  };

  // Fetch requests when user is authenticated
  useEffect(() => {
    if (user) {
      fetchMaintenanceRequests();
    }
  }, [user, fetchMaintenanceRequests]);

  // Background fetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && token) {
        fetchMaintenanceRequests(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, token, fetchMaintenanceRequests]);

  // Check if user is not authenticated
  if (!user) {
    return (
      <div
        className={`max-w-2xl mx-auto p-4 sm:p-6 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
        } min-h-screen lg:max-w-6xl flex flex-col items-center justify-center`}
      >
        <div
          className={`p-4 rounded-lg text-center ${
            darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700"
          } animate-fade-in`}
        >
          <p className="text-sm sm:text-base mb-4">
            Please log in to access maintenance requests.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/tenantlogin")}
            className="flex items-center gap-2 text-sm sm:text-base"
            aria-label="Log in"
          >
            <FiTool className="w-5 h-5" />
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-2xl mx-auto p-4 sm:p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
      } min-h-screen lg:max-w-6xl`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left animate-fade-in">
        Maintenance Requests
      </h1>

      {/* Feedback Messages */}
      {(requestsError || submitSuccess) && (
        <div
          className={`mb-6 p-3 rounded-lg text-center text-sm animate-fade-in ${
            requestsError
              ? darkMode
                ? "bg-red-900 text-red-300"
                : "bg-red-100 text-red-700"
              : darkMode
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-700"
          }`}
        >
          {requestsError || submitSuccess}
          {requestsError && (
            <Button
              variant="secondary"
              onClick={() => fetchMaintenanceRequests()}
              className="ml-3 text-xs"
              aria-label="Retry fetching maintenance requests"
            >
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Form Section */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md mb-8 animate-slide-up ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
          <FiTool className="w-6 h-6" />
          Submit a Maintenance Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="type"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Maintenance Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="e.g., Plumbing Issue"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="details"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } mb-1`}
            >
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              className={`w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="e.g., Leaking pipe in bathroom"
              rows="5"
              required
              aria-required="true"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              type="submit"
              className="flex items-center justify-center gap-2 text-sm sm:text-base"
              disabled={
                submitting || !formData.type.trim() || !formData.details.trim()
              }
              aria-label="Submit maintenance request"
            >
              {submitting ? (
                <div
                  className={`animate-spin h-5 w-5 border-4 border-t-transparent rounded-full ${
                    darkMode ? "border-teal-200" : "border-white"
                  }`}
                ></div>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              className="text-sm sm:text-base"
              disabled={submitting}
              aria-label="Cancel maintenance request"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Maintenance Requests List */}
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md animate-slide-up delay-100 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Your Maintenance Requests
        </h2>
        {requestsLoading ? (
          <GlobalSkeleton
            type="list"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        ) : maintenanceRequests.length > 0 ? (
          <ul className="space-y-4">
            {maintenanceRequests.map((request) => (
              <li
                key={request.id}
                className={`p-4 border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 hover:bg-gray-750 shadow-gray-700"
                    : "border-gray-200 bg-white hover:bg-gray-50 shadow-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {request.type}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {request.details}
                    </p>
                    <p
                      className={`text-xs sm:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Submitted:{" "}
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${
                      request.status === "Open"
                        ? darkMode
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                        : request.status === "In Progress"
                        ? darkMode
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                        : darkMode
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className={`text-center py-6 rounded-lg ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <FiTool className="mx-auto w-12 h-12 mb-3 opacity-50" />
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              You haven’t submitted any maintenance requests yet.
            </p>
            <p
              className={`text-xs sm:text-sm mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Need help? Submit a request above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantMaintenance;
