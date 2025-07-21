import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchPayments = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchPayments: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/payments`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchPayments: Response data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchPayments: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to fetch payments");
  }
};

const recordPayment = async (token, paymentData) => {
  if (!token) throw new Error("No authentication token provided");
  if (
    !paymentData.name ||
    !paymentData.apt ||
    !paymentData.amount ||
    !paymentData.date ||
    !paymentData.status
  ) {
    throw new Error(
      "All payment fields (name, apt, amount, date, status) are required"
    );
  }
  try {
    console.log(
      "[landlordApi] recordPayment: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "post",
      `/api/landlord/payments`,
      token,
      paymentData,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] recordPayment: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] recordPayment: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to record payment");
  }
};

const notifyPayment = async (token, paymentData) => {
  if (!token) throw new Error("No authentication token provided");
  if (
    !paymentData.paymentId ||
    !paymentData.amount ||
    !paymentData.status ||
    !paymentData.paymentMethod
  ) {
    throw new Error(
      "All payment fields (paymentId, amount, status, paymentMethod) are required"
    );
  }
  try {
    console.log(
      "[landlordApi] notifyPayment: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const payments = await fetchPayments(token);
    const payment = payments.find((p) => p.id === paymentData.paymentId);
    if (!payment) throw new Error("Payment not found");
    const updatedPaymentData = {
      name: payment.name,
      apt: payment.apt,
      amount: paymentData.amount,
      date: payment.date,
      status: paymentData.status,
      paymentMethod: paymentData.paymentMethod,
    };
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/landlord/payments/${paymentData.paymentId}`,
      token,
      updatedPaymentData,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] notifyPayment: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] notifyPayment: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to process payment notification"
    );
  }
};

const updatePayment = async (token, paymentId, paymentData) => {
  if (!token) throw new Error("No authentication token provided");
  if (!paymentId) throw new Error("Payment ID is required");
  if (
    !paymentData.name ||
    !paymentData.apt ||
    !paymentData.amount ||
    !paymentData.date ||
    !paymentData.status
  ) {
    throw new Error(
      "All payment fields (name, apt, amount, date, status) are required"
    );
  }
  try {
    console.log(
      "[landlordApi] updatePayment: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "put",
      `/api/landlord/payments/${paymentId}`,
      token,
      paymentData,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] updatePayment: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] updatePayment: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to update payment");
  }
};

const deletePayment = async (token, paymentId) => {
  if (!token) throw new Error("No authentication token provided");
  if (!paymentId) throw new Error("Payment ID is required");
  try {
    console.log(
      "[landlordApi] deletePayment: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "delete",
      `/api/landlord/payments/${paymentId}`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] deletePayment: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("[landlordApi] deletePayment: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to delete payment");
  }
};

export {
  fetchPayments,
  recordPayment,
  notifyPayment,
  updatePayment,
  deletePayment,
};
