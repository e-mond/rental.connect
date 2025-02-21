import {
  FaHome,
  FaDollarSign,
  FaStar,
  FaBell,
  FaWrench,
  FaFileAlt,
  FaCog,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-max">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="space-y-4">
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaHome className="mr-2" /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaHome className="mr-2" /> Properties
          </a>
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaStar className="mr-2" /> Reviews
          </a>
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaWrench className="mr-2" /> Maintenance
          </a>
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaEnvelope className="mr-2" /> Messages
          </a>
          <div className="mt-8">
            <h2 className="text-gray-600 text-sm uppercase">Management</h2>
            <a
              href="#"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaDollarSign className="mr-2" /> Payments
            </a>
            <a
              href="#"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaFileAlt className="mr-2" /> Documents
            </a>
            <a
              href="#"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaCog className="mr-2" /> Settings
            </a>
          </div>
        </nav>
        <div className="mt-auto flex items-center text-gray-700">
          <FaUser className="mr-2" /> John Smith
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-4 gap-6">
          {/* Overview Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <FaHome className="text-blue-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Properties</h3>
            <p className="text-gray-500">12 Active rentals</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <FaDollarSign className="text-green-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-gray-500">$24,500 Monthly income</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <FaStar className="text-yellow-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Rating</h3>
            <p className="text-gray-500">4.8/5.0 Average rating</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <FaBell className="text-red-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">Alerts</h3>
            <p className="text-gray-500">3 Pending issues</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            <li className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <FaStar className="text-yellow-500 mr-2 inline" /> New Review
                Received
                <p className="text-gray-500">
                  Property: 123 Main St - Rating: 5.0
                </p>
              </div>
              <a href="#" className="text-blue-500">
                View
              </a>
            </li>
            <li className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <FaWrench className="text-blue-500 mr-2 inline" /> Maintenance
                Request
                <p className="text-gray-500">
                  Property: 456 Oak Ave - Priority: High
                </p>
              </div>
              <a href="#" className="text-blue-500">
                View
              </a>
            </li>
            <li className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <FaDollarSign className="text-green-500 mr-2 inline" /> Rent
                Payment Received
                <p className="text-gray-500">
                  Property: 789 Pine St - Amount: $2,000
                </p>
              </div>
              <a href="#" className="text-blue-500">
                View
              </a>
            </li>
          </ul>
        </div>

        {/* Upcoming Lease Renewals */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Upcoming Lease Renewals</h3>
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Property</th>
                <th className="text-left p-4">Tenant</th>
                <th className="text-left p-4">Days Remaining</th>
                <th className="text-left p-4">Rent</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4">123 Main St</td>
                <td className="p-4">John Doe</td>
                <td className="p-4">30 days</td>
                <td className="p-4">$2,000/mo</td>
              </tr>
              <tr className="border-t">
                <td className="p-4">456 Oak Ave</td>
                <td className="p-4">Jane Smith</td>
                <td className="p-4">45 days</td>
                <td className="p-4">$1,800/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
