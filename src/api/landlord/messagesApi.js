import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchMessages = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchMessages: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/messages`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchMessages: Response data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchMessages: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to fetch messages");
  }
};

const updateMessageStatus = async (token, messageId, isRead) => {
  if (!token) throw new Error("No authentication token provided");
  if (!messageId) throw new Error("Message ID is required");
  if (typeof isRead !== "boolean") throw new Error("isRead must be a boolean");
  try {
    console.log(
      "[landlordApi] updateMessageStatus: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "patch",
      `/api/landlord/messages/${messageId}`,
      token,
      { isRead },
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] updateMessageStatus: Response data:",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("[landlordApi] updateMessageStatus: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to update message status"
    );
  }
};

const sendMessage = async (
  token,
  { encryptedContent, encryptedKey, recipientId, propertyId, replyToId }
) => {
  if (!token) throw new Error("No authentication token provided");
  if (!encryptedContent || !encryptedKey || !recipientId || !propertyId) {
    throw new Error(
      "encryptedContent, encryptedKey, recipientId, and propertyId are required"
    );
  }
  try {
    console.log(
      "[landlordApi] sendMessage: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "post",
      `/api/landlord/messages`,
      token,
      {
        encryptedContent,
        encryptedKey,
        recipientId,
        propertyId,
        replyToId,
      },
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] sendMessage: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] sendMessage: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
};

export { fetchMessages, updateMessageStatus, sendMessage };
