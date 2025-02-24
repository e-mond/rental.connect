import { Link } from "react-router-dom";

// Mock user data (Replace with real user data when integrating backend)
const mockUser = {
  name: "Alex Johnson", // This should come from the logged-in user data
};

const TenantDashboardHome = () => {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold">Welcome back, {mockUser.name}</h2>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Find Your Home</h3>
          <p className="text-gray-500">
            Browse available properties matching your criteria.
          </p>
          <Link
            to="/tenant-dashboard/search"
            className="mt-2 block bg-blue-600 text-white px-4 py-2 rounded-md text-center w-full"
          >
            Start Search
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Active Applications</h3>
          <p className="text-gray-500">
            You have no active rental applications.
          </p>
          <Link
            to="/tenant-dashboard/applications"
            className="mt-2 block bg-blue-600 text-white px-4 py-2 rounded-md text-center w-full"
          >
            View All
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium">Payment Setup</h3>
          <p className="text-gray-500">Complete your payment information.</p>
          <Link
            to="/tenant-dashboard/payments"
            className="mt-2 block bg-blue-600 text-white px-4 py-2 rounded-md text-center w-full"
          >
            Setup Now
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <ul className="bg-white mt-4 p-4 rounded-lg shadow-md">
          <li className="flex justify-between py-2 border-b">
            <span>📌 Account created</span>
            <span className="text-gray-500">Just now</span>
          </li>
          <li className="flex justify-between py-2">
            <span>👤 Profile completion pending</span>
            <span className="text-gray-500">2 min ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TenantDashboardHome;
