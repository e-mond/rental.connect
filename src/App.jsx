import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import BackToTop from "./components/BackToTop";
import { useDarkMode } from "./hooks/useDarkMode";
import { UserInitializer } from "./components/UserInitializer";

import "./index.css";

function App() {
  const location = useLocation();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);

  const dashboardRoutes = [
    "/dashboard/tenant",
    "/dashboard/landlord",
    "/account-success/tenant",
    "/account-success/landlord",
    "/dashboard",
  ];
  const shouldHideFooter = dashboardRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setTimeout(() => setLoading(false), 1000);

    handleStart();
    handleStop();

    return () => clearTimeout(handleStop);
  }, [location]);

  return (
    <>
      <UserInitializer />
      {loading && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <span className="loader"></span>
        </div>
      )}
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"
        }`}
      >
        <Navbar />
        <ErrorBoundary customMessage="An error occurred in the main app. Please try again.">
          <main className="min-h-screen">
            <Outlet />
          </main>
          {!shouldHideFooter && <Footer />}
          <BackToTop />
        </ErrorBoundary>
      </div>
      <style>
        {`
          .loader {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: black;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .dark .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: white;
          }
        `}
      </style>
    </>
  );
}

export default App;
