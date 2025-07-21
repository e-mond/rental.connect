import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const supportApi = {
  /**
   * Initiates a support request for the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {Object} supportData - Support request data (e.g., subject, message).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The initiated support request data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  initiateSupportRequest: async (token, supportData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!supportData || typeof supportData !== "object") {
        throw new ApiError(
          "Support request data is required and must be an object",
          "client"
        );
      }
      const { subject, message } = supportData;
      if (!subject || !message) {
        throw new ApiError(
          "Subject and message are required for support request",
          "client"
        );
      }
      console.log(
        "[supportApi] Initiating support request with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.post(
        `${BASE_URL}/api/tenant/support`,
        supportData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[supportApi] Support request initiated successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to initiate support request was cancelled",
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
          console.error("[supportApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to initiate support request.",
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

export default supportApi;
