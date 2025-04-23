// // // src/components/ProtectedRoute.jsx

// // import { Navigate } from "react-router-dom";
// // import PropTypes from "prop-types";

// // /**
// //  * ProtectedRoute component to restrict access to authenticated users only.
// //  * Redirects unauthenticated users to the appropriate login page based on the route.
// //  * @param {Object} props - Component props
// //  * @param {React.ReactNode} props.children - The child components to render if authenticated
// //  * @param {string} props.redirectTo - The login route to redirect to if unauthenticated
// //  */
// // const ProtectedRoute = ({ children, redirectTo }) => {
// //   // Check if the user is authenticated (simulated with localStorage for now)
// //   const isAuthenticated = !!localStorage.getItem("token");

// //   // If authenticated, render the children; otherwise, redirect to the login page
// //   return isAuthenticated ? children : <Navigate to={redirectTo} />;
// // };

// // // Add PropTypes validation
// // ProtectedRoute.propTypes = {
// //   children: PropTypes.node.isRequired, // Validate that children is a React node (e.g., JSX elements)
// //   redirectTo: PropTypes.string.isRequired, // Validate that redirectTo is a string
// // };

// // export default ProtectedRoute;


// // src/components/ProtectedRoute.jsx

// // import { Navigate } from "react-router-dom";
// // import PropTypes from "prop-types";

// // const ProtectedRoute = ({ children, redirectTo }) => {
// //   const token = localStorage.getItem("token");
// //   const userData = localStorage.getItem("user");
// //   let user = null;

// //   console.log("ProtectedRoute - token:", token); // Debug log
// //   console.log("ProtectedRoute - userData:", userData); // Debug log

// //   if (userData) {
// //     try {
// //       user = JSON.parse(userData);
// //       console.log("ProtectedRoute - parsed user:", user); // Debug log
// //     } catch (err) {
// //       console.error("Failed to parse user data from localStorage:", err);
// //       localStorage.removeItem("user");
// //       localStorage.removeItem("token");
// //       return <Navigate to={redirectTo} />;
// //     }
// //   }

// //   const userRole = user && user.role ? user.role.toUpperCase() : null;
// //   console.log("ProtectedRoute - userRole:", userRole); // Debug log

// //   // Temporarily relax the role check to debug
// //   const isAuthenticated = token && user; // Removed userRole === "LANDLORD" for now
// //   console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Debug log

// //   return isAuthenticated ? children : <Navigate to={redirectTo} />;
// // };

// // ProtectedRoute.propTypes = {
// //   children: PropTypes.node.isRequired,
// //   redirectTo: PropTypes.string.isRequired,
// // };

// // export default ProtectedRoute;

// // src/components/ProtectedRoute.jsx

// import { Navigate } from "react-router-dom";
// import PropTypes from "prop-types";

// const ProtectedRoute = ({ children, redirectTo }) => {
//   const token = localStorage.getItem("token");
//   const userData = localStorage.getItem("user");
//   let user = null;

//   console.log("ProtectedRoute - token:", token);
//   console.log("ProtectedRoute - userData:", userData);

//   if (userData) {
//     try {
//       user = JSON.parse(userData);
//       console.log("ProtectedRoute - parsed user:", user);
//     } catch (err) {
//       console.error("Failed to parse user data from localStorage:", err);
//       localStorage.removeItem("user");
//       // Do NOT remove the token here; let the backend validate it
//     }
//   }

//   const userRole = user && user.role ? user.role.toUpperCase() : null;
//   console.log("ProtectedRoute - userRole:", userRole);

//   // Allow access if token is present; backend will validate the role
//   const isAuthenticated = !!token;
//   console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

//   return isAuthenticated ? children : <Navigate to={redirectTo} />;
// };

// ProtectedRoute.propTypes = {
//   children: PropTypes.node.isRequired,
//   redirectTo: PropTypes.string.isRequired,
// };

// export default ProtectedRoute;
// src/components/ProtectedRoute.jsx (assumed)
import PropTypes from "prop-types"; // Add PropTypes import
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Fix import to use UserContext

const ProtectedRoute = ({ children, redirectTo }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate children as a React node
  redirectTo: PropTypes.string.isRequired, // Validate redirectTo as a string
};

export default ProtectedRoute;