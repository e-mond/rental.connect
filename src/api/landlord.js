import axios from "axios";
import { BASE_URL } from "../config";

const landlordApi = {
  fetchMaintenance: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/landlord/maintenance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  scheduleMaintenance: async (token, requestData) => {
    const response = await axios.post(
      `${BASE_URL}/api/landlord/maintenance`,
      requestData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  fetchMessages: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/landlord/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  sendMessage: async (token, messageData) => {
    const response = await axios.post(
      `${BASE_URL}/api/landlord/messages`,
      messageData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  fetchSettings: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/landlord/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  updateProfile: async (token, formData) => {
    const response = await axios.patch(
      `${BASE_URL}/api/landlord/profile`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  changePassword: async (token, passwordData) => {
    const response = await axios.patch(
      `${BASE_URL}/api/landlord/password`,
      passwordData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  updateNotifications: async (token, notificationData) => {
    const response = await axios.patch(
      `${BASE_URL}/api/landlord/notifications`,
      notificationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  deleteAccount: async (token) => {
    const response = await axios.delete(`${BASE_URL}/api/landlord/account`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  fetchPayments: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/landlord/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  deletePayment: async (token, paymentId) => {
    const response = await axios.delete(
      `${BASE_URL}/api/landlord/payments/${paymentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
  fetchDocuments: async (token) => {
    const response = await axios.get(`${BASE_URL}/api/landlord/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  uploadDocument: async (token, formData) => {
    const response = await axios.post(
      `${BASE_URL}/api/landlord/documents`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is automatically set to multipart/form-data by axios
        },
      }
    );
    return response.data;
  },
  deleteDocument: async (token, docId) => {
    const response = await axios.delete(
      `${BASE_URL}/api/landlord/documents/${docId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

export default landlordApi;
