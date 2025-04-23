// import React from "react";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import App from "./App";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import TenantLogin from "./pages/auth/TenantLogin";
// import LandlordLogin from "./pages/auth/LandlordLogin";
// import Signup from "./pages/auth/Signup";
// import TenantAccountSuccess from "./pages/TenantAccountSuccess";
// import LandlordAccountSuccess from "./pages/LandlordAccountSuccess";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AuthPage from "./pages/AuthPage";
// import LandlordAuth from "./pages/LandlordAuth";

// // Tenant Dashboard Components
// import TenantDashboard from "./dashboards/tenantdashboard/TenantDashboard";
// import TenantDashboardHome from "./dashboards/tenantdashboard/pages/TenantDashboardHome";
// import TenantSearch from "./dashboards/tenantdashboard/pages/Search";
// import PropertyDetails from "./dashboards/tenantdashboard/pages/PropertyDetails";
// import TenantApplications from "./dashboards/tenantdashboard/pages/Applications";
// import TenantMessages from "./dashboards/tenantdashboard/pages/Messages";
// import TenantPayments from "./dashboards/tenantdashboard/pages/Payments";
// import Profile from "./dashboards/tenantdashboard/pages/Profile";
// import TenantSettings from "./dashboards/tenantdashboard/pages/Settings";
// import TenantMaintenance from "./dashboards/tenantdashboard/pages/Maintenance";

// // Landlord Dashboard Components
// import LandlordDashboard from "./dashboards/landlorddashboard/pages/Landlord/LandlordDashboard";
// import LandlordDashboardHome from "./dashboards/landlorddashboard/pages/Landlord/LandlordDashboardHome";
// import Revenue from "./dashboards/landlorddashboard/pages/Landlord/Revenue";
// import Properties from "./dashboards/landlorddashboard/pages/Landlord/Properties";
// import Tenants from "./dashboards/landlorddashboard/pages/Landlord/Tenants";
// import Reviews from "./dashboards/landlorddashboard/pages/Landlord/Reviews";
// import Maintenance from "./dashboards/landlorddashboard/pages/Landlord/Maintenance";
// import MaintenanceSchedule from "./dashboards/landlorddashboard/pages/Landlord/MaintenanceSchedule";
// import LandlordMessages from "./dashboards/landlorddashboard/pages/Landlord/Messages";
// import NewMessage from "./dashboards/landlorddashboard/pages/Landlord/NewMessage";
// import LandlordPayments from "./dashboards/landlorddashboard/pages/management/Payments";
// import Documents from "./dashboards/landlorddashboard/pages/management/Documents";
// import LandlordSettings from "./dashboards/landlorddashboard/pages/management/Settings";
// import LandlordProfile from "./dashboards/landlorddashboard/pages/Landlord/Profile";
// import Ratings from "./dashboards/landlorddashboard/pages/Landlord/Ratings";
// import LeaseRenewals from "./dashboards/landlorddashboard/pages/Landlord/LeaseRenewals";
// import ConnectedAccounts from "./dashboards/landlorddashboard/pages/management/subpages/ConnectedAccounts";
// import LoginActivity from "./dashboards/landlorddashboard/pages/management/subpages/LoginActivity";
// import Subscription from "./dashboards/landlorddashboard/pages/management/subpages/Subscription";
// import PaymentMethods from "./dashboards/landlorddashboard/pages/management/subpages/PaymentMethods";

