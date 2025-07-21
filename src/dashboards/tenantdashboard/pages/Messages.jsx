import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import { FaThumbtack } from "react-icons/fa";
import tenantApi from "../../../api/tenant/tenantApi";

const TenantMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const fetchMessages = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const token = localStorage.getItem("token");

        if (!token) {
          setError(
            "You are not logged in. Please log in to view your messages."
          );
          setErrorType("auth");
          toast.error("Please log in to view your messages.", {
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

        toast.info("Fetching your messages...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const data = await tenantApi.fetchMessages(token, controller.signal);
        const dummyMessage = {
          id: "rentalconnect-welcome",
          property: {
            title: "RentalConnect",
            imageUrl: null,
          },
          sender: "RentalConnect Team",
          content:
            "Welcome to RentalConnect! Our team is here to assist you with your rental needs. Reminder: Rent is due on the 1st of each month.",
          time: "May 09, 2025",
          unread: false,
          pinned: true,
        };
        const normalizedMessages = Array.isArray(data)
          ? [
              dummyMessage,
              ...data.map((msg) => ({
                id: msg.id || "unknown",
                property: msg.property || {
                  title: "No Property Title",
                  imageUrl: null,
                },
                sender: msg.sender || "Unknown Sender",
                content: msg.content || "No content available",
                time: msg.time || "N/A",
                unread: msg.unread || false,
                pinned: false,
              })),
            ]
          : [dummyMessage];
        // Sort messages: pinned first, then by time (newest first)
        normalizedMessages.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.time) - new Date(a.time);
        });
        setMessages(normalizedMessages);
      } catch (err) {
        if (err.type === "cancelled") return;
        setError(err.message);
        setErrorType(err.type || "unknown");
        toast.error(err.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setMessages([]);
      } finally {
        if (!error || errorType !== "auth") {
          setLoading(false);
        }
      }
    },
    [navigate, error, errorType]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchMessages(controller);
    return () => {
      controller.abort();
    };
  }, [fetchMessages]);

  const handleRetry = () => {
    const controller = new AbortController();
    fetchMessages(controller);
  };

  // Filter messages with safe property checks
  const filteredMessages = messages.filter((message) => {
    const propertyTitle = message.property?.title || "";
    const sender = message.sender || "";
    const content = message.content || "";
    return (
      propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex h-screen">
        {/* Sidebar Skeleton */}
        <div
          className={`w-full lg:w-1/3 border-r ${
            darkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="p-4">
            <h1
              className={`text-xl font-semibold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Messages
            </h1>
            <GlobalSkeleton
              type="list"
              bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
              animationSpeed="1.2s"
            />
          </div>
        </div>
        {/* Main Area Skeleton */}
        <div
          className={`hidden lg:flex flex-1 items-center justify-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse" />
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Select a message to view details
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar: Message List */}
      <div
        className={`w-full lg:w-1/3 border-r ${
          darkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-gray-50"
        } overflow-y-auto`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1
              className={`text-xl font-semibold ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Messages
            </h1>
            <Button
              variant="primary"
              onClick={() => navigate("/dashboard/tenant/compose")}
              className="text-sm py-2 px-4"
            >
              New Message
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Error Message */}
          {error && errorType !== "auth" && (
            <div className="mb-4 text-center">
              <p
                className={`text-sm ${
                  darkMode ? "text-red-400" : "text-red-500"
                }`}
              >
                {error}
              </p>
              {(errorType === "network" || errorType === "server") && (
                <Button
                  variant="primary"
                  onClick={handleRetry}
                  className="mt-2 text-sm"
                >
                  Retry
                </Button>
              )}
            </div>
          )}

          {/* Messages List */}
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  navigate(`/dashboard/tenant/messages/${message.id}`)
                }
              >
                {/* Profile Image */}
                {message.property && message.property.imageUrl ? (
                  <img
                    src={`${BASE_URL}${message.property.imageUrl}`}
                    alt={message.property.title}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full mr-3 flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
                {/* Message Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {message.pinned && (
                        <FaThumbtack className="text-yellow-500 mr-2" />
                      )}
                      <p
                        className={`font-semibold text-sm ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {message.property?.title || "No Property Title"}
                      </p>
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {message.time || "N/A"}
                    </p>
                  </div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    } truncate`}
                  >
                    {message.sender || "Unknown Sender"}:{" "}
                    {message.content?.substring(0, 50) || "No content"}
                    {message.content?.length > 50 ? "..." : ""}
                  </p>
                </div>
                {/* Unread Indicator */}
                {message.unread && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full ml-2" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No messages found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Area: Placeholder */}
      <div
        className={`hidden lg:flex flex-1 items-center justify-center flex-col opacity-80 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div
          className={`w-65 h-65 bg-gray-500 ${
            darkMode ? "border-teal-500" : "border-black"
          } border-[10px] rounded-full flex items-center justify-center mb-4`}
        >
          <span
            className={`${
              darkMode ? "text-gray-200" : "text-white"
            } text-3xl italic`}
          >
            RentalConnect
          </span>
        </div>
        <h2
          className={`text-2xl font-semibold ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Connect with Your Landlord
        </h2>
        <p className="text-gray-500">
          Select a message or compose a new one to get started.
        </p>
      </div>
    </div>
  );
};

export default TenantMessages;
