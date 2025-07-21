import messagesApi from "./messagesApi";
import dashboardApi from "./dashboardApi";
import profileApi from "./profileApi";
import paymentsApi from "./paymentsApi";
import maintenanceApi from "./maintenanceApi";
import propertiesApi from "./propertiesApi";
import applicationsApi from "./applicationsApi";
import supportApi from "./supportApi";
import {
  fetchNotifications,
  updateNotifications,
  markNotificationAsRead,
} from "./notificationsApi";

const withRetry = async (fn, args = [], maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn(...args);
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

const tenantApi = {
  withRetry,

  // Messages API methods
  fetchMessages: messagesApi.fetchMessages,
  fetchMessageById: messagesApi.fetchMessageById,
  sendMessage: messagesApi.sendMessage,

  // Dashboard API methods
  fetchDashboard: dashboardApi.fetchDashboard,
  fetchRecentActivity: dashboardApi.fetchRecentActivity,

  // Profile API methods
  fetchUserProfile: profileApi.fetchProfile,
  updateProfilePicture: profileApi.updateProfilePicture,
  updateProfile: profileApi.updateProfile,
  updatePassword: profileApi.updatePassword,

  // Payments API methods
  fetchPayments: paymentsApi.fetchPayments,
  processPayment: paymentsApi.processPayment,
  initiateMomoPayment: paymentsApi.initiateMomoPayment,

  // Maintenance API methods
  fetchMaintenance: maintenanceApi.fetchMaintenance,
  fetchMaintenanceRequestById: maintenanceApi.fetchMaintenanceRequestById,
  updateMaintenanceRequest: maintenanceApi.updateMaintenanceRequest,
  cancelMaintenanceRequest: maintenanceApi.cancelMaintenanceRequest,
  submitMaintenanceRequest: maintenanceApi.submitMaintenanceRequest,

  // Notifications API methods
  fetchNotifications,
  updateNotifications,
  markNotificationAsRead,

  // Properties API methods
  fetchProperties: propertiesApi.fetchProperties,
  fetchPropertyById: propertiesApi.fetchPropertyById,
  fetchLeasedProperties: propertiesApi.fetchLeasedProperties,

  // Applications API methods
  fetchApplications: applicationsApi.fetchApplications,

  // Support API methods
  initiateSupportRequest: supportApi.initiateSupportRequest,

  // Activity API methods
  logActivity: async (
    token,
    { type, message, entityId, landlordId = null },
    signal
  ) => {
    if (!token || !type || !message || !entityId) {
      throw new Error(
        "Missing required fields: token, type, message, or entityId"
      );
    }
    try {
      const response = await fetch("/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, message, entityId, landlordId }),
        signal,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to log activity: ${response.status} ${errorText}`
        );
      }
      return true;
    } catch (error) {
      console.error("logActivity error:", error);
      throw error;
    }
  },
};

export default tenantApi;
