import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CheckCircle } from "lucide-react"; // Removed AlertTriangle
import Button from "../../../components/Button";
import { useDarkMode } from "../../../context/DarkModeContext";
import tenantApi from "../../../api/tenant/tenantApi";
import "react-toastify/dist/ReactToastify.css";

/**
 * SubmitMaintenanceRequest Component
 *
 * Allows tenants to submit a new maintenance request.
 * Includes fields for type, details, and address, with validation and toast notifications.
 * Uses tenantApi to submit the request, with structured error handling and dark mode support.
 */
const SubmitMaintenanceRequest = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    type: "",
    details: "",
    address: "",
    status: "Open", // Default status for a new request
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  /**
   * Handles form input changes.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Submits the maintenance request using tenantApi.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setIsSubmitting(true);

    const { type, details, address } = formData;
    if (!type.trim() || !details.trim() || !address.trim()) {
      setError("Please fill in all required fields.");
      setErrorType("validation");
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "You are not logged in. Please log in to submit a maintenance request."
        );
        setErrorType("auth");
        toast.error("Please log in to submit a maintenance request.", {
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

      toast.info("Submitting maintenance request...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const controller = new AbortController();
      const submittedRequest = await tenantApi.withRetry(
        tenantApi.submitMaintenanceRequest,
        [token, formData, controller.signal],
        3,
        2000
      );
      console.log("Submitted maintenance request:", submittedRequest);

      toast.success("Maintenance request submitted successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/dashboard/tenant/maintenance");
      }, 2000);
    } catch (err) {
      if (err.type === "cancelled") {
        console.log("Submit request was cancelled:", err.message);
        return;
      }
      console.error("Error submitting maintenance request:", err.message);
      setError(
        err.type === "auth"
          ? "Your session appears to be invalid. Please log in again to continue."
          : err.type === "network"
          ? "We’re having trouble connecting. Please check your network and try again."
          : err.type === "server"
          ? "The server is currently unavailable. Please try again later."
          : "An error occurred while submitting the maintenance request. Please try again."
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render error state with login option
  if (error && (errorType === "auth" || !localStorage.getItem("token"))) {
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
          {error}
        </p>
        <Button
          variant="secondary"
          onClick={() => navigate("/tenantlogin")}
          className="text-sm sm:text-base"
          aria-label="Go to login page"
        >
          Log In
        </Button>
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
            Submit a Maintenance Request
          </h2>
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/tenant/maintenance")}
            className="text-sm sm:text-base w-full sm:w-auto"
            aria-label="Go back to maintenance requests"
          >
            Back to Requests
          </Button>
        </div>

        {error && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
            }`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <CheckCircle
              className={`w-8 h-8 ${
                darkMode ? "text-teal-500" : "text-blue-500"
              }`}
              aria-label="New request status"
            />
            <div className="flex-1">
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Request Type (e.g., Plumbing Issue)"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                  darkMode
                    ? "border-gray-600 bg-gray-800 text-gray-200"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
                aria-label="Maintenance request type"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base min-h-[100px] ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              aria-label="Maintenance request details"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Property Address"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              aria-label="Property address"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="text-sm sm:text-base flex items-center gap-2"
              aria-label="Submit maintenance request"
            >
              {isSubmitting ? (
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
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/tenant/maintenance")}
              className="text-sm sm:text-base"
              aria-label="Cancel submission"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitMaintenanceRequest;
