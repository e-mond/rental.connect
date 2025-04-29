import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaSearch,
  FaPlus,
  FaReply,
  FaEnvelope,
  FaEnvelopeOpen,
} from "react-icons/fa";
import { toast } from "react-toastify";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Button from "../../../../components/Button";
import { useDarkMode } from "../../../../context/DarkModeContext";
import landlordApi from "../../../../api/landlordApi";

/**
 * LandlordMessages Component
 *
 * Displays a paginated list of messages for the landlord, with a serach bar and filter options (All, Unread, Read).
 * Fetches message data using react-query for better state management and caching.
 * Features:
 * - Skeleton loader with a minimum 2-second display for UX consistency.
 * - Responsive design: Makes the message list scrollable on smaller screens.
 * - Search functionality to filter messages by sender or property title.
 * - Filter messages by read/unread status.
 * - "Mark as Read/Unread" toggle for each message.
 * - Pagination with 10 messages per page.
 * - Modal for composing and replying to messages, with dropdowns to select tenant and property.
 * - Consistent error handling with ErrorDisplay and toast notifications.
 */
const LandlordMessages = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const messagesPerPage = 10; // Messages per page
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [modalType, setModalType] = useState("compose"); // "compose" or "reply"
  const [modalMessage, setModalMessage] = useState(""); // Message content in modal
  const [selectedMessage, setSelectedMessage] = useState(null); // Message being replied to
  const [selectedPropertyId, setSelectedPropertyId] = useState(""); // Selected property for composing message
  const [selectedTenantId, setSelectedTenantId] = useState(""); // Selected tenant for composing message

  // Fetch messages using react-query
  const {
    data: messages = [],
    error: messagesError,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["landlordMessages"],
    queryFn: () => landlordApi.fetchMessages(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[LandlordMessages] Fetch messages error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Fetch properties for the dropdown in the compose modal
  const {
    data: properties = [],
    error: propertiesError,
    isLoading: propertiesLoading,
  } = useQuery({
    queryKey: ["landlordProperties"],
    queryFn: () => landlordApi.fetchProperties(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[LandlordMessages] Fetch properties error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Fetch leases to get tenant information for the selected property
  const {
    data: leases = [],
    error: leasesError,
    isLoading: leasesLoading,
  } = useQuery({
    queryKey: ["landlordLeases", selectedPropertyId],
    queryFn: () => landlordApi.fetchLeases(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token") && !!selectedPropertyId,
    onError: (error) => {
      console.error("[LandlordMessages] Fetch leases error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Filter tenants based on the selected property
  const tenants = useMemo(() => {
    if (!selectedPropertyId) return [];
    return leases
      .filter((lease) => lease.propertyId === selectedPropertyId)
      .map((lease) => ({
        id: lease.tenantId,
        name: lease.tenantName || "Unknown Tenant",
      }));
  }, [leases, selectedPropertyId]);

  // Mutation to mark message as read/unread
  const markMessageMutation = useMutation({
    mutationFn: ({ messageId, isRead }) =>
      landlordApi.updateMessageStatus(
        localStorage.getItem("token"),
        messageId,
        isRead
      ),
    onMutate: async ({ messageId, isRead }) => {
      // Optimistic update: Update the local messages state before the server responds
      const previousMessages = messages;
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, isRead } : msg
      );
      setMessagesState(updatedMessages);
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      toast.error(`Failed to update message status: ${err.message}`);
      setMessagesState(context.previousMessages); // Rollback on error
    },
    onSuccess: () => {
      toast.success("Message status updated!");
      refetchMessages(); // Refetch to ensure consistency
    },
  });

  // Mutation to send a new message or reply
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, recipientId, propertyId, replyToId }) =>
      landlordApi.sendMessage(localStorage.getItem("token"), {
        content,
        recipientId,
        propertyId,
        replyToId,
      }),
    onSuccess: () => {
      toast.success("Message sent successfully!");
      refetchMessages(); // Refetch messages
      closeModal();
    },
    onError: (err) => {
      toast.error(`Failed to send message: ${err.message}`);
    },
  });

  // Temporary state for optimistic updates (since react-query doesn't directly manage state)
  const [messagesState, setMessagesState] = useState(messages);

  useEffect(() => {
    setMessagesState(messages); // Sync with fetched data
  }, [messages]);

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!messagesLoading && !propertiesLoading && !leasesLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [messagesLoading, propertiesLoading, leasesLoading]);

  // Memoized filtered messages
  const filteredMessages = useMemo(() => {
    let result = [...messagesState];

    // Apply filter by read status
    if (filter === "Unread") {
      result = result.filter((message) => !message.isRead);
    } else if (filter === "Read") {
      result = result.filter((message) => message.isRead);
    }

    // Apply search query (case-insensitive search by sender or property title)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (message) =>
          (message.sender?.toLowerCase() || "").includes(query) ||
          (message.property?.title?.toLowerCase() || "").includes(query)
      );
    }

    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [messagesState, filter, searchQuery]);

  // Pagination logic
  const totalMessages = filteredMessages.length;
  const totalPages = Math.ceil(totalMessages / messagesPerPage);
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const handleMarkReadToggle = (message) => {
    const newStatus = !message.isRead;
    markMessageMutation.mutate({ messageId: message.id, isRead: newStatus });
  };

  const openComposeModal = () => {
    setModalType("compose");
    setModalMessage("");
    setSelectedMessage(null);
    setSelectedPropertyId("");
    setSelectedTenantId("");
    setModalOpen(true);
  };

  const openReplyModal = (message) => {
    setModalType("reply");
    setModalMessage("");
    setSelectedMessage(message);
    // Pre-fill the property and tenant for replies
    setSelectedPropertyId(message.property.id);
    setSelectedTenantId(message.senderId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
    setSelectedMessage(null);
    setSelectedPropertyId("");
    setSelectedTenantId("");
  };

  const handleSendMessage = () => {
    if (!modalMessage.trim()) {
      toast.error("Message content cannot be empty.");
      return;
    }
    if (modalType === "compose" && (!selectedPropertyId || !selectedTenantId)) {
      toast.error("Please select a property and tenant.");
      return;
    }

    if (modalType === "compose") {
      sendMessageMutation.mutate({
        content: modalMessage,
        recipientId: selectedTenantId, // Tenant ID selected from dropdown
        propertyId: selectedPropertyId, // Property ID selected from dropdown
        replyToId: null,
      });
    } else if (modalType === "reply" && selectedMessage) {
      sendMessageMutation.mutate({
        content: modalMessage,
        recipientId: selectedMessage.senderId, // Tenant ID from the original message
        propertyId: selectedMessage.property.id, // Property ID from the original message
        replyToId: selectedMessage.id,
      });
    }
  };

  // Combine errors for display
  const combinedError = messagesError || propertiesError || leasesError;

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="list"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        </div>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={combinedError}
              className={darkMode ? "text-red-400" : "text-red-500"}
            />
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                refetchMessages();
              }}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="p-4 sm:p-6 w-full overflow-auto">
        {/* Breadcrumb Navigation */}
        <nav
          className={`text-sm sm:text-base mb-4 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span
            className={`font-semibold ${
              darkMode ? "text-gray-200" : "text-black"
            }`}
          >
            Dashboard
          </span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold">Your Messages</h1>
          <Button
            variant="primary"
            onClick={openComposeModal}
            className="flex items-center text-sm sm:text-base"
          >
            <FaPlus className="mr-2" /> Compose Message
          </Button>
        </div>

        {/* Search Bar */}
        <div
          className={`flex items-center border p-2 rounded-lg shadow-sm mb-4 ${
            darkMode
              ? "border-gray-600 bg-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          <FaSearch
            className={darkMode ? "text-gray-400 ml-2" : "text-gray-400 ml-2"}
          />
          <input
            type="text"
            placeholder="Search messages by sender or property..."
            className={`ml-2 w-full outline-none text-sm sm:text-base ${
              darkMode
                ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                : "bg-white text-gray-800 placeholder-gray-500"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div
          className={`flex space-x-2 sm:space-x-4 text-sm border-b pb-2 mb-4 overflow-x-auto scrollbar-thin ${
            darkMode
              ? "border-gray-700 scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              : "border-gray-200 scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          }`}
        >
          {["All", "Unread", "Read"].map((status) => (
            <span
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              onKeyDown={(e) => e.key === "Enter" && setFilter(status)}
              className={`cursor-pointer px-3 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? darkMode
                    ? "font-semibold bg-teal-500 text-white"
                    : "font-semibold bg-blue-600 text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${status} messages`}
            >
              {status}
            </span>
          ))}
        </div>

        {/* Messages List */}
        <div
          className={`rounded-lg shadow overflow-y-auto ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          {paginatedMessages.length > 0 ? (
            paginatedMessages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } ${
                  message.isRead
                    ? darkMode
                      ? "bg-gray-800"
                      : "bg-gray-50"
                    : darkMode
                    ? "bg-teal-900"
                    : "bg-blue-50"
                }`}
              >
                <div className="flex items-start w-full">
                  {/* Property Image */}
                  <img
                    src={
                      message.property?.imageUrl
                        ? `${landlordApi.baseUrl}${message.property.imageUrl}`
                        : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop"
                    }
                    alt={message.property?.title || "Property"}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 md:mr-4"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=40&h=40&fit=crop")
                    }
                  />
                  <div className="flex-1">
                    {/* Property Title */}
                    <p className="font-semibold text-sm md:text-base leading-tight">
                      {message.property?.title || "Unknown Property"}
                    </p>
                    {/* Message Preview */}
                    <p
                      className={`text-xs md:text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {message.sender || "Unknown Sender"}:{" "}
                      {(message.content || "").substring(0, 50)}...
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-600"
                      }`}
                    >
                      {message.date
                        ? new Date(message.date).toLocaleString()
                        : "Unknown Date"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <Button
                    variant="secondary"
                    onClick={() => handleMarkReadToggle(message)}
                    className="flex items-center text-sm md:text-base"
                    aria-label={
                      message.isRead
                        ? `Mark message from ${
                            message.sender || "sender"
                          } as unread`
                        : `Mark message from ${
                            message.sender || "sender"
                          } as read`
                    }
                  >
                    {message.isRead ? (
                      <FaEnvelopeOpen className="mr-2" />
                    ) : (
                      <FaEnvelope className="mr-2" />
                    )}
                    {message.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => openReplyModal(message)}
                    className="flex items-center text-sm md:text-base"
                  >
                    <FaReply className="mr-2" /> Reply
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-center py-4 text-sm md:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              You have no messages for &quot;{filter}&quot; status.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalMessages > messagesPerPage && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-sm sm:text-base"
            >
              Previous
            </Button>
            <span className="text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-sm sm:text-base"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Modal for Composing/Replying */}
      {modalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            darkMode ? "bg-black/50" : "bg-black/30"
          }`}
        >
          <div
            className={`rounded-lg p-6 w-full max-w-md ${
              darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {modalType === "compose" ? "Compose Message" : "Reply to Message"}
            </h2>
            {modalType === "reply" && selectedMessage && (
              <p
                className={`text-sm mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Replying to {selectedMessage.sender || "sender"} about{" "}
                {selectedMessage.property?.title || "property"}
              </p>
            )}
            {modalType === "compose" && (
              <>
                {/* Property Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="property-select"
                    className="block text-sm font-medium mb-1"
                  >
                    Select Property
                  </label>
                  <select
                    id="property-select"
                    value={selectedPropertyId}
                    onChange={(e) => {
                      setSelectedPropertyId(e.target.value);
                      setSelectedTenantId(""); // Reset tenant selection when property changes
                    }}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    disabled={propertiesLoading}
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title || "Untitled Property"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tenant Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="tenant-select"
                    className="block text-sm font-medium mb-1"
                  >
                    Select Tenant
                  </label>
                  <select
                    id="tenant-select"
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    disabled={
                      !selectedPropertyId ||
                      leasesLoading ||
                      tenants.length === 0
                    }
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                  {selectedPropertyId &&
                    tenants.length === 0 &&
                    !leasesLoading && (
                      <p className="text-xs text-red-500 mt-1">
                        No tenants found for this property.
                      </p>
                    )}
                </div>
              </>
            )}
            <textarea
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
              placeholder="Type your message here..."
              className={`w-full h-32 p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
              }`}
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendMessage}
                className="text-sm sm:text-base"
                disabled={sendMessageMutation.isLoading}
              >
                {sendMessageMutation.isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMessages;
