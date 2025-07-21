import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import Button from "../../../../components/Button";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import { useDarkMode } from "../../../../context/DarkModeContext";
import landlordApi from "../../../../api/landlord/landlordApi";

/**
 * NewMessage Component
 *
 * A form page for composing a new message, allowing the landlord to input recipient, subject, and message body.
 * Submits the message to the backend using react-query mutation and provides navigation back to the messages list.
 * Features:
 * - Dark mode support for consistent UI theming.
 * - Uses the Button component for consistent button styling.
 * - Verifies BASE_URL usage in API calls.
 */
const NewMessage = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state

  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    body: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (newMessage) =>
      landlordApi.sendMessage(localStorage.getItem("token"), newMessage),
    onSuccess: () => {
      navigate("/dashboard/landlord/messages");
    },
    onError: (err) => {
      setError(err.message || "Failed to send message.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipient || !formData.subject || !formData.body) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate(formData);
  };

  const handleBack = () => {
    navigate("/dashboard/landlord/messages");
  };

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`p-4 sm:p-6 rounded-lg shadow-md flex-1 mx-auto max-w-2xl ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex items-center text-sm sm:text-base"
            aria-label="Back to messages"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold">New Message</h2>
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
              htmlFor="recipient"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Recipient
            </label>
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter recipient name or email"
              aria-label="Recipient"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter subject"
              aria-label="Subject"
              required
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Message
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Enter message body"
              aria-label="Message body"
              rows="6"
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
              className="flex items-center gap-2 text-sm sm:text-base"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMessage;
