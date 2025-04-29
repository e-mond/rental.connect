import axios from "axios";
import { BASE_URL } from "../config";

/**
 * Tenant API client for interacting with tenant-specific backend endpoints.
 * All methods require a valid JWT token for authentication and use axios for HTTP requests.
 */
const tenantApi = {
  /**
   * Fetches tenant dashboard data.
   * @param {string} token - JWT token for authentication.
   * @returns {Promise<Object>} Dashboard data.
   * @throws {Error} If the request fails (e.g., network error, unauthorized).
   */
  fetchDashboard: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tenant/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 401
          ? "authentication_required"
          : error.message.includes("Network")
          ? "network_error"
          : `Failed to fetch dashboard: ${error.message}`
      );
    }
  },

  /**
   * Fetches tenant payment history.
   * @param {string} token - JWT token for authentication.
   * @returns {Promise<Object>} Payment data.
   * @throws {Error} If the request fails (e.g., network error, unauthorized).
   */
  fetchPayments: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tenant/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 401
          ? "authentication_required"
          : error.message.includes("Network")
          ? "network_error"
          : `Failed to fetch payments: ${error.message}`
      );
    }
  },

  /**
   * Fetches tenant maintenance requests.
   * @param {string} token - JWT token for authentication.
   * @returns {Promise<Object>} Maintenance request data.
   * @throws {Error} If the request fails (e.g., network error, unauthorized).
   */
  fetchMaintenanceRequests: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tenant/maintenance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.status === 401
          ? "authentication_required"
          : error.message.includes("Network")
          ? "network_error"
          : `Failed to fetch maintenance requests: ${error.message}`
      );
    }
  },
};

export default tenantApi;
