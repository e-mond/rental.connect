import { Routes, Route, useLocation } from "react-router-dom";
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
import LandlordDashboard from "./dashboards/landlorddashboard/LandlordDashboard";
import TenantDashboard from "./dashboards/tenantdashboard/TenantDashboard";
import NotFound from "./pages/NotFound";
import "./index.css";
import Properties from "../src/dashboards/landlorddashboard/pages/Properties";
import Tenant from "../src/dashboards/landlorddashboard/pages//Tenants";
import Reviews from "./dashboards/landlorddashboard/pages/Reviews";
import Maintenance from "../src/dashboards/landlorddashboard/pages/Maintenance";
import Messages from "../src/dashboards/landlorddashboard/pages/Messages";
import Payments from "../src/dashboards/landlorddashboard/pages/management/Payments";
import Documents from "../src/dashboards/landlorddashboard/pages/management/Documents";
import Settings from "../src/dashboards/landlorddashboard/pages/management/Settings";
import Profile from "../src/dashboards/landlorddashboard/pages/Profile";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Hide footer on certain routes
  const hideFooterRoutes = [
    "/dashboard",
    "/account-success/landlord",
    "/account-success",
    "/tenant-dashboard",
    "/properties",
    "/tenants",
    "/properties",
    "/reviews",
    "/maintenance",
    "/messages",
    "/payments",
    "/documents",
    "/settings",
  ];
  const shouldHideFooter =
    hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/dashboard/") ||
    location.pathname.startsWith("/tenant-dashboard/");

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

          {/* Dashboard Routes */}
          <Route path="/dashboard/*" element={<LandlordDashboard />} />
          <Route path="/tenant-dashboard/*" element={<TenantDashboard />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />

          {/* LandLord Dashboard */}
          <Route path="properties" element={<Properties />} />
          <Route path="tenants" element={<Tenant />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
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
