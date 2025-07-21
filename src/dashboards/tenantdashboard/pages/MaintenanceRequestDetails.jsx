import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Edit2,
  XCircle,
  Save,
} from "lucide-react";
import Button from "../../../components/Button";
import TenantSkeleton from "../../../components/skeletons/TenantSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import tenantApi from "../../../api/tenantApi";
import "react-toastify/dist/ReactToastify.css";

/**
 * MaintenanceRequestDetails Component
 *
 * Displays the details of a single maintenance request for the authenticated tenant.
 * Allows editing of the request's type and details, and cancellation of the request if it's in "Open" or "In Progress" status.
 * Fetches and updates data using tenantApi with a minimum 2-second skeleton loader for UX consistency.
 * Provides a responsive, accessible UI with dark mode support, structured error handling, and toast notifications.
 */
const MaintenanceRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ type: "", details: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  /**
   * Fetches the maintenance request by ID using tenantApi.
   */
  const fetchMaintenanceRequest = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const token = localStorage.getItem("token");
        console.log("Token retrieved from localStorage:", token);

        if (!token) {
          setError(
            "You are not logged in. Please log in to view this maintenance request."
          );
          setErrorType("auth");
          toast.error("Please log in to view this maintenance request.", {
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

        toast.info("Fetching maintenance request details...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const data = await tenantApi.withRetry(
          tenantApi.fetchMaintenanceRequestById,
          [token, id, controller.signal],
          3, // maxRetries
          2000 // delay between retries
        );
        console.log("Fetched maintenance request:", data);
        setRequest(data);
        setEditForm({ type: data.type, details: data.details });
      } catch (err) {
        if (err.type === "cancelled") {
          console.log("Request was cancelled:", err.message);
          return;
        }
        console.error("Error fetching maintenance request:", err.message);
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
            : "An error occurred while fetching the maintenance request. Please try again."
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
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/tenantlogin");
          }, 2000);
        } else {
          setRequest(null);
          setLoading(false);
        }
      }
    },
    [id, navigate]
  );

  /**
   * Updates the maintenance request using tenantApi.
   */
  const handleUpdateRequest = async () => {
    try {
      setUpdateLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in to continue.");
        setErrorType("auth");
        toast.error("Please log in to continue.", {
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

      if (!editForm.type.trim() || !editForm.details.trim()) {
        toast.error("Type and details are required.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      toast.info("Updating maintenance request...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const controller = new AbortController();
      const updatedData = await tenantApi.withRetry(
        tenantApi.updateMaintenanceRequest,
        [
          token,
          id,
          { type: editForm.type, details: editForm.details },
          controller.signal,
        ],
        3,
        2000
      );
      console.log("Updated maintenance request:", updatedData);
      setRequest(updatedData);
      setIsEditing(false);
      toast.success("Maintenance request updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      if (err.type === "cancelled") {
        console.log("Update request was cancelled:", err.message);
        return;
      }
      console.error("Error updating maintenance request:", err.message);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      if (err.type === "auth") {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  /**
   * Cancels the maintenance request using tenantApi.
   */
  const handleCancelRequest = async () => {
    try {
      setCancelLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in to continue.");
        setErrorType("auth");
        toast.error("Please log in to continue.", {
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

      toast.info("Cancelling maintenance request...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const controller = new AbortController();
      await tenantApi.withRetry(
        tenantApi.cancelMaintenanceRequest,
        [token, id, controller.signal],
        3,
        2000
      );
      toast.success("Maintenance request cancelled successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/dashboard/tenant/maintenance");
    } catch (err) {
      if (err.type === "cancelled") {
        console.log("Cancel request was cancelled:", err.message);
        return;
      }
      console.error("Error cancelling maintenance request:", err.message);
      toast.error(err.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      if (err.type === "auth") {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/tenantlogin");
        }, 2000);
      }
    } finally {
      setCancelLoading(false);
    }
  };

  // Fetch maintenance request on component mount with request cancellation
  useEffect(() => {
    const controller = new AbortController();
    fetchMaintenanceRequest(controller);
    return () => {
      controller.abort();
    };
  }, [fetchMaintenanceRequest]);

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Handle retry for network or server errors
  const handleRetry = useCallback(() => {
    const controller = new AbortController();
    fetchMaintenanceRequest(controller);
  }, [fetchMaintenanceRequest]);

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Render error state with retry and login options
  if (error || !localStorage.getItem("token")) {
    const errorMessage = error ? error : "No token found. Please log in.";
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen space-y-4 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <ToastContainer />
        <p
          className={`text-sm sm:text-base ${
            darkMode ? "text-red-400" : "text-red-500"
          }`}
        >
          {errorMessage}
        </p>
        <div className="flex gap-4">
          {(errorType === "network" || errorType === "server") && (
            <Button
              variant="primary"
              onClick={handleRetry}
              className="text-sm sm:text-base flex items-center gap-2"
              disabled={loading}
              aria-label="Retry loading maintenance request"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Retrying...
                </>
              ) : (
                "Retry"
              )}
            </Button>
          )}
          {errorMessage.includes("log in") && (
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
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <TenantSkeleton
          layout="maintenance-details"
          bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
          animationSpeed="1.5s"
        />
      </div>
    );
  }

  // Render not found state
  if (!request) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
        <ToastContainer />
        <div
          className={`rounded-lg shadow-md p-4 sm:p-6 ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <div className="text-center py-4" role="alert" aria-live="polite">
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Maintenance request not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:max-w-6xl lg:p-8">
      <ToastContainer />
      <div
        className={`rounded-lg shadow-md p-4 sm:p-6 ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h2
            className={`text-2xl font-bold text-center sm:text-left lg:text-4xl ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Maintenance Request Details
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/tenant/maintenance")}
              className="text-sm sm:text-base w-full sm:w-auto"
              aria-label="Go back to maintenance requests"
            >
              Back to Requests
            </Button>
            {(request.status === "Open" ||
              request.status === "In Progress") && (
              <>
                {!isEditing && (
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    className="text-sm sm:text-base w-full sm:w-auto flex items-center gap-2"
                    aria-label="Edit maintenance request"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Request
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={handleCancelRequest}
                  disabled={cancelLoading}
                  className="text-sm sm:text-base w-full sm:w-auto flex items-center gap-2"
                  aria-label="Cancel maintenance request"
                >
                  {cancelLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Cancel Request
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {request.status === "Urgent" ? (
              <AlertTriangle
                className={`w-8 h-8 ${
                  darkMode ? "text-red-400" : "text-red-500"
                }`}
                aria-label="Urgent status"
              />
            ) : request.status === "In Progress" ? (
              <Clock
                className={`w-8 h-8 ${
                  darkMode ? "text-yellow-400" : "text-yellow-500"
                }`}
                aria-label="In Progress status"
              />
            ) : request.status === "Open" ? (
              <CheckCircle
                className={`w-8 h-8 ${
                  darkMode ? "text-teal-500" : "text-blue-500"
                }`}
                aria-label="Open status"
              />
            ) : (
              <CheckCircle
                className={`w-8 h-8 ${
                  darkMode ? "text-green-400" : "text-green-500"
                }`}
                aria-label="Completed status"
              />
            )}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-gray-200"
                      : "border-gray-300 bg-white text-gray-800"
                  }`}
                  aria-label="Edit maintenance request type"
                />
              ) : (
                <h3
                  className={`text-lg sm:text-xl font-semibold ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {request.type} - {request.address}
                </h3>
              )}
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Status: {request.status}
              </p>
            </div>
          </div>
          <div>
            {isEditing ? (
              <textarea
                name="details"
                value={editForm.details}
                onChange={handleEditChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base min-h-[100px] ${
                  darkMode
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
                aria-label="Edit maintenance request details"
              />
            ) : (
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <strong>Details:</strong> {request.details}
              </p>
            )}
            {request.scheduledDate && (
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <strong>Scheduled for:</strong> {request.scheduledDate}
              </p>
            )}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleUpdateRequest}
                disabled={updateLoading}
                className="text-sm sm:text-base flex items-center gap-2"
                aria-label="Save changes to maintenance request"
              >
                {updateLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({ type: request.type, details: request.details });
                }}
                className="text-sm sm:text-base"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetails;
