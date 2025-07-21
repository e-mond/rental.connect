import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaThumbtack } from "react-icons/fa";
import { BASE_URL } from "../../../config";
import GlobalSkeleton from "../../../components/GlobalSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";

const TenantMessageDetail = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [response, setResponse] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const hasFetched = useRef(false);

  // Extract currentUserId from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub || payload.userId);
      } catch (err) {
        console.error("[TenantMessageDetail] Error decoding token:", err);
        setError("Invalid authentication token");
        setErrorType("auth");
        toast.error("Please log in to view the message.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/tenantlogin", { replace: true });
        }, 2000);
      }
    } else {
      setError("You are not logged in. Please log in to view the message.");
      setErrorType("auth");
      toast.error("Please log in to view the message.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/tenantlogin", { replace: true });
      }, 2000);
    }
  }, [navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dummyMessage = {
    id: "rentalconnect-welcome",
    property: { title: "Rental Connect", imageUrl: null },
    sender: "Rental Connect",
    senderAvatar: null,
    content:
      "Welcome to Rental Connect! Our team is here to assist you with your rental needs. Reminder: Rent is due on the 1st of each month.",
    time: "May 09, 2025",
    unread: false,
    pinned: true,
  };

  const fetchMessages = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found", {
            cause: { type: "auth" },
          });
        }

        const data = await tenantApi.fetchMessages(token, controller.signal);
        console.log("[TenantMessageDetail] Raw API response:", data); // Debug log
        const normalizedMessages = Array.isArray(data)
          ? [
              dummyMessage,
              ...data.map((msg) => ({
                id: msg.id || "unknown",
                property: msg.property || {
                  title: "No Property Title",
                  imageUrl: null,
                },
                sender: msg.senderName || msg.sender || "Unknown Sender",
                senderId: msg.senderId || "unknown",
                senderAvatar: msg.senderAvatar || null,
                content: msg.content || "No content available",
                time: msg.time || "N/A",
                unread: msg.unread || false,
                pinned: msg.pinned || false,
              })),
            ]
          : [dummyMessage];
        normalizedMessages.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.time) - new Date(a.time);
        });
        setMessages(normalizedMessages);
      } catch (err) {
        if (err.type === "cancelled") return;
        setError(err.message || "Failed to fetch messages");
        setErrorType(err.type || err.cause?.type || "unknown");
        toast.error(err.message || "Failed to fetch messages", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        if (!error || errorType !== "auth") {
          setLoading(false);
        }
      }
    },
    [dummyMessage, error, errorType]
  );

  const fetchThread = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);
        setErrorType(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found", {
            cause: { type: "auth" },
          });
        }

        let normalizedThread;
        if (messageId === "rentalconnect-welcome") {
          normalizedThread = [dummyMessage];
        } else {
          const data = await tenantApi.fetchMessageById(
            token,
            messageId,
            controller.signal
          );
          normalizedThread = Array.isArray(data)
            ? data
            : [data].filter(Boolean).map((msg) => ({
                id: msg.id || "unknown",
                property: msg.property || {
                  title: "No Property Title",
                  imageUrl: null,
                },
                sender: msg.senderName || msg.sender || "Unknown Sender",
                senderId: msg.senderId || "unknown",
                senderAvatar: msg.senderAvatar || null,
                content: msg.content || "No content available",
                time: msg.time || "N/A",
                unread: msg.unread || false,
                pinned: msg.pinned || false,
              }));
        }

        setThread(normalizedThread);
      } catch (err) {
        if (err.type === "cancelled") return;
        setError(err.message || "Failed to fetch message thread");
        setErrorType(err.type || err.cause?.type || "unknown");
        toast.error(err.message || "Failed to fetch message thread", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        if (!error || errorType !== "auth") {
          setLoading(false);
        }
      }
    },
    [messageId, dummyMessage, error, errorType]
  );

  const handleSendResponse = async () => {
    if (!response.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await tenantApi.sendMessage(
        token,
        {
          recipientId: thread[0]?.senderId || "unknown",
          propertyId: thread[0]?.property?.id || "unknown",
          content: response,
        },
        new AbortController().signal
      );
      const newMessage = {
        id: Date.now().toString(),
        property: thread[0]?.property || {
          title: "No Property Title",
          imageUrl: null,
        },
        sender: "You",
        senderId: currentUserId || "user123",
        senderAvatar: null,
        content: response,
        time: new Date().toLocaleTimeString(),
        unread: false,
      };
      setThread((prev) => [...prev, newMessage]);
      const controller = new AbortController();
      await fetchMessages(controller);
      setResponse("");
      toast.success("Message sent!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Failed to send message: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    if (hasFetched.current && !error) return;
    hasFetched.current = true;

    const controller = new AbortController();
    Promise.all([fetchMessages(controller), fetchThread(controller)]).catch(
      (err) => {
        if (err.type !== "cancelled") {
          console.error("[TenantMessageDetail] Error in initial fetch:", err);
        }
      }
    );
    return () => {
      controller.abort();
    };
  }, [fetchMessages, fetchThread, messageId, error]);

  const handleRetry = () => {
    hasFetched.current = false;
    const controller = new AbortController();
    Promise.all([fetchMessages(controller), fetchThread(controller)]).catch(
      (err) => {
        if (err.type !== "cancelled") {
          console.error("[TenantMessageDetail] Error in retry fetch:", err);
        }
      }
    );
  };

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
        <div
          className={`w-full lg:w-1/3 border-r ${
            darkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="p-4">
            <h1
              className={`text-xl font-semibold text-gray-200 mb-4 ${
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
        <div
          className={`hidden lg:flex flex-1 items-center justify-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-gray-400">
              Select a message to view details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && errorType !== "auth") {
    return (
      <div className="flex h-screen">
        <div
          className={`w-full lg:w-1/3 border-r ${
            darkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="p-4 text-center">
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
        </div>
        <div
          className={`flex-1 flex items-center justify-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p className="text-lg text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const isSentMessage = (msg) => msg.senderId === currentUserId;
  const isReadOnlyMessage = messageId === "rentalconnect-welcome";

  return (
    <div className="flex h-screen relative">
      {/* Sidebar: Message List */}
      <div
        className={`w-full lg:w-1/3 border-r ${
          darkMode
            ? "border-gray-700 bg-gray-900"
            : "border-gray-200 bg-gray-50"
        } overflow-y-auto z-10`}
      >
        <div className="p-4">
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
              } focus:outline-none focus:ring-2 focus:ring-black`}
            />
          </div>

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

          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
                  darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                } ${
                  message.id === messageId
                    ? darkMode
                      ? "bg-gray-800"
                      : "bg-gray-200"
                    : ""
                }`}
                onClick={() =>
                  navigate(`/dashboard/tenant/messages/${message.id}`)
                }
              >
                {message.senderAvatar ? (
                  <img
                    src={`${BASE_URL}${message.senderAvatar}`}
                    alt={message.sender}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full mr-3 flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <span className="text-gray-500 text-xs">No Avatar</span>
                  </div>
                )}
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
                        {message.sender || "Unknown Sender"}
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
                    {message.property?.title || "No Property Title"}:{" "}
                    {message.content?.substring(0, 50) || "No content"}
                    {message.content?.length > 50 ? "..." : ""}
                  </p>
                </div>
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

      {/* Main Area: Message Thread and Response */}
      <div
        className={`flex-1 flex flex-col relative z-10 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="rgba(255, 255, 255, 0.05)"%3E%3Ccircle cx="32" cy="32" r="28"/%3E%3C/svg%3E\')',
          backgroundRepeat: "repeat",
          backgroundSize: "64px 64px",
        }}
      >
        {/* Faded Logo Background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-30 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className={`w-60 h-60 ${
              darkMode ? "bg-teal-500 border-white" : "bg-teal-400 border-black"
            } border-[20px] rounded-full flex items-center justify-center`}
          >
            <span
              className={`text-3xl italic ${
                darkMode ? "text-gray-200" : "text-black"
              }`}
            >
              RentalConnect
            </span>
          </div>
        </div>

        {/* Header */}
        <div
          className={`p-4 flex items-center ${
            darkMode ? "bg-teal-700" : "bg-black"
          } text-white`}
        >
          <Button
            onClick={() => navigate("/dashboard/tenant/messages")}
            className="p-2 rounded-full hover:bg-gray-200 hover:text-black mr-2"
            title="Back to Messages"
          >
            <FaArrowLeft />
          </Button>
          <div className="flex items-center">
            {thread[0]?.senderAvatar ? (
              <img
                src={`${BASE_URL}${thread[0].senderAvatar}`}
                alt={thread[0]?.sender}
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
                  darkMode ? "bg-gray-600" : "bg-gray-300"
                }`}
              >
                <span className="text-gray-500 text-[10px]">No Avatar</span>
              </div>
            )}
            <h2 className="text-xl font-semibold">
              {thread[0]?.sender || "Unknown"}
            </h2>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4">
          {thread.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${
                isSentMessage(msg) ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end">
                {!isSentMessage(msg) && (
                  <div className="mr-2">
                    {msg.senderAvatar ? (
                      <img
                        src={`${BASE_URL}${msg.senderAvatar}`}
                        alt={msg.sender}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          darkMode ? "bg-gray-600" : "bg-gray-300"
                        }`}
                      >
                        <span className="text-gray-500 text-[10px]">
                          No Avatar
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                    isSentMessage(msg)
                      ? "bg-teal-500 text-white"
                      : darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black border border-gray-200"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span
                    className={`text-xs block mt-1 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {msg.time || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Response Input (Hidden for RentalConnect Team message) */}
        {!isReadOnlyMessage && (
          <div
            className={`p-4 border-t ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-200 border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response..."
                className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 border-gray-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              />
              <Button
                variant="primary"
                onClick={handleSendResponse}
                className="ml-2 py-2 px-4 text-sm"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantMessageDetail;
