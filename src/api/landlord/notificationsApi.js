import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchNotifications = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchNotifications: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/notifications/landlord/all`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] fetchNotifications: Response data:",
      response.data
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchNotifications: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch notifications"
    );
  }
};

const updateNotificationStatus = async (token, notificationId, isRead) => {
  if (!token) throw new Error("No authentication token provided");
  if (!notificationId) throw new Error("Notification ID is required");
  if (typeof isRead !== "boolean") throw new Error("isRead must be a boolean");
  try {
    console.log(
      "[landlordApi] updateNotificationStatus: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "patch",
      `/api/landlord/notifications/${notificationId}`,
      token,
      { isRead },
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] updateNotificationStatus: Response data:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("[landlordApi] updateNotificationStatus: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to update notification status"
    );
  }
};

const clearNotifications = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] clearNotifications: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "delete",
      `/api/landlord/notifications`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] clearNotifications: Response data:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("[landlordApi] clearNotifications: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to clear notifications"
    );
  }
};

export { fetchNotifications, updateNotificationStatus, clearNotifications };
