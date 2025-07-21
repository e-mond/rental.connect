import { makeAuthenticatedRequest } from "./tokenUtils";

// Welcome endpoint to test authentication
const welcome = async (token) => {
  if (!token) throw new Error("Authentication token is required");
  const response = await makeAuthenticatedRequest(
    "get",
    `/api/auth/welcome`,
    token,
    null,
    {
      "Content-Type": "application/json",
    }
  );
  return response.data;
};

export { welcome };
