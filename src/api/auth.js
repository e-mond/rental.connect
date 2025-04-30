import axios from "axios";
import { BASE_URL } from "../config";

/**
 * API client for authentication-related endpoints.
 */
const authApi = {
  /**
   * Signs up a new user.
   * @param {Object} userData - The signup payload containing user details.
   * @returns {Promise<Object>} - The response data from the server.
   */
  signup: async (userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signup`,
        userData
      );
      console.log("Signup API response:", response);
      console.log("Signup API response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Signup error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Logs in a user.
   * @param {Object} credentials - The login payload containing email and password.
   * @returns {Promise<Object>} - The response data from the server.
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        credentials
      );
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};

export default authApi;