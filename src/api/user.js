import axios from "axios";
import { BASE_URL } from "../config";

const userApi = {
  fetchUser: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  fetchNotificationCount: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/notifications/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.count; // Assuming { count: 3 }
  },
};

export default userApi;
