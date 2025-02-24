import { useState } from "react";
import {
  Calendar,
  CreditCard,
  User,
  Star,
  MessageSquare,
  Eye,
  FileText,
} from "lucide-react";


const tenantsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    status: "Active Tenant since Jan 2024",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    emergencyContact: {
      name: "Mark Johnson",
      phone: "(555) 987-6543",
    },
    lease: {
      term: "12 months (Jan 2025 - Dec 2025)",
      lastPayment: "Jan 1, 2025",
      amountPaid: "₵1,200",
    },
    property: {
      name: "Sunset Apartments 4B",
      details: "2 Bed, 2 Bath • $1,200/mo",
    },
  },
  {
    id: 2,
    name: "James Smith",
    status: "Active Tenant since Mar 2023",
    email: "james.s@email.com",
    phone: "(555) 678-9012",
    emergencyContact: {
      name: "Linda Smith",
      phone: "(555) 543-2109",
    },
    lease: {
      term: "24 months (Mar 2023 - Mar 2025)",
      lastPayment: "Feb 1, 2024",
      amountPaid: "₵1,500",
    },
    property: {
      name: "Greenwood Residences 2A",
      details: "3 Bed, 2 Bath • $1,500/mo",
    },
  },
];

const Tenants = () => {
  const [search, setSearch] = useState("");
  const [activeTenant, setActiveTenant] = useState(tenantsData[0]);
  const [activeTab, setActiveTab] = useState("Overview");

  const filteredTenants = tenantsData.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
    
      <div className="p-6 bg-gray-50 flex-1">
        <h2 className="text-2xl font-bold mb-4">Tenants</h2>
        <input
          type="text"
          placeholder="Search Tenant..."
          className="border px-4 py-2 rounded w-full mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-6 mb-6">
          {filteredTenants.map((tenant) => (
            <div
              key={tenant.id}
              className={`bg-white p-6 rounded-lg shadow flex flex-col items-start cursor-pointer ${
                activeTenant.id === tenant.id ? "border-2 border-blue-600" : ""
              }`}
              onClick={() => setActiveTenant(tenant)}
            >
              <User className="h-10 w-10 text-blue-600 mb-2" />
              <h3 className="font-semibold text-lg">{tenant.name}</h3>
              <p className="text-gray-500">{tenant.status}</p>
            </div>
          ))}
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
                <p className="text-gray-500 text-sm">
                  {activeTenant.lease.term}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <CreditCard className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Payment Status</h4>
                <p className="text-gray-500 text-sm">
                  Last payment of {activeTenant.lease.amountPaid} received on{" "}
                  {activeTenant.lease.lastPayment}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <User className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Contact Information</h4>
                <p className="text-gray-500 text-sm">
                  {activeTenant.email} • {activeTenant.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <Star className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-semibold">Emergency Contact</h4>
                <p className="text-gray-500 text-sm">
                  {activeTenant.emergencyContact.name} •{" "}
                  {activeTenant.emergencyContact.phone}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
               onClick={() => alert("Rate Tenant feature coming soon!")}>
                <Star className="h-5 w-5 mr-2" /> Rate Tenant
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
               onClick={() => alert("Messaging feature coming soon!")}>
                <MessageSquare className="h-5 w-5 mr-2" /> Send Message
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded flex items-center"
                 onClick={() => alert("View Property feature coming soon!")}>
                <Eye className="h-5 w-5 mr-2" /> View Property
              </button>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center"
               onClick={() => alert("Lease Details feature coming soon!")}>
                <FileText className="h-5 w-5 mr-2" /> Lease Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenants;



