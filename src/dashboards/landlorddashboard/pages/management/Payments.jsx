import { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaEllipsisV } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    name: "Sarah Johnson",
    apt: "Apt 4B",
    amount: 1200,
    date: "Jan 2024",
    status: "Completed",
  },
  {
    id: 2,
    name: "Mike Thompson",
    apt: "Apt 2A",
    amount: 1500,
    date: "Jan 2024",
    status: "Pending",
  },
  {
    id: 3,
    name: "Emma Davis",
    apt: "Apt 1C",
    amount: 1800,
    date: "Dec 2023",
    status: "Overdue",
  },
  {
    id: 4,
    name: "David Wilson",
    apt: "Apt 3D",
    amount: 1400,
    date: "Jan 2024",
    status: "Completed",
  },
];

const Payments = () => {
  const [filter, setFilter] = useState("All");

  // Filter payments based on the selected tab
  const filteredPayments =
    filter === "All"
      ? mockPayments
      : mockPayments.filter((payment) => payment.status === filter);

  // Calculate totals for the cards
  const totalCollected = mockPayments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalPending = mockPayments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalOverdue = mockPayments
    .filter((payment) => payment.status === "Overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Payments</h2>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            <FaPlus className="mr-2" /> Record Payment
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaSearch className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Collected</p>
              <p className="text-2xl font-semibold">GH₵{totalCollected}</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaSearch className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-semibold">GH₵{totalPending}</p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaSearch className="text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Overdue</p>
              <p className="text-2xl font-semibold">GH₵{totalOverdue}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border p-2 rounded-lg bg-white shadow-sm mb-4">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search payments..."
            className="ml-2 w-full outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 text-sm border-b pb-2 mb-4">
          {["All", "Pending", "Completed", "Overdue"].map((status) => (
            <span
              key={status}
              onClick={() => setFilter(status)}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                filter === status
                  ? "font-semibold bg-blue-600 text-white"
                  : "hover:text-gray-800"
              }`}
            >
              {status}
            </span>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow p-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className={`flex justify-between items-center p-3 border-b ${
                payment.status === "Completed"
                  ? "bg-green-50"
                  : payment.status === "Pending"
                  ? "bg-yellow-50"
                  : payment.status === "Overdue"
                  ? "bg-red-50"
                  : ""
              }`}
            >
              <div>
                <p className="font-semibold">{payment.name}</p>
                <p className="text-gray-500 text-sm">
                  {payment.apt} • GH₵{payment.amount} • {payment.date}
                </p>
              </div>
              <div className="flex space-x-4">
                <FaEdit className="text-gray-500 cursor-pointer hover:text-gray-700" />
                <FaEllipsisV className="text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
            </div>
          ))}
          {filteredPayments.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No payments found for &quot;{filter}&quot; status.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
