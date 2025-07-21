import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const maintenanceApi = {
  /**
   * Fetches tenant maintenance requests.
   * Prevents duplicate requests using _ongoingRequests.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The maintenance request data.
   * @throws {ApiError} If the request fails (e.g., 401, 500).
   */
  _ongoingRequests: new Map(),
  fetchMaintenance: async (token, signal) => {
    console.log("[maintenanceApi] Starting fetchMaintenance...");
    const requestKey = "fetchMaintenance";

    if (maintenanceApi._ongoingRequests.has(requestKey)) {
      console.log(
        "[maintenanceApi] Ongoing fetchMaintenance detected, aborting new request"
      );
      throw new ApiError(
        "Another fetch maintenance request is already in progress",
        "cancelled"
      );
    }

    let requestPromise;
    try {
      token = token || localStorage.getItem("token");
      if (!token) {
        console.error(
          "[maintenanceApi] No token found in localStorage or arguments"
        );
        throw new ApiError(
          "Authentication token is missing. Please log in again.",
          "auth"
        );
      }
      console.log("[maintenanceApi] Validating token...");
      token = await ensureValidToken(token);
      console.log(
        "[maintenanceApi] Token validated, making request with token:",
        token.substring(0, 10) + "..."
      );

      requestPromise = axios.get(`${BASE_URL}/api/tenant/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      maintenanceApi._ongoingRequests.set(requestKey, requestPromise);

      const response = await requestPromise;
      console.log(
        "[maintenanceApi] Successfully fetched maintenance requests:",
        response.data
      );
      return response.data;
    } catch (error) {
      console.error("[maintenanceApi] Error in fetchMaintenance:", error);
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch maintenance requests was cancelled",
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
        console.log(
          "[maintenanceApi] Server responded with status: " + status,
          "Details: " + JSON.stringify(details)
        );
        if (status === 401) {
          console.error("[maintenanceApi] 401 Unauthorized - Clearing tokens");
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
            "Failed to fetch maintenance requests.",
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
      maintenanceApi._ongoingRequests.delete(requestKey);
    }
  },

  /**
   * Fetches a single maintenance request by ID.
   * @param {string} token - JWT token for authentication.
   * @param {string} requestId - The ID of the maintenance request.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The maintenance request data.
   * @throws {ApiError} If the request fails (e.g., invalid ID, 401, 500).
   */
  fetchMaintenanceRequestById: async (token, requestId, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!requestId || typeof requestId !== "string") {
        throw new ApiError(
          "Maintenance request ID is required and must be a string",
          "client"
        );
      }
      console.log("[maintenanceApi] Fetching maintenance request:", requestId);
      const response = await axios.get(
        `${BASE_URL}/api/tenant/maintenance/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[maintenanceApi] Maintenance request fetched successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          `Request to fetch maintenance request ${requestId} was cancelled`,
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
          console.error("[maintenanceApi] 401 Unauthorized - Clearing tokens");
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
            `Failed to fetch maintenance request ${requestId}.`,
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
   * Updates a maintenance request.
   * @param {string} token - JWT token for authentication.
   * @param {string} requestId - The ID of the maintenance request.
   * @param {Object} requestData - Updated data (e.g., type, details).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The updated maintenance request data.
   * @throws {ApiError} If the request fails (e.g., invalid input, 401, 403).
   */
  updateMaintenanceRequest: async (token, requestId, requestData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!requestId || typeof requestId !== "string") {
        throw new ApiError(
          "Maintenance request ID is required and must be a string",
          "client"
        );
      }
      if (!requestData || typeof requestData !== "object") {
        throw new ApiError(
          "Request data is required and must be an object",
          "client"
        );
      }
      const { type, details } = requestData;
      if (!type || !details) {
        throw new ApiError("Type and details are required", "client");
      }
      console.log("[maintenanceApi] Updating maintenance request:", requestId);
      const response = await axios.put(
        `${BASE_URL}/api/tenant/maintenance/${requestId}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[maintenanceApi] Maintenance request updated successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          `Request to update maintenance request ${requestId} was cancelled`,
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
          console.error("[maintenanceApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to update this maintenance request.",
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
            `Failed to update maintenance request ${requestId}.`,
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
   * Cancels a maintenance request.
   * @param {string} token - JWT token for authentication.
   * @param {string} requestId - The ID of the maintenance request.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<void>} Resolves when the request is cancelled.
   * @throws {ApiError} If the request fails (e.g., invalid ID, 401, 403, 404).
   */
  cancelMaintenanceRequest: async (token, requestId, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!requestId || typeof requestId !== "string") {
        throw new ApiError(
          "Maintenance request ID is required and must be a string",
          "client"
        );
      }
      console.log(
        "[maintenanceApi] Cancelling maintenance request:",
        requestId
      );
      await axios.delete(`${BASE_URL}/api/tenant/maintenance/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log(
        "[maintenanceApi] Maintenance request cancelled successfully"
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          `Request to cancel maintenance request ${requestId} was cancelled`,
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
          console.error("[maintenanceApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to cancel this maintenance request.",
            "client",
            status,
            details
          );
        } else if (status === 404) {
          throw new ApiError(
            "Maintenance request not found.",
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
            `Failed to cancel maintenance request ${requestId}.`,
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
   * Submits a new maintenance request.
   * @param {string} token - JWT token for authentication.
   * @param {Object} requestData - Maintenance request data (e.g., type, details, address, status).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The submitted maintenance request data.
   * @throws {ApiError} If the request fails (e.g., invalid input, 401, 403).
   */
  submitMaintenanceRequest: async (token, requestData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!requestData || typeof requestData !== "object") {
        throw new ApiError(
          "Request data is required and must be an object",
          "client"
        );
      }
      const { type, details, address, status } = requestData;
      if (!type || !details || !address || !status) {
        throw new ApiError(
          "Type, details, address, and status are required",
          "client"
        );
      }
      console.log(
        "[maintenanceApi] Submitting maintenance request:",
        requestData
      );
      const response = await axios.post(
        `${BASE_URL}/api/tenant/maintenance`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[maintenanceApi] Maintenance request submitted successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to submit maintenance request was cancelled",
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
          console.error("[maintenanceApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to submit a maintenance request.",
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
            "Failed to submit maintenance request.",
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

export default maintenanceApi;
