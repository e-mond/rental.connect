import { Outlet } from "react-router-dom";

const DashboardLayout = ({ SidebarComponent, user, isLoading }) => (
  <div className="flex h-screen bg-gray-100">
    <SidebarComponent user={user} isLoading={isLoading} />
    <main className="flex-1 p-6 overflow-auto">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;