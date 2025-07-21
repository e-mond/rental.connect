import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Import core app component and pages
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
// Import authentication pages
import TenantLogin from "./pages/auth/TenantLogin";
import LandlordLogin from "./pages/auth/LandlordLogin";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
// Import account success pages
import TenantAccountSuccess from "./pages/TenantAccountSuccess";
import LandlordAccountSuccess from "./pages/LandlordAccountSuccess";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
// Import auth-related pages
import AuthPage from "./pages/AuthPage";
import LandlordAuth from "./pages/LandlordAuth";
// Import tenant dashboard components
import TenantDashboard from "./dashboards/tenantdashboard/TenantDashboard";
import TenantDashboardHome from "./dashboards/tenantdashboard/pages/TenantDashboardHome";
import TenantSearch from "./dashboards/tenantdashboard/pages/Search";
import PropertyDetails from "./dashboards/tenantdashboard/pages/PropertyDetails";
import TenantApplications from "./dashboards/tenantdashboard/pages/Applications";
import TenantMessages from "./dashboards/tenantdashboard/pages/Messages";
import TenantMessageDetail from "./dashboards/tenantdashboard/pages/MessageDetail";
import ComposeMessage from "./dashboards/tenantdashboard/pages/ComposeMessage";
import TenantPayments from "./dashboards/tenantdashboard/pages/Payments";
import Profile from "./dashboards/tenantdashboard/pages/Profile";
import TenantSettings from "./dashboards/tenantdashboard/pages/Settings";
import TenantMaintenance from "./dashboards/tenantdashboard/pages/Maintenance";
import SubmitMaintenanceRequest from "./dashboards/tenantdashboard/pages/SubmitMaintenanceRequest";
import TenantNotifications from "./dashboards/tenantdashboard/pages/TenantNotifications";
// Import new tenant action pages
import ScheduleViewing from "./dashboards/tenantdashboard/pages/ScheduleViewing";
import ApplyNow from "./dashboards/tenantdashboard/pages/ApplyNow";
// import MaintenanceRequest from "./dashboards/tenantdashboard/pages/MaintenanceRequest";
// Import landlord dashboard components
import LandlordDashboard from "./dashboards/landlorddashboard/pages/Landlord/LandlordDashboard";
import LandlordDashboardHome from "./dashboards/landlorddashboard/pages/Landlord/LandlordDashboardHome";
import Revenue from "./dashboards/landlorddashboard/pages/Landlord/Revenue";
import Properties from "./dashboards/landlorddashboard/pages/Landlord/Properties";
import Tenants from "./dashboards/landlorddashboard/pages/Landlord/Tenants";
import Reviews from "./dashboards/landlorddashboard/pages/Landlord/Reviews";
import Maintenance from "./dashboards/landlorddashboard/pages/Landlord/Maintenance";
import MaintenanceSchedule from "./dashboards/landlorddashboard/pages/Landlord/MaintenanceSchedule";
import LandlordMessages from "./dashboards/landlorddashboard/pages/Landlord/Messages";
import NewMessage from "./dashboards/landlorddashboard/pages/Landlord/NewMessage";
import LandlordPayments from "./dashboards/landlorddashboard/pages/management/Payments";
import Documents from "./dashboards/landlorddashboard/pages/management/Documents";
import LandlordSettings from "./dashboards/landlorddashboard/pages/management/Settings";
import LandlordProfile from "./dashboards/landlorddashboard/pages/Landlord/Profile";
import Ratings from "./dashboards/landlorddashboard/pages/Landlord/Ratings";
import LeaseRenewals from "./dashboards/landlorddashboard/pages/Landlord/LeaseRenewals";
import ConnectedAccounts from "./dashboards/landlorddashboard/pages/management/subpages/ConnectedAccounts";
import LoginActivity from "./dashboards/landlorddashboard/pages/management/subpages/LoginActivity";
import LandlordNotifications from "./dashboards/landlorddashboard/pages/Landlord/LandlordNotifications";

// Define the app's routing configuration using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Root component that renders the app layout and child routes
    errorElement: <NotFound />, // Fallback for undefined routes
    children: [
      { index: true, element: <Home /> }, // Default route (homepage)
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "tenantlogin", element: <TenantLogin /> },
      { path: "landlordlogin", element: <LandlordLogin /> },
      { path: "signup", element: <Signup /> },
      { path: "forgotpassword", element: <ForgotPassword /> },
      { path: "not-found", element: <NotFound /> }, // Added explicit route for NotFound
      { path: "account-success/tenant", element: <TenantAccountSuccess /> },
      {
        path: "account-success/landlord",
        element: (
          <ProtectedRoute redirectTo="/landlordlogin">
            <LandlordAccountSuccess />
          </ProtectedRoute>
        ),
      },
      { path: "auth/:userType", element: <AuthPage /> },
      { path: "landlord-signup", element: <LandlordAuth isSignUp /> },
      {
        path: "dashboard/tenant",
        element: (
          <ProtectedRoute redirectTo="/tenantlogin">
            <TenantDashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <TenantDashboardHome /> },
          { path: "search", element: <TenantSearch /> },
          { path: "property/:id", element: <PropertyDetails /> },
          { path: "applications", element: <TenantApplications /> },
          { path: "messages", element: <TenantMessages /> },
          { path: "messages/:messageId", element: <TenantMessageDetail /> },
          { path: "compose", element: <ComposeMessage /> },
          { path: "payments", element: <TenantPayments /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <TenantSettings /> },
          { path: "maintenance", element: <TenantMaintenance /> },
          { path: "maintenance/submit", element: <SubmitMaintenanceRequest /> },
          { path: "notifications", element: <TenantNotifications /> },
          { path: "scheduleviewing", element: <ScheduleViewing /> },
          { path: "applynow", element: <ApplyNow /> },
          // { path: "maintenance-request", element: <MaintenanceRequest /> },
        ],
      },
      {
        path: "dashboard/landlord",
        element: (
          <ProtectedRoute redirectTo="/landlordlogin">
            <LandlordDashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <LandlordDashboardHome /> },
          { path: "properties", element: <Properties /> },
          { path: "tenants", element: <Tenants /> },
          { path: "reviews", element: <Reviews /> },
          { path: "maintenance", element: <Maintenance /> },
          { path: "maintenance/new", element: <MaintenanceSchedule /> },
          { path: "messages", element: <LandlordMessages /> },
          { path: "new-message", element: <NewMessage /> },
          { path: "payments", element: <LandlordPayments /> },
          { path: "documents", element: <Documents /> },
          { path: "settings", element: <LandlordSettings /> },
          {
            path: "settings/account/connected-accounts",
            element: <ConnectedAccounts />,
          },
          {
            path: "settings/security/login-activity",
            element: <LoginActivity />,
          },
          // { path: "settings/billing/subscription", element: <Subscription /> },
          // {
          //   path: "settings/billing/payment-methods",
          //   element: <PaymentMethods />,
          // },
          { path: "profile", element: <LandlordProfile /> },
          { path: "ratings", element: <Ratings /> },
          { path: "lease-renewals", element: <LeaseRenewals /> },
          { path: "revenue", element: <Revenue /> },
          { path: "notifications", element: <LandlordNotifications /> },
        ],
      },
      { path: "*", element: <NotFound /> }, // Catch-all route for 404
    ],
  },
]);

// Render the app when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        {/* Provide routing context to the app */}
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </React.StrictMode>
    );
  } else {
    console.error(
      "Root element not found. Ensure there is a <div id='root'> in your index.html."
    );
  }
});
