import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/Button";
import { useDarkMode } from "../../../context/DarkModeContext";
import { useState, useEffect } from "react";
import useScheduleApi from "../../../api/tenant/ScheduleApi";

const ScheduleViewing = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const { state } = location;
  const propertyId = state?.propertyId || "";
  const viewingId = state?.viewingId || null;

  const [viewingDate, setViewingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [viewings, setViewings] = useState([]);
  const [notification, setNotification] = useState("");

  const { error, scheduleViewing, rescheduleViewing, cancelViewing } =
    useScheduleApi({
      propertyId,
      viewingId,
      viewingDate,
      notes,
      isImportant,
      onScheduleSuccess: (message) => {
        setNotification({ type: "success", message });
        setTimeout(() => navigate("/dashboard/tenant"), 1000); // Shortened to 1s
      },
      onRescheduleSuccess: (message) => {
        setNotification({ type: "success", message });
        setTimeout(() => navigate("/dashboard/tenant"), 1000);
      },
      onCancelSuccess: (message) => {
        setNotification({ type: "success", message });
        setViewings(viewings.filter((v) => v.id !== viewingId));
        setTimeout(() => navigate("/dashboard/tenant"), 1000);
      },
      onViewingsFetch: (data) => {
        const fetchedViewings = data?.viewings || [];
        setViewings(Array.isArray(fetchedViewings) ? fetchedViewings : []);
      },
    });

  useEffect(() => {
    if (viewingId) {
      setNotification({ type: "info", message: "Loading viewing details..." });
    }
  }, [viewingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewingId) {
      rescheduleViewing();
    } else {
      scheduleViewing();
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : notification.type === "error"
                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            }`}
          >
            {notification.message}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-lg mb-6 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
            {error}
          </div>
        )}

        {/* Form Section */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h1
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {viewingId ? "Reschedule or Cancel Viewing" : "Schedule a Viewing"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="propertyId" value={propertyId} />
            <div>
              <label
                htmlFor="viewingDate"
                className="block text-sm font-medium mb-2"
              >
                Select Date and Time
              </label>
              <input
                type="datetime-local"
                id="viewingDate"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-blue-500`}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
              {!viewingDate && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a date and time.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:ring-2 focus:ring-blue-500`}
                placeholder="Add any notes about the viewing (e.g., special requests)"
                rows="4"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className={`h-4 w-4 ${
                  darkMode ? "accent-blue-400" : "accent-blue-600"
                }`}
              />
              <label htmlFor="important" className="ml-2 text-sm">
                Mark as Important
              </label>
            </div>
            <div className="flex gap-4">
              <Button type="submit" variant="primary" className="px-6 py-3">
                {viewingId ? "Reschedule Viewing" : "Schedule Viewing"}
              </Button>
              {viewingId && (
                <Button
                  variant="danger"
                  onClick={() => cancelViewing()}
                  className="px-6 py-3"
                >
                  Cancel Viewing
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="px-6 py-3"
              >
                Back
              </Button>
            </div>
          </form>
        </div>

        {/* Scheduled Viewings Section */}
        <div
          className={`mt-8 p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Your Scheduled Viewings
          </h2>
          {viewings.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No scheduled viewings.
            </p>
          ) : (
            <div className="grid gap-4">
              {viewings.map((viewing) => (
                <div
                  key={viewing.id}
                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        <strong>Property ID:</strong> {viewing.propertyId}
                      </p>
                      <p className="text-sm">
                        <strong>Date:</strong>{" "}
                        {new Date(viewing.viewingDate).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>Status:</strong> {viewing.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <strong>Notes:</strong> {viewing.notes || "None"}
                      </p>
                      <p className="text-sm">
                        <strong>Important:</strong>{" "}
                        {viewing.important ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() =>
                        navigate(`/dashboard/tenant/scheduleviewing`, {
                          state: {
                            viewingId: viewing.id,
                            propertyId: viewing.propertyId,
                          },
                        })
                      }
                      className="px-4 py-2 text-sm"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => cancelViewing(viewing.id)}
                      className="px-4 py-2 text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewing;
