import { FaChartPie, FaUserCheck, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

const TenantAnalysis = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          RentConnect
        </h1>
      </header>

      {/* Tenant Analysis Section */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
            📊
          </span>
          Tenant Analysis
        </h2>
        <p className="text-gray-600 mt-2">
          Here’s an overview of your tenants' performance and insights into
          their rental activity.
        </p>
      </div>

      {/* Analysis Details Section */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Key Insights
        </h3>
        <div className="flex flex-col gap-6">
          {/* Insight 1 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaChartPie size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Rental Payments
              </h4>
              <p className="text-gray-600 text-sm">
                95% of tenants have made timely payments this month. Monitor
                their performance to ensure compliance.
              </p>
            </div>
          </div>
          {/* Insight 2 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaUserCheck size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Profile Completion
              </h4>
              <p className="text-gray-600 text-sm">
                80% of tenant profiles are complete. Encourage tenants to update
                their preferences for better matching.
              </p>
            </div>
          </div>
          {/* Insight 3 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Lease Agreements
              </h4>
              <p className="text-gray-600 text-sm">
                70% of leases are updated. Review pending agreements to ensure
                all documents are in place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-4xl mt-10 text-center">
        <Link
          to="/analytics"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
        >
          View Full Analytics
        </Link>
      </div>
    </div>
  );
};

export default TenantAnalysis;