// const queryClient = new QueryClient();

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <NotFound />,
//     children: [
//       { index: true, element: <Home /> },
//       { path: "about", element: <About /> },
//       { path: "contact", element: <Contact /> },
//       { path: "tenantlogin", element: <TenantLogin /> },
//       { path: "landlordlogin", element: <LandlordLogin /> },
//       { path: "signup", element: <Signup /> },
//       { path: "account-success/tenant", element: <TenantAccountSuccess /> },
//       {
//         path: "account-success/landlord",
//         element: (
//           <ProtectedRoute redirectTo="/landlordlogin">
//             <LandlordAccountSuccess />
//           </ProtectedRoute>
//         ),
//       },
//       { path: "auth/:userType", element: <AuthPage /> },
//       { path: "landlord-signup", element: <LandlordAuth isSignUp /> },
//       {
//         path: "dashboard/tenant",
//         element: (
//           <ProtectedRoute redirectTo="/tenantlogin">
//             <TenantDashboard />
//           </ProtectedRoute>
//         ),
//         children: [
//           { index: true, element: <TenantDashboardHome /> },
//           { path: "search", element: <TenantSearch /> },
//           { path: "property/:id", element: <PropertyDetails /> },
//           { path: "applications", element: <TenantApplications /> },
//           { path: "messages", element: <TenantMessages /> },
//           { path: "payments", element: <TenantPayments /> },
//           { path: "profile", element: <Profile /> },
//           { path: "settings", element: <TenantSettings /> },
//           { path: "maintenance", element: <TenantMaintenance /> },
//         ],
//       },
//       {
//         path: "dashboard/landlord",
//         element: (
//           <ProtectedRoute redirectTo="/landlordlogin">
//             <LandlordDashboard />
//           </ProtectedRoute>
//         ),
//         children: [
//           { index: true, element: <LandlordDashboardHome /> },
//           { path: "properties", element: <Properties /> },
//           { path: "tenants", element: <Tenants /> },
//           { path: "reviews", element: <Reviews /> },
//           { path: "maintenance", element: <Maintenance /> },
//           { path: "maintenance/new", element: <MaintenanceSchedule /> },
//           { path: "messages", element: <LandlordMessages /> },
//           { path: "new-message", element: <NewMessage /> },
//           { path: "payments", element: <LandlordPayments /> },
//           { path: "documents", element: <Documents /> },
//           { path: "settings", element: <LandlordSettings /> },
//           {
//             path: "settings/account/connected-accounts",
//             element: <ConnectedAccounts />,
//           },
//           {
//             path: "settings/security/login-activity",
//             element: <LoginActivity />,
//           },
//           { path: "settings/billing/subscription", element: <Subscription /> },
//           {
//             path: "settings/billing/payment-methods",
//             element: <PaymentMethods />,
//           },
//           { path: "profile", element: <LandlordProfile /> },
//           { path: "ratings", element: <Ratings /> },
//           { path: "lease-renewals", element: <LeaseRenewals /> },
//           { path: "revenue", element: <Revenue /> },
//         ],
//       },
//       { path: "*", element: <NotFound /> },
//     ],
//   },
// ]);

// document.addEventListener("DOMContentLoaded", () => {
//   const rootElement = document.getElementById("root");
//   if (rootElement) {
//     ReactDOM.createRoot(rootElement).render(
//       <React.StrictMode>
//         <QueryClientProvider client={queryClient}>
//           <RouterProvider router={router} />
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             closeOnClick
//             pauseOnHover
//             draggable
//           />
//         </QueryClientProvider>
//       </React.StrictMode>
//     );
//   } else {
//     console.error(
//       "Root element not found. Ensure there is a <div id='root'> in your index.html."
//     );
//   }
// });
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserProvider";
import { DarkModeProvider } from "./context/DarkModeContext";
import App from "./App";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TenantLogin from "./pages/auth/TenantLogin";
import LandlordLogin from "./pages/auth/LandlordLogin";
import Signup from "./pages/auth/Signup";
import TenantAccountSuccess from "./pages/TenantAccountSuccess";
import LandlordAccountSuccess from "./pages/LandlordAccountSuccess";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import LandlordAuth from "./pages/LandlordAuth";

// Tenant Dashboard Components
import TenantDashboard from "./dashboards/tenantdashboard/TenantDashboard";
import TenantDashboardHome from "./dashboards/tenantdashboard/pages/TenantDashboardHome";
import TenantSearch from "./dashboards/tenantdashboard/pages/Search";
import PropertyDetails from "./dashboards/tenantdashboard/pages/PropertyDetails";
import TenantApplications from "./dashboards/tenantdashboard/pages/Applications";
import TenantMessages from "./dashboards/tenantdashboard/pages/Messages";
import TenantPayments from "./dashboards/tenantdashboard/pages/Payments";
import Profile from "./dashboards/tenantdashboard/pages/Profile";
import TenantSettings from "./dashboards/tenantdashboard/pages/Settings";
import TenantMaintenance from "./dashboards/tenantdashboard/pages/Maintenance";

// Landlord Dashboard Components
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
import Subscription from "./dashboards/landlorddashboard/pages/management/subpages/Subscription";
import PaymentMethods from "./dashboards/landlorddashboard/pages/management/subpages/PaymentMethods";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "tenantlogin", element: <TenantLogin /> },
      { path: "landlordlogin", element: <LandlordLogin /> },
      { path: "signup", element: <Signup /> },
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
          { path: "payments", element: <TenantPayments /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <TenantSettings /> },
          { path: "maintenance", element: <TenantMaintenance /> },
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
          { path: "settings/billing/subscription", element: <Subscription /> },
          {
            path: "settings/billing/payment-methods",
            element: <PaymentMethods />,
          },
          { path: "profile", element: <LandlordProfile /> },
          { path: "ratings", element: <Ratings /> },
          { path: "lease-renewals", element: <LeaseRenewals /> },
          { path: "revenue", element: <Revenue /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <DarkModeProvider>
              <RouterProvider router={router} />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
              />
            </DarkModeProvider>
          </UserProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  } else {
    console.error(
      "Root element not found. Ensure there is a <div id='root'> in your index.html."
    );
  }
});