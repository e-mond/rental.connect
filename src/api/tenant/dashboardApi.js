import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const ongoingRequests = new Map();

const dashboardApi = {
  /**
   * Fetches tenant dashboard data (e.g., summary of payments, leases).
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The dashboard data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  fetchDashboard: async (token, signal) => {
    console.log("[dashboardApi] Starting fetchDashboard...");
    const requestKey = "fetchDashboard";

    if (ongoingRequests.has(requestKey)) {
      console.log(
        "[dashboardApi] Ongoing fetchDashboard detected, aborting new request"
      );
      throw new ApiError(
        "Another fetch dashboard request is already in progress",
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
        "[dashboardApi] Fetching dashboard with token:",
        token.substring(0, 10) + "..."
      );
      requestPromise = axios.get(`${BASE_URL}/api/tenant/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      ongoingRequests.set(requestKey, requestPromise);

      const response = await requestPromise;
      console.log(
        "[dashboardApi] Dashboard fetched successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch dashboard was cancelled",
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
          console.error("[dashboardApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to fetch dashboard data.",
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
   * Fetches recent activity for the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Array>} Array of recent activity data.
   * @throws {ApiError} If the request fails.
   */
  fetchRecentActivity: async (token, signal) => {
    try {
      token = await ensureValidToken(token);
      console.log(
        "[dashboardApi] Fetching recent activity with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.get(`${BASE_URL}/api/tenant/activities`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log("[dashboardApi] Recent activity response:", {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error) {
      console.error("[dashboardApi] Error fetching recent activity:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch recent activity was cancelled",
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
          console.error("[dashboardApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to fetch recent activity.",
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

export default dashboardApi;
