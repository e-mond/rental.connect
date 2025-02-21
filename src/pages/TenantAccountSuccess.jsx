import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const TenantAccountSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      

      {/* Success Message */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md text-center">
        <div className="flex justify-center items-center mb-4">
          <FaCheckCircle className="text-green-500" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account Created Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Your tenant account has been created. You can now access all features
          of RentConnect.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/tenant-dashboard"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/profile-setup"
            className="px-6 py-3 rounded-lg border border-blue-500 text-blue-500 font-medium shadow-md hover:bg-blue-50 transition-all"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="w-full max-w-4xl mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          What's next?
        </h3>
        <div className="flex flex-col gap-6">
          {/* Task 1 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Complete your profile
              </h4>
              <p className="text-gray-600 text-sm">
                Add your preferences and requirements for better property
                suggestions.
              </p>
            </div>
          </div>
          {/* Task 2 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Browse properties
              </h4>
              <p className="text-gray-600 text-sm">
                Explore and find your perfect rental property.
              </p>
            </div>
          </div>
          {/* Task 3 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaCheckCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Set up payments
              </h4>
              <p className="text-gray-600 text-sm">
                Add your payment information to streamline transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAccountSuccess;
