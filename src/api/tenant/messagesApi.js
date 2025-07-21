import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const ongoingRequests = new Map();

const messagesApi = {
  /**
   * Fetches tenant messages.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} Array of message data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  fetchMessages: async (token, signal) => {
    console.log("[messagesApi] Starting fetchMessages...");
    const requestKey = "fetchMessages";

    if (ongoingRequests.has(requestKey)) {
      console.log(
        "[messagesApi] Ongoing fetchMessages detected, aborting new request"
      );
      throw new ApiError(
        "Another fetch messages request is already in progress",
        "cancelled"
      );
    }

    let requestPromise;
    try {
      token = await ensureValidToken(token || localStorage.getItem("token"));
      if (!token)
        throw new ApiError(
          "Authentication token is missing. Please log in again.",
          "auth"
        );

      console.log(
        "[messagesApi] Fetching messages with token:",
        token.substring(0, 10) + "..."
      );
      requestPromise = axios.get(`${BASE_URL}/api/messages/tenant/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      ongoingRequests.set(requestKey, requestPromise);

      const response = await requestPromise;
      console.log(
        "[messagesApi] Messages fetched successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch messages was cancelled",
          "cancelled"
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        if (status === 401) {
          console.error("[messagesApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            "Failed to fetch messages.",
            "client",
            status,
            details
          );
        }
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    } finally {
      ongoingRequests.delete(requestKey);
    }
  },

  /**
   * Fetches a single message by ID.
   * @param {string} token - JWT token for authentication.
   * @param {string} messageId - The ID of the message.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The message data.
   * @throws {ApiError} If the request fails (e.g., invalid ID, 401, 500).
   */
  fetchMessageById: async (token, messageId, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!messageId || typeof messageId !== "string") {
        throw new ApiError(
          "Message ID is required and must be a string",
          "client"
        );
      }
      console.log("[messagesApi] Fetching message:", messageId);
      const response = await axios.get(
        `${BASE_URL}/api/messages/tenant/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log("[messagesApi] Message fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          `Request to fetch message ${messageId} was cancelled`,
          "cancelled"
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        if (status === 401) {
          console.error("[messagesApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            `Failed to fetch message ${messageId}.`,
            "client",
            status,
            details
          );
        }
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    }
  },

  /**
   * Sends a new message from the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {Object} messageData - Message data (e.g., recipientId, propertyId, content).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The sent message data.
   * @throws {ApiError} If the request fails (e.g., invalid input, 401, 500).
   */
  sendMessage: async (token, messageData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!messageData || typeof messageData !== "object") {
        throw new ApiError(
          "Message data is required and must be an object",
          "client"
        );
      }
      const { recipientId, propertyId, content } = messageData;
      if (!recipientId || !propertyId || !content) {
        throw new ApiError(
          "Recipient ID, property ID, and message content are required",
          "client"
        );
      }
      console.log("[messagesApi] Sending message:", messageData);
      const response = await axios.post(
        `${BASE_URL}/api/messages/tenant/send`,
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log("[messagesApi] Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to send message was cancelled",
          "cancelled"
        );
      }
      if (error.code === "ECONNABORTED") {
        throw new ApiError(
          "Request timed out. Please try again.",
          "network",
          null,
          error.message
        );
      }
      if (error.response) {
        const status = error.response.status;
        const details = error.response.data || "No additional details";
        if (status === 401) {
          console.error("[messagesApi] 401 Unauthorized - Clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          throw new ApiError(
            "Your session has expired. Please log in again.",
            "auth",
            status,
            details
          );
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            "Failed to send message.",
            "client",
            status,
            details
          );
        }
      }
      throw new ApiError(
        "We’re having trouble connecting. Please check your network and try again.",
        "network",
        null,
        error.message
      );
    }
  },
};

export default messagesApi;
