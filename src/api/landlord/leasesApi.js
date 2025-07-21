import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchLeases = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchLeases: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/leases/all`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("[landlordApi] fetchLeases: Response data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchLeases: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(error.response?.data?.error || "Failed to fetch leases");
  }
};

const fetchLeaseRenewals = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchLeaseRenewals: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/leases/renewals`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] fetchLeaseRenewals: Response data:",
      response.data
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchLeaseRenewals: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch lease renewals"
    );
  }
};

export { fetchLeases, fetchLeaseRenewals };
