import { useState } from "react";
import { Calendar, CreditCard, User, Home, Star } from "lucide-react";
import Sidebar from "../components/Sidebar";

const tenantData = {
  name: "Sarah Johnson",
  status: "Active Tenant since Jan 2024",
  email: "sarah.j@email.com",
  phone: "(555) 123-4567",
  emergencyContact: {
    name: "Mark Johnson",
    phone: "(555) 987-6543",
  },
  lease: {
    term: "12 months (Jan 2024 - Dec 2024)",
    lastPayment: "Jan 1, 2024",
  },
  property: {
    name: "Sunset Apartments 4B",
    details: "2 Bed, 2 Bath • $1,200/mo",
  },
};

const Tenants = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="p-6 bg-gray-50 flex-1">
        <h2 className="text-2xl font-bold mb-4">Tenants</h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col items-start">
            <User className="h-10 w-10 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">{tenantData.name}</h3>
            <p className="text-gray-500">{tenantData.status}</p>
            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Edit Profile
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded">Message</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex flex-col items-start">
            <Home className="h-10 w-10 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">
              {tenantData.property.name}
            </h3>
            <p className="text-gray-500">{tenantData.property.details}</p>
            <div className="mt-4 flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                View Property
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded">
                Lease Details
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-6 border-b pb-2 mb-4 text-sm font-medium">
          {["Overview", "Payments", "Documents", "History"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-4 mb-4">
              <Calendar className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Lease Term</h4>
                <p className="text-gray-500 text-sm">{tenantData.lease.term}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <CreditCard className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Payment Status</h4>
                <p className="text-gray-500 text-sm">
                  Last payment received on {tenantData.lease.lastPayment}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <User className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Contact Information</h4>
                <p className="text-gray-500 text-sm">
                  {tenantData.email} • {tenantData.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Star className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Emergency Contact</h4>
                <p className="text-gray-500 text-sm">
                  {tenantData.emergencyContact.name} •{" "}
                  {tenantData.emergencyContact.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;
