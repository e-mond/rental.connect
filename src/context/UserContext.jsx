// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useUser } from "./useUser";
// import { jwtDecode } from "jwt-decode";

// /**
//  * Initializes the user session by checking for a JWT token in localStorage.
//  * Updates the user state and handles navigation based on authentication status.
//  */
// export function UserInitializer() {
//   const { user, loading, error, setUser, setLoading } = useUser();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const initializeUser = async () => {
//       const token = localStorage.getItem("token");
//       if (token && !user) {
//         try {
//           setLoading(true);
//           const decoded = jwtDecode(token);
//           const exp = decoded.exp * 1000;
//           const now = Date.now();

//           if (now > exp) {
//             console.log("Token expired, clearing and redirecting to login");
//             localStorage.removeItem("token");
//             setUser(null);
//             navigate(`/${decoded.role.toLowerCase()}login`);
//             return;
//           }

//           setUser({
//             email: decoded.sub,
//             role: decoded.role,
//             userId: decoded.userId,
//           });
//         } catch (err) {
//           console.error("Failed to decode token:", err.message);
//           localStorage.removeItem("token");
//           setUser(null);
//           navigate("/landlordlogin");
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     initializeUser();
//   }, [user, setUser, setLoading, navigate]);

//   useEffect(() => {
//     console.log("UserInitializer state:", {
//       user,
//       loading,
//       error,
//       pathname: location.pathname,
//     });

//     const publicRoutes = [
//       "/",
//       "/about",
//       "/contact",
//       "/tenantlogin",
//       "/landlordlogin",
//       "/signup",
//       "/auth/tenant",
//       "/auth/landlord",
//       "/landlord-signup",
//       "/account-success/tenant",
//       "/account-success/landlord",
//     ];

//     const isPublicRoute = publicRoutes.some(
//       (route) =>
//         location.pathname === route || location.pathname.startsWith(route)
//     );

//     if (loading === undefined || loading === null) {
//       console.warn("Loading state is undefined/null, skipping redirect");
//       return;
//     }

//     if (!loading) {
//       if (error || !user) {
//         if (isPublicRoute) {
//           console.log("Public route, no redirect needed");
//           return;
//         }

//         const redirectPath = location.pathname.includes("tenant")
//           ? "/tenantlogin"
//           : "/landlordlogin";
//         console.log(
//           `No user or error occurred, redirecting to ${redirectPath}`
//         );
//         navigate(redirectPath);
//       } else {
//         if (
//           user.role === "TENANT" &&
//           !location.pathname.startsWith("/dashboard/tenant") &&
//           !location.pathname.startsWith("/account-success/tenant")
//         ) {
//           console.log("Redirecting TENANT to /dashboard/tenant");
//           navigate("/dashboard/tenant");
//         } else if (
//           user.role === "LANDLORD" &&
//           !location.pathname.startsWith("/dashboard/landlord") &&
//           !location.pathname.startsWith("/account-success/landlord")
//         ) {
//           console.log("Redirecting LANDLORD to /dashboard/landlord");
//           navigate("/dashboard/landlord");
//         }
//       }
//     }
//   }, [user, loading, error, location.pathname, navigate]);

//   return null;
// }


import { createContext } from "react";

export const UserContext = createContext();