import axios from "axios";
import { BASE_URL } from "../../config";
import { ApiError } from "./ApiError";
import { ensureValidToken } from "./authUtils";

const paymentsApi = {
  /**
   * Fetches tenant payment history.
   * Compatible with PaymentController.getTenantPayments.
   * @param {string} token - JWT token for authentication.
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The tenant's payment data.
   * @throws {ApiError} If the request fails (e.g., 401, 403, 500).
   */
  fetchPayments: async (token, signal) => {
    try {
      token = await ensureValidToken(token);
      console.log(
        "[paymentsApi] Fetching payments with token:",
        token.substring(0, 10) + "..."
      );
      const response = await axios.get(`${BASE_URL}/api/payments/tenant/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      console.log(
        "[paymentsApi] Payments fetched successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to fetch payments was cancelled",
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
          console.error("[paymentsApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to view payment history.",
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
            "Failed to fetch payment data.",
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
   * Processes a payment for the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {string} paymentId - The ID of the payment to process.
   * @param {Object} paymentDetails - Payment details (e.g., amount, paymentMethod).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The processed payment data.
   * @throws {ApiError} If the request fails (e.g., invalid input, 401, 403, 404).
   */
  processPayment: async (token, paymentId, paymentDetails, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!paymentId || typeof paymentId !== "string") {
        throw new ApiError(
          "Payment ID is required and must be a string",
          "client"
        );
      }
      if (!paymentDetails || typeof paymentDetails !== "object") {
        throw new ApiError(
          "Payment details are required and must be an object",
          "client"
        );
      }
      const { amount, paymentMethod } = paymentDetails;
      if (!amount || typeof amount !== "number" || amount <= 0) {
        throw new ApiError(
          "Amount is required and must be a positive number",
          "client"
        );
      }
      if (!paymentMethod || typeof paymentMethod !== "string") {
        throw new ApiError(
          "Payment method is required and must be a string",
          "client"
        );
      }
      console.log("[paymentsApi] Processing payment for ID:", paymentId);
      const response = await axios.post(
        `${BASE_URL}/api/payments/tenant/process/${paymentId}`,
        paymentDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[paymentsApi] Payment processed successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to process payment was cancelled",
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
          console.error("[paymentsApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to process this payment.",
            "client",
            status,
            details
          );
        } else if (status === 404) {
          throw new ApiError("Payment not found.", "client", status, details);
        } else if (status >= 500) {
          throw new ApiError(
            "The server is currently unavailable. Please try again later.",
            "server",
            status,
            details
          );
        } else {
          throw new ApiError(
            "Failed to process payment.",
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
   * Initiates a Mobile Money (Momo) payment for the tenant.
   * @param {string} token - JWT token for authentication.
   * @param {Object} momoData - Momo payment data (e.g., network, number, amount).
   * @param {AbortSignal} signal - Signal to abort the request.
   * @returns {Promise<Object>} The initiated Momo payment data.
   * @throws {ApiError} If the request fails (e.g., invalid input, 401, 403).
   */
  initiateMomoPayment: async (token, momoData, signal) => {
    try {
      token = await ensureValidToken(token);
      if (!momoData || typeof momoData !== "object") {
        throw new ApiError(
          "Momo payment data is required and must be an object",
          "client"
        );
      }
      const { network, number, amount } = momoData;
      if (!network || typeof network !== "string") {
        throw new ApiError(
          "Network is required and must be a string",
          "client"
        );
      }
      if (!number || typeof number !== "string") {
        throw new ApiError(
          "Phone number is required and must be a string",
          "client"
        );
      }
      if (!amount || typeof amount !== "number" || amount <= 0) {
        throw new ApiError(
          "Amount is required and must be a positive number",
          "client"
        );
      }
      console.log("[paymentsApi] Initiating Momo payment with data:", momoData);
      const response = await axios.post(
        `${BASE_URL}/api/payments/tenant/momo`,
        momoData,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        }
      );
      console.log(
        "[paymentsApi] Momo payment initiated successfully:",
        response.data
      );
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new ApiError(
          "Request to initiate Momo payment was cancelled",
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
          console.error("[paymentsApi] 401 Unauthorized - Clearing tokens");
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
            "You are not authorized to initiate a Momo payment.",
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
            "Failed to initiate Momo payment.",
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

export default paymentsApi;
