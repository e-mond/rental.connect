import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserProvider";
import { useDarkMode, DarkModeProvider } from "./context/DarkModeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import BackToTop from "./components/BackToTop";
import "./index.css";

// Initialize QueryClient for managing data fetching with React Query
const queryClient = new QueryClient();

/**
 * App Component
 *
 * The root component of the application, responsible for setting up global providers,
 * handling route transitions, and rendering the main layout (navbar, main content, footer).
 * Manages a loading spinner during route changes, applies dark mode theming, and provides
 * toast notifications, error boundaries, and a back-to-top button for enhanced user experience.
 *
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  // Access the current route location using React Router
  const location = useLocation();
  // Access dark mode state from DarkModeContext
  const { darkMode } = useDarkMode();
  // State to control the loading spinner during route transitions
  const [loading, setLoading] = useState(false);

  // List of routes where both navbar and footer should be hidden
  const hideNavAndFooterRoutes = ["/forgotpassword", "/not-found"];

  // List of routes where only the footer should be hidden (e.g., dashboard pages)
  const hideFooterRoutes = [
    "/dashboard/tenant",
    "/dashboard/landlord",
    "/account-success/tenant",
    "/account-success/landlord",
    "/dashboard",
  ];

  // Check if navbar and footer should be hidden (e.g., NotFound, ForgotPassword)
  const shouldHideNavAndFooter =
    hideNavAndFooterRoutes.includes(location.pathname) ||
    location.pathname === "*"; // Handle 404 routes

  // Check if only the footer should be hidden (e.g., dashboard routes)
  const shouldHideFooter =
    shouldHideNavAndFooter ||
    hideFooterRoutes.some((route) => location.pathname.startsWith(route));

  // Handle route transitions by showing a loading spinner for 2 seconds
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setTimeout(() => setLoading(false), 2000);

    handleStart();
    handleStop();

    // Cleanup timeout on unmount or route change
    return () => clearTimeout(handleStop);
  }, [location]);

  // Debug: Log darkMode state to ensure it's applied correctly
  useEffect(() => {
    console.log("App - Dark Mode State:", darkMode);
  }, [darkMode]);

  return (
    // Provide React Query client for data fetching
    <QueryClientProvider client={queryClient}>
      {/* Provide user authentication context */}
      <UserProvider>
        {/* Provide dark mode context */}
        <DarkModeProvider>
          <div>
            {/* Show loading spinner during route transitions */}
            {loading && (
              <div
                className={`fixed inset-0 flex items-center justify-center z-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 loader-container`}
              >
                <span className="loader" aria-label="Loading"></span>
              </div>
            )}
            {/* Main app container with dynamic dark/light mode styling */}
            <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
              {/* Conditionally render the navigation bar */}
              {!shouldHideNavAndFooter && <Navbar />}
              {/* Wrap main content in an error boundary to catch runtime errors */}
              <ErrorBoundary customMessage="An error occurred in the main app. Please try again.">
                <main className="min-h-screen">
                  {/* Render child routes defined in the router */}
                  <Outlet />
                </main>
                {/* Conditionally render the footer */}
                {!shouldHideFooter && <Footer />}
                {/* Render back-to-top button for scrolling convenience */}
                <BackToTop />
              </ErrorBoundary>
            </div>
            {/* Configure toast notifications for user feedback */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
            />
            {/* Inline styles for the loading spinner */}
            <style>
              {`
                .loader {
                  border: 4px solid rgba(0, 0, 0, 0.1); /* Light mode: semi-transparent gray background */
                  border-left-color: black; /* Light mode: black spinner for visibility */
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                /* Dark mode: adjust loader for better visibility */
                .dark .loader {
                  border: 4px solid rgba(0, 0, 0, 0.3); /* Dark mode: darker, more opaque background */
                  border-left-color: white; /* Dark mode: white spinner for contrast */
                }
                /* Enforce background colors to prevent overrides */
                .loader-container {
                  background-color: #ffffff; /* Light mode: white */
                }
                .dark .loader-container {
                  background-color: #1F2937; /* Dark mode: gray-900 */
                }
              `}
            </style>
          </div>
        </DarkModeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
