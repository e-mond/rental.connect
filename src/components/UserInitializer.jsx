import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function UserInitializer() {
  const { user, loading, error, setUser, setLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for token on page load and set user if token exists
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          setLoading(true);
          // Decode the token to extract user details
          const payload = JSON.parse(atob(token.split(".")[1]));
          const role = payload.role;
          const exp = payload.exp * 1000; // Convert to milliseconds
          const now = Date.now();

          if (now > exp) {
            // Token expired, clear it and redirect to login
            localStorage.removeItem("token");
            setUser(null);
            navigate("/landlordlogin");
            return;
          }

          // Set user in context
          setUser({
            email: payload.sub,
            role: role,
            id: payload.id,
          });
        } catch (err) {
          console.error("Failed to decode token:", err);
          localStorage.removeItem("token");
          setUser(null);
          navigate("/landlordlogin");
        } finally {
          setLoading(false);
        }
      }
    };

    initializeUser();
  }, [setUser, setLoading, navigate]);

  useEffect(() => {
    console.log("UserInitializer state:", {
      user,
      loading,
      error,
      pathname: location.pathname,
    });

    // Define public routes that don't require login
    const publicRoutes = [
      "/",
      "/about",
      "/contact",
      "/tenantlogin",
      "/landlordlogin",
      "/signup",
      "/auth/tenant",
      "/auth/landlord",
      "/landlord-signup",
      // Removed /dashboard routes as they should be protected
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(
      (route) =>
        location.pathname === route || location.pathname.startsWith(route)
    );

    if (loading === undefined || loading === null) {
      console.warn("Loading state is undefined/null, skipping redirect");
      return;
    }

    if (!loading) {
      if (error || !user) {
        // Skip redirect for public routes
        if (isPublicRoute) {
          console.log("Public route, no redirect needed");
          return;
        }

        // Redirect to appropriate login page based on the attempted route
        if (location.pathname.startsWith("/dashboard/landlord")) {
          console.log("Redirecting to landlord login");
          navigate("/landlordlogin");
        } else {
          console.log("No user or error occurred, redirecting to tenant login");
          navigate("/tenantlogin");
        }
      } else {
        // Redirect logged-in users to their respective dashboards
        if (
          user.role === "TENANT" &&
          !location.pathname.startsWith("/dashboard/tenant") &&
          !location.pathname.startsWith("/account-success/tenant")
        ) {
          console.log("Redirecting TENANT to /dashboard/tenant");
          navigate("/dashboard/tenant");
        } else if (
          user.role === "LANDLORD" &&
          !location.pathname.startsWith("/dashboard/landlord") &&
          !location.pathname.startsWith("/account-success/landlord")
        ) {
          console.log("Redirecting LANDLORD to /dashboard/landlord");
          navigate("/dashboard/landlord");
        }
      }
    }
  }, [user, loading, error, location.pathname, navigate]);

  return null;
}
