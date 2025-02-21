import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardCards from "./components/DashboardCards";
import RecentActivity from "./components/RecentActivity";

const TenantDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <Header title="Welcome back, Alex" />

        {/* Dashboard Cards */}
        <DashboardCards />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
};

export default TenantDashboard;
