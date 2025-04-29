import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import Button from "../../../../components/Button";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import landlordApi from "../../../../api/landlordApi";
import { useDarkMode } from "../../../../context/DarkModeContext";

/**
 * NewMaintenanceRequest Component
 *
 * A form page for scheduling a new maintenance request, allowing the landlord to input details such as property,
 * request type, description, and scheduled date. Submits the request to the backend using react-query mutation
 * and provides a responsive, accessible interface. Includes error handling and navigation back to the maintenance list.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls via landlordApi.
 */
const NewMaintenanceRequest = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property: "",
    type: "",
    description: "",
    scheduledDate: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (newRequest) =>
      landlordApi.scheduleMaintenance(
        localStorage.getItem("token"),
        newRequest
      ),
    onSuccess: () => {
      navigate("/dashboard/landlord/maintenance");
    },
    onError: (err) => {
      setError(err.message || "Failed to schedule maintenance request.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.property || !formData.type || !formData.scheduledDate) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate(formData);
  };

  const handleBack = () => {
    navigate("/dashboard/landlord/maintenance");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md flex-1 mx-auto max-w-2xl ${
          darkMode
            ? "bg-gray-900 text-gray-200 shadow-gray-700"
            : "bg-white text-gray-800 shadow-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center text-sm sm:text-base"
            aria-label="Back to maintenance requests"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold">
            Schedule Maintenance
          </h2>
        </div>

        {error && (
          <ErrorDisplay
            error={error}
            className={darkMode ? "text-red-400" : "text-red-500"}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="property"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Property
            </label>
            <input
              type="text"
              id="property"
              name="property"
              value={formData.property}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              placeholder="Enter property address"
              aria-label="Property address"
              required
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Request Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              placeholder="e.g., Plumbing, Electrical"
              aria-label="Maintenance request type"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              placeholder="Describe the issue"
              aria-label="Maintenance request description"
              rows="4"
            />
          </div>

          <div>
            <label
              htmlFor="scheduledDate"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Scheduled Date
            </label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
              aria-label="Scheduled maintenance date"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              className="text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="text-sm sm:text-base flex items-center gap-2"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                "Submitting..."
              ) : (
                <>
                  <Check className="w-5 h-5" /> Schedule
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMaintenanceRequest;
