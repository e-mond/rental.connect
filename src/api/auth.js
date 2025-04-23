import axios from "axios";
import { BASE_URL } from "../config";

const authApi = {
  signup: async (userData) => {
    const response = await axios.post(
      `${BASE_URL}/api/auth/register`,
      userData
    );
    return response.data;
  },
  login: async (credentials) => {
    const response = await axios.post(
      `${BASE_URL}/api/auth/login`,
      credentials
    );
    return response.data;
  },
};

export default authApi;
