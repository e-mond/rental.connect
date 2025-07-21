import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchTransactions = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchTransactions: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/transactions/landlord`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] fetchTransactions: Response data:",
      response.data
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchTransactions: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch transactions"
    );
  }
};

export { fetchTransactions };
