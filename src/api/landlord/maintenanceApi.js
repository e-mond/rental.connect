import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchMaintenanceRequests = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchMaintenanceRequests: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/maintenance`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] fetchMaintenanceRequests: Response data:",
      response.data
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[landlordApi] fetchMaintenanceRequests: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch maintenance requests"
    );
  }
};

export { fetchMaintenanceRequests };
