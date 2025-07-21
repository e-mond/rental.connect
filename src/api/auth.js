import axios from "axios";
import { BASE_URL } from "../config";

const authApi = {
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
        data: JSON.stringify(error.response?.data, null, 2),
        message: error.message,
      });
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/signin`,
        credentials
      );
      console.log("Login response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        data: JSON.stringify(error.response?.data, null, 2),
        message: error.message,
      });
      throw error;
    }
  },
};

export default authApi;
