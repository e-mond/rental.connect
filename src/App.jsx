import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TenantLogin from "./pages/TenantLogin";
import LandlordLogin from "./pages/LandlordLogin";
import Signup from "./pages/Signup";
import TenantAccountSuccess from "./pages/TenantAccountSuccess";
import LandlordAccountSuccess from "./pages/LandlordAccountSuccess";
import NotFound from "./pages/NotFound";

// Tenant Dashboard Components
import TenantDashboard from "./dashboards/tenantdashboard/TenantDashboard";
import TenantDashboardHome from "./dashboards/tenantdashboard/pages/DashboardHome";
import TenantSearch from "./dashboards/tenantdashboard/pages/Search";
import PropertyDetails from "./dashboards/tenantdashboard/pages/PropertyDetails";
import TenantApplications from "./dashboards/tenantdashboard/pages/Applications";
import TenantMessages from "./dashboards/tenantdashboard/pages/Messages";
import TenantPayments from "./dashboards/tenantdashboard/pages/Payments";
import Profile from "./dashboards/tenantdashboard/pages/Profile";
import TenantSettings from "./dashboards/tenantdashboard/pages/Settings";

// Landlord Dashboard Components
import LandlordDashboard from "./dashboards/landlorddashboard/LandlordDashboard";
import Properties from "./dashboards/landlorddashboard/pages/Properties";
import Tenants from "./dashboards/landlorddashboard/pages/Tenants";
import Reviews from "./dashboards/landlorddashboard/pages/Reviews";
import Maintenance from "./dashboards/landlorddashboard/pages/Maintenance";
import LandlordMessages from "./dashboards/landlorddashboard/pages/Messages";
import LandlordPayments from "./dashboards/landlorddashboard/pages/management/Payments";
import Documents from "./dashboards/landlorddashboard/pages/management/Documents";
import LandlordSettings from "./dashboards/landlorddashboard/pages/management/Settings";
import LandlordProfile from "./dashboards/landlorddashboard/pages/Profile";

import "./index.css";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Routes that should hide the footer
  const dashboardRoutes = ["/tenant-dashboard", "/dashboard"];
  const shouldHideFooter =
    dashboardRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/tenant-dashboard/") ||
    location.pathname.startsWith("/dashboard/");

  useEffect(() => {
    // Show loading when navigating
    const handleStart = () => setLoading(true);
    const handleStop = () => setTimeout(() => setLoading(false), 1000);

    handleStart();
    handleStop();

    return () => clearTimeout(handleStop);
  }, [location]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <span className="loader"></span>
        </div>
      )}

      <Navbar />

      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tenant-login" element={<TenantLogin />} />
          <Route path="/landlord-login" element={<LandlordLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/account-success/tenant"
            element={<TenantAccountSuccess />}
          />
          <Route
            path="/account-success/landlord"
            element={<LandlordAccountSuccess />}
          />

          {/* Tenant Dashboard Routes */}
          <Route path="/tenant-dashboard/*" element={<TenantDashboard />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<TenantDashboardHome />} />
            <Route path="search" element={<TenantSearch />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="applications" element={<TenantApplications />} />
            <Route path="messages" element={<TenantMessages />} />
            <Route path="payments" element={<TenantPayments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<TenantSettings />} />
          </Route>

          {/* Direct Tenant Search Route */}
          <Route path="/tenant/search" element={<TenantSearch />} />

          {/* Landlord Dashboard Routes */}
          <Route path="/dashboard/*" element={<LandlordDashboard />}>
            <Route index element={<Navigate to="properties" />} />
            <Route path="properties" element={<Properties />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="messages" element={<LandlordMessages />} />
            <Route path="payments" element={<LandlordPayments />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<LandlordSettings />} />
            <Route path="profile" element={<LandlordProfile />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!shouldHideFooter && <Footer />}

      {/* Loader Styles */}
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
        `}
      </style>
    </>
  );
}

export default App;
