import landlordApi from "./apiClient";
import { welcome } from "./authApi";
import { fetchDashboardData } from "./dashboardApi";
import {
  fetchProperties,
  fetchAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
} from "./propertiesApi";
import {
  fetchNotifications,
  updateNotificationStatus,
  clearNotifications,
} from "./notificationsApi";
import {
  fetchProfile,
  uploadProfilePicture,
  updateProfile,
  fetchPublicKey,
  savePublicKey,
} from "./profileApi";
import { fetchMaintenanceRequests } from "./maintenanceApi";
import { fetchLeases, fetchLeaseRenewals } from "./leasesApi";
import { fetchMessages, updateMessageStatus, sendMessage } from "./messagesApi";
import {
  fetchPayments,
  recordPayment,
  notifyPayment,
  updatePayment,
  deletePayment,
} from "./paymentsApi";
import {
  fetchDocuments,
  uploadDocument,
  renameDocument,
  deleteDocument,
  downloadDocument,
} from "./documentsApi";
import { fetchTransactions } from "./transactionsApi";

export default {
  ...landlordApi,
  welcome,
  fetchDashboardData,
  fetchProperties,
  fetchAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  fetchNotifications,
  updateNotificationStatus,
  clearNotifications,
  fetchProfile,
  uploadProfilePicture,
  updateProfile,
  fetchPublicKey,
  savePublicKey,
  fetchMaintenanceRequests,
  fetchLeases,
  fetchLeaseRenewals,
  fetchMessages,
  updateMessageStatus,
  sendMessage,
  fetchPayments,
  recordPayment,
  notifyPayment,
  updatePayment,
  deletePayment,
  fetchTransactions,
  fetchDocuments,
  uploadDocument,
  renameDocument,
  deleteDocument,
  downloadDocument,
};
