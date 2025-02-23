import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardCards from "./components/DashboardCards";
import RecentActivity from "./components/RecentActivity";
import LeaseRenewals from "./components/LeaseRenewals";
import Properties from "./pages/Properties";
import Reviews from "./pages/Reviews";
import Maintenance from "./pages/Maintenance";
import Messages from "./pages/Messages";
import Payments from "./pages/management/Payments";
import Documents from "./pages/management/Documents";
import Settings from "./pages/management/Settings";
import Profile from "./pages/Profile";

const LandlordDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2 className="text-2xl font-bold mb-6">Overview</h2>
                <DashboardCards />
                <RecentActivity />
                <LeaseRenewals />
              </>
            }
          />
          <Route path="properties" element={<Properties />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default LandlordDashboard;
