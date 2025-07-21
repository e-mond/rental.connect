import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

// Map to track ongoing requests and prevent duplicates
const ongoingRequests = new Map();

/**
 * Fetches tenant notifications (e.g., payment updates, lease changes).
 * Prevents duplicate requests using ongoingRequests.
 * @param {string} token - JWT token for authentication.
 * @param {AbortSignal} signal - Signal to abort the request.
 * @returns {Promise<Array>} Array of notification data.
 * @throws {ApiError} If the request fails (e.g., 401, 403, 404).
 */
export const fetchNotifications = async (token, signal) => {
  console.log("[notificationsApi] Starting fetchNotifications...");
  const requestKey = "fetchNotifications";

  // Check for ongoing requests
  if (ongoingRequests.has(requestKey)) {
    console.log(
      "[notificationsApi] Ongoing fetchNotifications detected, aborting new request"
    );
    throw new ApiError(
      "Another fetch notifications request is already in progress",
      "cancelled"
    );
  }

  let requestPromise;
  try {
    // Retrieve token if not provided
    token = token || localStorage.getItem("token");
    if (!token) {
      console.error(
        "[notificationsApi] No token found in localStorage or arguments"
      );
      throw new ApiError(
        "Authentication token is missing. Please log in again.",
        "auth"
      );
    }
    // Ensure valid token
    console.log("[notificationsApi] Validating token...");
    token = await ensureValidToken(token);
    console.log(
      "[notificationsApi] Token validated, making request with token:",
      token.substring(0, 10) + "..."
    );

    // Store request to prevent duplicates
    requestPromise = axios.get(`${BASE_URL}/api/notifications/tenant`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });
    ongoingRequests.set(requestKey, requestPromise);

    // Await response
    const response = await requestPromise;
    console.log(
      "[notificationsApi] Successfully fetched notifications, count:",
      response.data.length
    );
    return response.data;
  } catch (error) {
    console.error("[notificationsApi] Error in fetchNotifications:", error);
    // Handle cancellation
    if (axios.isCancel(error)) {
      throw new ApiError(
        "Request to fetch notifications was cancelled",
        "cancelled"
      );
    }
    // Handle timeout
    if (error.code === "ECONNABORTED") {
      throw new ApiError(
        "Request timed out. Please try again.",
        "network",
        null,
        error.message
      );
    }
    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status;
      const details = error.response.data || "No additional details";
      console.log(
        "[notificationsApi] Server responded with status: " + status,
        "Details: " + JSON.stringify(details)
      );
      if (status === 401) {
        console.error("[notificationsApi] 401 Unauthorized - Clearing tokens");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        throw new ApiError(
          "Your session has expired. Please log in again.",
          "auth",
          status,
          details
        );
      } else if (status === 403) {
        throw new ApiError(
          "You are not authorized to view notifications.",
          "client",
          status,
          details
        );
      } else if (status === 404) {
        throw new ApiError(
          "No notifications found.",
          "client",
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
          "Failed to fetch notifications.",
          "client",
          status,
          details
        );
      }
    }
    // Handle network errors
    throw new ApiError(
      "We’re having trouble connecting. Please check your network and try again.",
      "network",
      null,
      error.message
    );
  } finally {
    // Clean up ongoing request
    ongoingRequests.delete(requestKey);
  }
};

/**
 * Updates the tenant's notification preferences.
 * @param {string} token - JWT token for authentication.
 * @param {Object} notificationsData - The notifications data (e.g., { emailNotifications, appNotifications, smsNotifications }).
 * @param {AbortSignal} signal - Signal to abort the request.
 * @returns {Promise<void>} Resolves when the preferences are updated.
 * @throws {ApiError} If the request fails.
 */
export const updateNotifications = async (token, notificationsData, signal) => {
  try {
    token = await ensureValidToken(token);
    if (!notificationsData || typeof notificationsData !== "object") {
      throw new ApiError(
        "Notifications data is required and must be an object",
        "client"
      );
    }
    const { emailNotifications, appNotifications, smsNotifications } =
      notificationsData;
    if (
      typeof emailNotifications !== "boolean" ||
      typeof appNotifications !== "boolean" ||
      typeof smsNotifications !== "boolean"
    ) {
      throw new ApiError(
        "Notification preferences must be boolean values",
        "client"
      );
    }
    console.log(
      "[notificationsApi] Updating notification preferences:",
      notificationsData
    );
    await axios.patch(
      `${BASE_URL}/api/users/me/notifications`,
      notificationsData,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      }
    );
    console.log(
      "[notificationsApi] Notification preferences updated successfully"
    );
  } catch (error) {
    console.error("[notificationsApi] Error in updateNotifications:", error);
    if (axios.isCancel(error)) {
      throw new ApiError(
        "Request to update notifications was cancelled",
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
        console.error("[notificationsApi] 401 Unauthorized - Clearing tokens");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        throw new ApiError(
          "Your session has expired. Please log in again.",
          "auth",
          status,
          details
        );
      } else if (status === 403) {
        throw new ApiError(
          "You are not authorized to update notification preferences.",
          "client",
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
          "Failed to update notification preferences.",
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
};

/**
 * Marks a notification as read.
 * @param {string} token - JWT token for authentication.
 * @param {string} notificationId - The ID of the notification.
 * @param {AbortSignal} signal - Signal to abort the request.
 * @returns {Promise<void>} Resolves when the notification is marked as read.
 * @throws {ApiError} If the request fails (e.g., 401, 403, 404).
 */
export const markNotificationAsRead = async (token, notificationId, signal) => {
  try {
    token = await ensureValidToken(token);
    if (!notificationId || typeof notificationId !== "string") {
      throw new ApiError(
        "Notification ID is required and must be a string",
        "client"
      );
    }
    console.log(
      "[notificationsApi] Marking notification as read:",
      notificationId
    );
    await axios.patch(
      `${BASE_URL}/api/notifications/tenant/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      }
    );
    console.log("[notificationsApi] Notification marked as read successfully");
  } catch (error) {
    console.error("[notificationsApi] Error in markNotificationAsRead:", error);
    if (axios.isCancel(error)) {
      throw new ApiError(
        `Request to mark notification ${notificationId} as read was cancelled`,
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
        console.error("[notificationsApi] 401 Unauthorized - Clearing tokens");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        throw new ApiError(
          "Your session has expired. Please log in again.",
          "auth",
          status,
          details
        );
      } else if (status === 403) {
        throw new ApiError(
          "You are not authorized to mark this notification as read.",
          "client",
          status,
          details
        );
      } else if (status === 404) {
        throw new ApiError(
          "Notification not found.",
          "client",
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
          `Failed to mark notification ${notificationId} as read.`,
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
};
