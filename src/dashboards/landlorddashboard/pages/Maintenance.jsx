import { useState } from "react";
import {
  Search,
  PlusCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";


const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Requests");

  const maintenanceRequests = [
    {
      id: 1,
      type: "Plumbing Issue",
      address: "123 Main Street",
      details: "Leaking pipe in bathroom",
      status: "Urgent",
      icon: "🚰",
    },
    {
      id: 2,
      type: "HVAC Maintenance",
      address: "456 Oak Avenue",
      details: "Regular maintenance check required",
      status: "In Progress",
      icon: "❄️",
    },
    {
      id: 3,
      type: "Electrical",
      address: "789 Pine Road",
      details: "Power outlet not working in kitchen",
      status: "Open",
      icon: "⚡",
    },
    {
      id: 4,
      type: "Lock Replacement",
      address: "321 Elm Street",
      details: "Front door lock needs replacement",
      status: "Open",
      icon: "🔒",
    },
  ];

  const filteredRequests = maintenanceRequests.filter((request) => {
    const matchesSearch =
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "All Requests" ||
      (filterStatus === "Open" && request.status === "Open") ||
      (filterStatus === "In Progress" && request.status === "In Progress") ||
      (filterStatus === "Completed" && request.status === "Completed");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col lg:flex-row">
    
      <div className="p-6 bg-white rounded-lg shadow-md flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Maintenance Requests</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" /> New Request
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 border-b pb-2 mb-4 text-gray-600 overflow-auto">
          {["All Requests", "Open", "In Progress", "Completed"].map(
            (status) => (
              <span
                key={status}
                className={`cursor-pointer font-medium px-2 py-1 rounded ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </span>
            )
          )}
        </div>

        {/* Maintenance Requests */}
        <ul>
          {filteredRequests.map((request) => (
            <li
              key={request.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="text-2xl">{request.icon}</span>
                <div>
                  <h3 className="font-medium">
                    {request.type} - {request.address}
                  </h3>
                  <p className="text-sm text-gray-500">{request.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                {request.status === "Urgent" && (
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                )}
                {request.status === "In Progress" && (
                  <Clock className="text-yellow-500 w-5 h-5" />
                )}
                {request.status === "Open" && (
                  <CheckCircle className="text-blue-500 w-5 h-5" />
                )}
                <button className="text-gray-500">Select ▼</button>
              </div>
            </li>
          ))}
          {filteredRequests.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No requests found for the selected criteria.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Maintenance;
