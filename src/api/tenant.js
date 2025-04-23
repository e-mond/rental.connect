import axios from "axios";
import { BASE_URL } from "../config";

const tenantApi = {
  fetchDashboard: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/tenant/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  fetchPayments: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/tenant/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default tenantApi;
