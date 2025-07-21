import { makeAuthenticatedRequest } from "./tokenUtils";

const fetchDashboardData = async (token) => {
  if (!token) throw new Error("No authentication token provided");
  try {
    console.log(
      "[landlordApi] fetchDashboardData: Initiating request with token:",
      token.slice(0, 20) + "..."
    );
    const response = await makeAuthenticatedRequest(
      "get",
      `/api/landlord/dashboard-data`,
      token,
      null,
      {
        "Content-Type": "application/json",
      }
    );
    console.log(
      "[landlordApi] fetchDashboardData: Response data:",
      response.data
    );
    return response.data || {};
  } catch (error) {
    console.error("[landlordApi] fetchDashboardData: Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Unauthorized: Please log in again");
    }
    throw new Error(
      error.response?.data?.error || "Failed to fetch dashboard data"
    );
  }
};

export { fetchDashboardData };
