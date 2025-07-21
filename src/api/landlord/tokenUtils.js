import axios from "axios";

// Check if a JWT token is expired by decoding its payload
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000;
    const currentTime = Date.now();
    console.log(
      "[landlordApi] Token expiration check - Exp:",
      new Date(expiration),
      "Current:",
      new Date(currentTime)
    );
    return currentTime >= expiration;
  } catch {
    console.error("[landlordApi] Error decoding token");
    return true;
  }
};

// Refresh an expired token
const refreshToken = async (token) => {
  try {
    console.log("[landlordApi] Attempting to refresh token...");
    const response = await axios.post(
      `/api/auth/refresh`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    console.log("[landlordApi] Token refreshed successfully");
    return newToken;
  } catch (error) {
    console.error("[landlordApi] Token refresh failed:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to refresh token");
  }
};

// Handle authenticated API requests with token refresh
const makeAuthenticatedRequest = async (
  method,
  url,
  token,
  data = null,
  headers = {}
) => {
  if (isTokenExpired(token)) {
    console.log("[landlordApi] Token expired for request to:", url);
    try {
      token = await refreshToken(token);
    } catch (error) {
      console.error(
        "[landlordApi] Unable to refresh token, redirecting to login...",
        error
      );
      localStorage.removeItem("token");
      window.location.href = "/landlordlogin";
      throw new Error("Token expired and refresh failed");
    }
  }
  console.log(
    "[landlordApi] Sending request to:",
    url,
    "with token:",
    token.slice(0, 20) + "..."
  );
  try {
    const config = {
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    };
    // Ensure Content-Type is unset for FormData
    if (data instanceof FormData) {
      delete config.headers["Content-Type"];
      console.log("[landlordApi] FormData detected, Content-Type unset");
      // Log FormData contents for debugging
      for (const [key, value] of data.entries()) {
        console.log(
          `[landlordApi] FormData content: ${key}=${
            value instanceof File ? value.name : value
          }`
        );
      }
    }
    console.log("[landlordApi] Request config:", {
      method: config.method,
      url: config.url,
      headers: config.headers,
      hasData: !!config.data,
      isFormData: config.data instanceof FormData,
    });
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("[landlordApi] makeAuthenticatedRequest: Error:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      url,
      method,
    });
    throw error;
  }
};

export { isTokenExpired, refreshToken, makeAuthenticatedRequest };
