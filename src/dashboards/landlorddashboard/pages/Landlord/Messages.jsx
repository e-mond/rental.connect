import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaPlus,
  FaSearch,
  FaPaperPlane,
  FaTimes,
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaKey,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { JSEncrypt } from "jsencrypt";
import CryptoJS from "crypto-js";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Button from "../../../../components/Button";
import { useDarkMode } from "../../../../context/DarkModeContext";
import landlordApi from "../../../../api/landlord/landlordApi";

/**
 * LandlordMessages Component
 *
 * A WhatsApp-like messaging interface for landlords to communicate with tenants.
 * Features a chat list sidebar and a message thread view with reply functionality.
 * Uses react-query for efficient data fetching and state management.
 * Implements end-to-end encryption (E2EE) using AES (message content) and RSA (AES key).
 *
 * Features:
 * - Chat list with sender avatars, names, unread indicators, and read/unread toggle.
 * - Message thread with avatars, timestamps, and reply buttons.
 * - Auto-mark messages as read when a chat is selected.
 * - Compose and reply modals with property/tenant selection and reply context.
 * - Input field and send button for quick messages in the selected chat.
 * - RentalConnect logo and slogan displayed when no chat is selected.
 * - Key pair generation for E2EE with public key saved to backend.
 * - Responsive design with dark mode support and Tailwind CSS.
 * - Robust error handling with toast notifications and retry options.
 */
