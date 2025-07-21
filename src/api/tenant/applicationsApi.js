import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const applicationsApi = {
  /**
   * Fetches tenant applications (e.g., lease applications).
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} Array of application data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  fetchApplications: async (token, signal) => {
    try {
      token = await ensureValidToken(token);
      console.log(
        "[applicationsApi] Fetching applications with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.get(`${BASE_URL}/api/applications/tenant`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log(
        "[applicationsApi] Applications fetched successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch applications was cancelled",
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
          console.error("[applicationsApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to fetch applications.",
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

export default applicationsApi;
