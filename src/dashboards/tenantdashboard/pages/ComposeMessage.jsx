import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";
import { FaHome, FaUser, FaPaperPlane, FaTimes } from "react-icons/fa";

const ComposeMessage = () => {
  const [properties, setProperties] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const fetchProperties = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("You are not logged in.");
          setErrorType("auth");
          toast.error("Please log in.", { autoClose: 2000 });
          setTimeout(() => navigate("/tenantlogin"), 2000);
          return;
        }

        const data = await tenantApi.fetchProperties(token, controller.signal);
        setProperties(data);
      } catch (err) {
        if (err.type === "cancelled") return;

        setError(
          err.type === "auth"
            ? "Invalid session. Please log in."
            : err.type === "network"
            ? "Connection issue. Try again."
            : err.type === "server"
            ? "Server unavailable. Try later."
            : "Error fetching properties."
        );
        setErrorType(err.type || "unknown");
        toast.error(err.message, { autoClose: 2000 });

        if (err.type === "auth") {
          localStorage.removeItem("token");
          setTimeout(() => navigate("/tenantlogin"), 2000);
        } else {
          setProperties([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchProperties(controller);
    return () => controller.abort();
  }, [fetchProperties]);

  useEffect(() => {
    if (selectedProperty) {
      const property = properties.find((p) => p.id === selectedProperty);
      if (property?.landlordId) {
        setRecipients([
          {
            id: property.landlordId,
            name: property.landlordName || "Landlord",
          },
        ]);
        setSelectedRecipient(property.landlordId);
      } else {
        setRecipients([]);
        setSelectedRecipient("");
      }
    } else {
      setRecipients([]);
      setSelectedRecipient("");
    }
  }, [selectedProperty, properties]);

  const handleSendMessage = async () => {
    if (!selectedProperty || !selectedRecipient || !content.trim()) {
      toast.error("Select a property, recipient, and enter a message.");
      return;
    }

    try {
      setSending(true);
      setError(null);
      setErrorType(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        setErrorType("auth");
        toast.error("Please log in.");
        setTimeout(() => navigate("/tenantlogin"), 2000);
        return;
      }

      const messageData = {
        recipientId: selectedRecipient,
        propertyId: selectedProperty,
        content: content.trim(),
      };

      const controller = new AbortController();
      await tenantApi.sendMessage(token, messageData, controller.signal);
      toast.success("Message sent!");
      setTimeout(() => navigate("/dashboard/tenant/messages"), 2000);
    } catch (err) {
      if (err.type === "cancelled") return;
      setError("Failed to send message. Please try again.");
      toast.error(err.message || "Send failed.");
      if (err.type === "auth") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/tenantlogin"), 2000);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar: Property Selection (Visible on larger screens) */}
      <div
        className={`w-full lg:w-1/3 border-r ${
          darkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-gray-50"
        } overflow-y-auto`}
      >
        <div className="p-4">
          <h1
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Select Property
          </h1>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse h-12 w-full rounded-lg bg-gray-300 dark:bg-gray-700"
                />
              ))}
            </div>
          ) : (
            <>
              {error && errorType !== "auth" && (
                <div className="mb-4 text-center">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  >
                    {error}
                  </p>
                </div>
              )}
              {properties.length > 0 ? (
                <div className="space-y-2">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer ${
                        selectedProperty === property.id
                          ? darkMode
                            ? "bg-gray-700"
                            : "bg-gray-200"
                          : ""
                      } ${
                        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                      } transition-colors duration-200`}
                      onClick={() => setSelectedProperty(property.id)}
                    >
                      <FaHome
                        className={`w-5 h-5 mr-3 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {property.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } text-center`}
                >
                  No properties available.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Area: Compose Message */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <h1
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Compose Message
          </h1>

          {loading ? (
            <div className="animate-pulse h-8 w-1/2 rounded mb-6 bg-gray-300 dark:bg-gray-700" />
          ) : (
            <div
              className={`rounded-xl shadow-md p-6 ${
                darkMode
                  ? "bg-gray-900 shadow-gray-700"
                  : "bg-white shadow-gray-200"
              } animate-fadeIn`}
            >
              {/* Property Selection (Visible on smaller screens) */}
              <div className="lg:hidden mb-6">
                <label
                  htmlFor="property"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Select Property
                </label>
                <div className="relative">
                  <FaHome
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <select
                    id="property"
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg border text-sm ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={sending}
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipient Selection */}
              <div className="mb-6">
                <label
                  htmlFor="recipient"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Recipient
                </label>
                <div className="relative">
                  <FaUser
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <select
                    id="recipient"
                    value={selectedRecipient}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg border text-sm ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={!selectedProperty || sending}
                  >
                    <option value="">Select a recipient</option>
                    {recipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name}
                      </option>
                    ))}
                  </select>
                </div>
                {!selectedProperty && (
                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Please select a property first.
                  </p>
                )}
              </div>

              {/* Message Content */}
              <div className="mb-6">
                <label
                  htmlFor="content"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="6"
                  maxLength="500"
                  className={`w-full p-3 rounded-lg border text-sm resize-y ${
                    darkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Write your message here..."
                  disabled={sending}
                />
                <div className="flex justify-between items-center mt-1">
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Max 500 characters
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {content.length}/500
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  className={`w-full sm:w-auto text-sm flex items-center justify-center transition-all duration-200 ${
                    sending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard/tenant/messages")}
                  className={`w-full sm:w-auto text-sm flex items-center justify-center transition-all duration-200 ${
                    sending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                  disabled={sending}
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComposeMessage;