const LandlordMessages = () => {
  // Access dark mode context for theme toggling
  const { darkMode } = useDarkMode();

  // State for search input in chat list
  const [searchQuery, setSearchQuery] = useState("");
  // State for initial loading skeleton
  const [loading, setLoading] = useState(true);
  // State for currently selected chat (senderId or recipientId)
  const [selectedChatId, setSelectedChatId] = useState(null);
  // State for modal visibility (compose/reply)
  const [modalOpen, setModalOpen] = useState(false);
  // State for modal type ("compose" or "reply")
  const [modalType, setModalType] = useState("compose");
  // State for message content in modal
  const [modalMessage, setModalMessage] = useState("");
  // State for message being replied to
  const [selectedMessage, setSelectedMessage] = useState(null);
  // State for selected property in compose modal
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  // State for selected tenant in compose modal
  const [selectedTenantId, setSelectedTenantId] = useState("");
  // State for chat input in message thread
  const [chatInput, setChatInput] = useState("");
  // State for chat search visibility
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  // State for search query in chat thread
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  // State for context menu (mark read/unread)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    chatId: null,
  });
  // State for private key (stored in localStorage)
  const [privateKey, setPrivateKey] = useState(
    localStorage.getItem("privateKey")
  );
  // State for current user ID (extracted from JWT)
  const [currentUserId, setCurrentUserId] = useState(null);

  /**
   * Extract userId from JWT token on component mount
   * Sets currentUserId based on 'sub' or 'userId' in token payload
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub || payload.userId);
      } catch (error) {
        console.error("[LandlordMessages] Error decoding token:", error);
        toast.error("Invalid authentication token");
      }
    }
  }, []);

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
      toast.error(`Failed to fetch messages: ${error.message}`);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // Cache messages for 10 minutes
    cacheTime: 15 * 60 * 1000, // Keep cache for 15 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Fetch properties using react-query
  const {
    data: properties = [],
    error: propertiesError,
    isLoading: propertiesLoading,
  } = useQuery({
    queryKey: ["landlordProperties"],
    queryFn: () => landlordApi.fetchProperties(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      toast.error(`Failed to fetch properties: ${error.message}`);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch leases using react-query, dependent on selectedPropertyId
  const {
    data: leases = [],
    error: leasesError,
    isLoading: leasesLoading,
  } = useQuery({
    queryKey: ["landlordLeases", selectedPropertyId],
    queryFn: () => landlordApi.fetchLeases(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token") && !!selectedPropertyId,
    onError: (error) => {
      toast.error(`Failed to fetch leases: ${error.message}`);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Derive tenants based on selected property for compose modal
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
      // Optimistically update messages state
      const previousMessages = messagesState;
      const updatedMessages = messagesState.map((msg) =>
        msg.id === messageId ? { ...msg, read: isRead, isRead } : msg
      );
      setMessagesState(updatedMessages);
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      toast.error(`Failed to update message status: ${err.message}`);
      setMessagesState(context.previousMessages);
    },
    onSuccess: () => {
      toast.success("Message status updated!");
      refetchMessages();
    },
  });

  // Mutation to send an encrypted message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, recipientId, propertyId, replyToId }) => {
      // Fetch recipient's public key
      const publicKey = await landlordApi.fetchPublicKey(
        localStorage.getItem("token"),
        recipientId
      );
      if (!publicKey) {
        throw new Error("Recipient public key not found");
      }
      // Generate random AES key
      const aesKey = CryptoJS.lib.WordArray.random(32).toString();
      // Encrypt message content with AES
      const encryptedContent = CryptoJS.AES.encrypt(content, aesKey).toString();
      // Encrypt AES key with recipient's RSA public key
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encryptedKey = encryptor.encrypt(aesKey);
      if (!encryptedKey) {
        throw new Error("Failed to encrypt AES key");
      }
      // Send encrypted message
      return landlordApi.sendMessage(localStorage.getItem("token"), {
        encryptedContent,
        encryptedKey,
        recipientId,
        propertyId,
        replyToId,
      });
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      refetchMessages();
      closeModal();
      setChatInput("");
    },
    onError: (err) => {
      toast.error(`Failed to send message: ${err.message}`);
    },
  });

  // Local state for messages to handle optimistic updates and decryption
  const [messagesState, setMessagesState] = useState([]);

  /**
   * Decrypt messages using private key and sync with fetched messages
   * Adds decryptedContent to each message, handling errors gracefully
   */
  useEffect(() => {
    const decryptMessages = async () => {
      if (!privateKey) {
        setMessagesState(
          messages.map((msg) => ({
            ...msg,
            date: msg.createdAt,
            isRead: msg.read,
            decryptedContent: "[Encryption key missing]",
          }))
        );
        return;
      }
      const decryptedMessages = await Promise.all(
        messages.map(async (msg) => {
          try {
            // Decrypt AES key with private key
            const decryptor = new JSEncrypt();
            decryptor.setPrivateKey(privateKey);
            const aesKey = decryptor.decrypt(msg.encryptedKey);
            if (!aesKey) {
              return {
                ...msg,
                date: msg.createdAt,
                isRead: msg.read,
                decryptedContent: "[Decryption failed]",
              };
            }
            // Decrypt message content with AES key
            const decryptedContent = CryptoJS.AES.decrypt(
              msg.encryptedContent,
              aesKey
            ).toString(CryptoJS.enc.Utf8);
            return {
              ...msg,
              date: msg.createdAt,
              isRead: msg.read,
              decryptedContent: decryptedContent || "[Empty message]",
            };
          } catch (err) {
            console.error("[LandlordMessages] Decryption error:", err);
            return {
              ...msg,
              date: msg.createdAt,
              isRead: msg.read,
              decryptedContent: "[Decryption error]",
            };
          }
        })
      );
      setMessagesState(decryptedMessages);
    };
    decryptMessages();
  }, [messages, privateKey]);

  /**
   * Control loading state based on query statuses
   * Delays hiding skeleton for smoother UX
   */
  useEffect(() => {
    if (!messagesLoading && !propertiesLoading && !leasesLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [messagesLoading, propertiesLoading, leasesLoading]);

  /**
   * Generate RSA key pair and save public key to backend
   * Stores private key in localStorage
   */
  const generateKeyPair = () => {
    const encryptor = new JSEncrypt({ default_key_size: 2048 });
    const privateKey = encryptor.getPrivateKey();
    const publicKey = encryptor.getPublicKey();
    localStorage.setItem("privateKey", privateKey);
    setPrivateKey(privateKey);
    landlordApi
      .savePublicKey(localStorage.getItem("token"), publicKey)
      .then(() => {
        toast.success("Key pair generated and public key saved!");
      })
      .catch((err) => {
        toast.error(`Failed to save public key: ${err.message}`);
      });
  };

  // Filter messages based on search query for chat list
  const filteredMessages = useMemo(() => {
    let result = [...messagesState];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (message) =>
          (message.senderName?.toLowerCase() || "").includes(query) ||
          (message.property?.title?.toLowerCase() || "").includes(query) ||
          (message.decryptedContent?.toLowerCase() || "").includes(query)
      );
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [messagesState, searchQuery]);

  // Filter messages in selected chat based on chat search query
  const filteredChatMessages = useMemo(() => {
    if (!selectedChatId || !currentUserId) return [];
    let result = filteredMessages.filter(
      (message) =>
        (message.senderId === selectedChatId &&
          message.recipientId === currentUserId) ||
        (message.senderId === currentUserId &&
          message.recipientId === selectedChatId)
    );
    if (chatSearchQuery) {
      const query = chatSearchQuery.toLowerCase();
      result = result.filter(
        (message) =>
          (message.decryptedContent?.toLowerCase() || "").includes(query) ||
          (message.property?.title?.toLowerCase() || "").includes(query)
      );
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredMessages, selectedChatId, chatSearchQuery, currentUserId]);

  // Group messages by senderId or recipientId for chat list
  const chats = useMemo(() => {
    if (!currentUserId) return [];
    const chatMap = new Map();
    filteredMessages.forEach((message) => {
      const otherUserId =
        message.senderId === currentUserId
          ? message.recipientId
          : message.senderId;
      if (!chatMap.has(otherUserId)) {
        chatMap.set(otherUserId, {
          id: otherUserId,
          senderName: message.senderName || "Unknown Sender",
          senderAvatar: message.senderAvatar,
          lastMessage: message.decryptedContent || "",
          date: message.date,
          unreadCount: filteredMessages.filter(
            (m) =>
              m.senderId === otherUserId &&
              m.recipientId === currentUserId &&
              !m.isRead
          ).length,
          isRead: !filteredMessages.some(
            (m) =>
              m.senderId === otherUserId &&
              m.recipientId === currentUserId &&
              !m.isRead
          ),
          property: message.property,
        });
      } else {
        const chat = chatMap.get(otherUserId);
        if (new Date(message.date) > new Date(chat.date)) {
          chat.lastMessage = message.decryptedContent || "";
          chat.date = message.date;
        }
        chat.unreadCount = filteredMessages.filter(
          (m) =>
            m.senderId === otherUserId &&
            m.recipientId === currentUserId &&
            !m.isRead
        ).length;
        chat.isRead = !filteredMessages.some(
          (m) =>
            m.senderId === otherUserId &&
            m.recipientId === currentUserId &&
            !m.isRead
        );
      }
    });
    return Array.from(chatMap.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [filteredMessages, currentUserId]);

  /**
   * Toggle read/unread status for all messages in a chat
   * @param {string} chatId - The senderId or recipientId of the chat
   * @param {boolean} isRead - The new read status
   */
  const handleMarkReadToggle = (chatId, isRead) => {
    const messagesToUpdate = filteredMessages.filter(
      (message) =>
        message.senderId === chatId &&
        message.recipientId === currentUserId &&
        message.isRead !== isRead
    );
    messagesToUpdate.forEach((message) => {
      markMessageMutation.mutate({ messageId: message.id, isRead });
    });
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
  };

  /**
   * Select a chat and mark its unread messages as read
   * @param {string} chatId - The senderId or recipientId of the chat
   */
  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    const messagesToMarkRead = filteredMessages.filter(
      (message) =>
        message.senderId === chatId &&
        message.recipientId === currentUserId &&
        !message.isRead
    );
    messagesToMarkRead.forEach((message) => {
      markMessageMutation.mutate({ messageId: message.id, isRead: true });
    });
    setChatSearchOpen(false);
    setChatSearchQuery("");
  };

  /** Close the current chat and reset related states */
  const handleCloseChat = () => {
    setSelectedChatId(null);
    setChatSearchOpen(false);
    setChatSearchQuery("");
    setChatInput("");
  };

  /** Open the compose modal for a new message */
  const openComposeModal = () => {
    setModalType("compose");
    setModalMessage("");
    setSelectedMessage(null);
    setSelectedPropertyId("");
    setSelectedTenantId("");
    setModalOpen(true);
  };

  /**
   * Open the reply modal for a specific message
   * @param {Object} message - The message to reply to
   */
  const openReplyModal = (message) => {
    setModalType("reply");
    setModalMessage("");
    setSelectedMessage(message);
    setSelectedPropertyId(message.property?.id || "");
    setSelectedTenantId(
      message.senderId === currentUserId
        ? message.recipientId
        : message.senderId
    );
    setModalOpen(true);
  };

  /** Close the modal and reset its states */
  const closeModal = () => {
    setModalOpen(false);
    setModalMessage("");
    setSelectedMessage(null);
    setSelectedPropertyId("");
    setSelectedTenantId("");
  };

  /** Send a message from the modal (compose or reply) */
  const handleSendMessage = () => {
    if (!modalMessage.trim()) {
      toast.error("Message content cannot be empty.");
      return;
    }
    if (!privateKey) {
      toast.error("Please generate a key pair first.");
      return;
    }
    if (modalType === "compose" && (!selectedPropertyId || !selectedTenantId)) {
      toast.error("Please select a property and tenant.");
      return;
    }
    sendMessageMutation.mutate({
      content: modalMessage,
      recipientId: selectedTenantId,
      propertyId: selectedPropertyId,
      replyToId: modalType === "reply" ? selectedMessage?.id : null,
    });
  };

  /** Send a message from the chat input in the message thread */
  const handleChatInputSend = () => {
    if (!chatInput.trim()) {
      toast.error("Message content cannot be empty.");
      return;
    }
    if (!selectedChatId) {
      toast.error("No chat selected.");
      return;
    }
    if (!privateKey) {
      toast.error("Please generate a key pair first.");
      return;
    }
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    sendMessageMutation.mutate({
      content: chatInput,
      recipientId: selectedChatId,
      propertyId: selectedChat.property?.id || "",
      replyToId: null,
    });
  };

  /**
   * Open context menu for a chat on right-click
   * @param {Event} e - The context menu event
   * @param {string} chatId - The senderId or recipientId of the chat
   */
  const handleContextMenu = (e, chatId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      chatId,
    });
  };

  /** Close the context menu */
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
  };

  // Combine errors for unified error handling
  const combinedError = messagesError || propertiesError || leasesError;

  // Render loading skeleton during initial load
  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="list"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-100"}
            count={5}
          />
        </div>
      </div>
    );
  }

  // Render error display if any query fails
  if (combinedError) {
    return (
      <ErrorDisplay
        error={combinedError}
        onRetry={() => {
          refetchMessages();
        }}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Chat List Sidebar */}
      <div
        className={`w-full md:w-1/3 border-r ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="flex space-x-2">
            {/* Generate Key Pair Button */}
            <Button
              onClick={generateKeyPair}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Generate Encryption Key Pair"
            >
              <FaKey />
            </Button>
            {/* Compose New Message Button */}
            <Button
              onClick={openComposeModal}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Compose New Message"
            >
              <FaPlus />
            </Button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No messages found.</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                className={`p-4 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  selectedChatId === chat.id
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-50"
                    : ""
                }`}
              >
                {/* Sender Avatar */}
                <img
                  src={
                    chat.senderAvatar ||
                    "https://via.placeholder.com/40?text=User"
                  }
                  alt={chat.senderName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  {/* Sender Name and Timestamp */}
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{chat.senderName}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(chat.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {/* Property Title and Last Message */}
                  <p className="text-sm text-gray-500">
                    {chat.property?.title}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      chat.isRead ? "text-gray-500" : "font-semibold"
                    }`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
                {/* Unread Indicator */}
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } flex justify-between items-center`}
            >
              <div className="flex items-center">
                {/* Sender Avatar */}
                <img
                  src={
                    chats.find((chat) => chat.id === selectedChatId)
                      ?.senderAvatar ||
                    "https://via.placeholder.com/40?text=User"
                  }
                  alt="Sender"
                  className="w-10 h-10 rounded-full mr-3"
                />
                {/* Sender Name and Property Title */}
                <div>
                  <h3 className="font-semibold">
                    {
                      chats.find((chat) => chat.id === selectedChatId)
                        ?.senderName
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {
                      chats.find((chat) => chat.id === selectedChatId)?.property
                        ?.title
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Toggle Chat Search */}
                <Button
                  onClick={() => setChatSearchOpen(!chatSearchOpen)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Search Chat"
                >
                  <FaSearch />
                </Button>
                {/* Close Chat */}
                <Button
                  onClick={handleCloseChat}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Close Chat"
                >
                  <FaTimes />
                </Button>
              </div>
            </div>
            {/* Chat Search Bar */}
            {chatSearchOpen && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search in chat..."
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
            )}
            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredChatMessages.length === 0 ? (
                <p className="text-center text-gray-500">No messages found.</p>
              ) : (
                filteredChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                        message.senderId === currentUserId
                          ? "bg-blue-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {/* Sender Avatar and Name */}
                      {message.senderId !== currentUserId && (
                        <div className="flex items-center mb-2">
                          <img
                            src={
                              message.senderAvatar ||
                              "https://via.placeholder.com/30?text=User"
                            }
                            alt={message.senderName}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm font-semibold">
                            {message.senderName}
                          </span>
                        </div>
                      )}
                      {/* Reply Context */}
                      {message.replyToId && (
                        <div
                          className={`p-2 mb-2 rounded ${
                            darkMode ? "bg-gray-600" : "bg-gray-100"
                          }`}
                        >
                          <p className="text-sm italic text-gray-500">
                            Replying to:{" "}
                            {
                              filteredMessages.find(
                                (m) => m.id === message.replyToId
                              )?.decryptedContent
                            }
                          </p>
                        </div>
                      )}
                      {/* Message Content */}
                      <p>{message.decryptedContent}</p>
                      {/* Timestamp and Read Status */}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(message.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.senderId === currentUserId && (
                          <span>
                            {message.isRead ? (
                              <FaEnvelopeOpen className="text-xs" />
                            ) : (
                              <FaEnvelope className="text-xs" />
                            )}
                          </span>
                        )}
                      </div>
                      {/* Reply Button */}
                      <Button
                        onClick={() => openReplyModal(message)}
                        className="mt-2 text-sm flex items-center text-gray-500 hover:text-blue-500"
                      >
                        <FaReply className="mr-1" /> Reply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Chat Input */}
            <div
              className={`p-4 border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleChatInputSend()}
                  className={`flex-1 p-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <Button
                  onClick={handleChatInputSend}
                  className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  disabled={sendMessageMutation.isLoading}
                >
                  <FaPaperPlane />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Placeholder when no chat is selected */
          <div className="flex-1 flex items-center justify-center flex-col opacity-80">
            <div
              className={`w-65 h-65 bg-gray-600 ${
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
            <h2 className="text-2xl font-semibold">
              Connect with Your Tenants
            </h2>
            <p className="text-gray-500">
              Select a chat or compose a new message to get started.
            </p>
          </div>
        )}
      </div>

      {/* Context Menu for Chat List */}
      {contextMenu.visible && (
        <div
          className={`fixed z-50 p-2 rounded shadow-lg ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
          }`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeContextMenu}
        >
          <Button
            onClick={() =>
              handleMarkReadToggle(
                contextMenu.chatId,
                !chats.find((chat) => chat.id === contextMenu.chatId).isRead
              )
            }
            className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {chats.find((chat) => chat.id === contextMenu.chatId).isRead
              ? "Mark as Unread"
              : "Mark as Read"}
          </Button>
        </div>
      )}

      {/* Modal for Compose/Reply */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg w-full max-w-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              {modalType === "compose" ? "New Message" : "Reply"}
            </h2>
            {modalType === "compose" && (
              <>
                {/* Property Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Property
                  </label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => {
                      setSelectedPropertyId(e.target.value);
                      setSelectedTenantId("");
                    }}
                    className={`w-full p-2 rounded border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={propertiesLoading}
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Tenant Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Tenant
                  </label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => setSelectedTenantId(e.target.value)}
                    className={`w-full p-2 rounded border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    disabled={leasesLoading || !selectedPropertyId}
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {/* Reply Context */}
            {modalType === "reply" && selectedMessage && (
              <div
                className={`p-2 mb-4 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p className="text-sm italic text-gray-500">
                  Replying to: {selectedMessage.decryptedContent}
                </p>
              </div>
            )}
            {/* Message Input */}
            <textarea
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
              placeholder="Type your message..."
              className={`w-full p-2 rounded border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none`}
            />
            {/* Modal Actions */}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 text-gray-900 hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                disabled={sendMessageMutation.isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMessages;
