import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./pages/DashboardHome";
import Search from "./pages/Search";
import Applications from "./pages/Applications";
import Messages from "./pages/Messages";
import Payments from "./pages/Payments";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const TenantDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="search" element={<Search />} />
          <Route path="applications" element={<Applications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default TenantDashboard;
