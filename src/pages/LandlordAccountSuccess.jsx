// import { FaHome, FaCreditCard, FaUsers } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const LandlordSuccess = () => {
//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <header className="w-full max-w-6xl flex justify-between items-center py-4">
//         <h1 className="text-2xl font-bold">RentConnect</h1>
//       </header>

//       {/* Success Message Section */}
//       <div className="w-full max-w-3xl bg-blue-50 p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//           <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full">
//             ✓
//           </span>
//           Account Created Successfully!
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Your landlord account has been set up and is ready to use.
//         </p>
//         <div className="mt-4 flex gap-4">
//           <Link
//             to="/dashboard"
//             className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
//           >
//             Go to Dashboard
//           </Link>
//           <Link
//             to="/add-properties"
//             className="bg-gray-100 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
//           >
//             Add More Properties
//           </Link>
//         </div>
//       </div>

//       {/* Next Steps Section */}
//       <div className="w-full max-w-3xl">
//         <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
//         <div className="flex flex-col gap-4">
//           {/* Step 1 */}
//           <div className="flex items-start gap-4">
//             <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
//               <FaHome size={20} />
//             </div>
//             <div>
//               <h4 className="text-md font-medium">Add Property Details</h4>
//               <p className="text-gray-600 text-sm">
//                 Upload photos and set rental terms.
//               </p>
//             </div>
//           </div>
//           {/* Step 2 */}
//           <div className="flex items-start gap-4">
//             <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
//               <FaCreditCard size={20} />
//             </div>
//             <div>
//               <h4 className="text-md font-medium">Set Up Payment Methods</h4>
//               <p className="text-gray-600 text-sm">
//                 Configure how you'll receive rent payments.
//               </p>
//             </div>
//           </div>
//           {/* Step 3 */}
//           <div className="flex items-start gap-4">
//             <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
//               <FaUsers size={20} />
//             </div>
//             <div>
//               <h4 className="text-md font-medium">Invite Tenants</h4>
//               <p className="text-gray-600 text-sm">
//                 Connect with your current tenants.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandlordSuccess;


import { FaHome, FaCreditCard, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const LandlordSuccess = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
     

      {/* Success Message Section */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-xl mb-10 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow-md">
            ✓
          </span>
          Account Created Successfully!
        </h2>
        <p className="text-gray-600 mt-2">
          Congratulations! Your landlord account is now active and ready to use.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/add-properties"
            className="px-6 py-3 rounded-lg bg-gray-100 text-blue-600 font-medium shadow hover:bg-gray-200 transform hover:scale-105 transition-all duration-300"
          >
            Add More Properties
          </Link>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Next Steps</h3>
        <div className="flex flex-col gap-6">
          {/* Step 1 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaHome size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Add Property Details
              </h4>
              <p className="text-gray-600 text-sm">
                Upload photos and set rental terms to attract tenants.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaCreditCard size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Set Up Payment Methods
              </h4>
              <p className="text-gray-600 text-sm">
                Configure secure payment options to receive rent directly.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex items-start gap-6 bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
              <FaUsers size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800">
                Invite Tenants
              </h4>
              <p className="text-gray-600 text-sm">
                Easily connect and manage your existing or new tenants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordSuccess;
