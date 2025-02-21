import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import Dashboard from "./pages/Dashboard";
import TenantDashboard from "./dashboards/tenatntdashboard/TenantDashboard";
import NotFound from "./pages/NotFound";
import "./index.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const hideFooterRoutes = [
    "/dashboard",
    "/account-success/landlord",
    "/account-success",
    "/tenant-dashboard",
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tenant-dashboard" element={<TenantDashboard />} />
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
