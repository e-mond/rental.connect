import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [payments] = useState([
    {
      id: 1,
      name: "Jan Rent",
      date: "Due Jan 1",
      amount: "GH₵1,500",
      status: "Pending",
    },
    {
      id: 2,
      name: "Dec Rent",
      date: "Dec 1",
      amount: "GH₵1,500",
      status: "Paid",
    },
    {
      id: 3,
      name: "Security Deposit",
      date: "Nov 15",
      amount: "GH₵2,000",
      status: "Paid",
    },
  ]);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    if (activeFilter === "upcoming") return payment.status === "Pending";
    if (activeFilter === "past-due") return payment.status !== "Pending";
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100 p-4 md:p-6">
      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Payments</h1>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mt-4 text-gray-600 overflow-x-auto">
          {[
            { key: "all", label: "All Transactions" },
            { key: "upcoming", label: "Upcoming Due" },
            { key: "past-due", label: "Past Due" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`py-2 px-4 ${
                activeFilter === key
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-3 border-b last:border-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">💰</span>
                  <div>
                    <h3 className="font-semibold">{payment.name}</h3>
                    <p className="text-sm text-gray-500">{payment.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{payment.amount}</span>
                  <span
                    className={`px-3 py-1 text-sm rounded-lg ${
                      payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">
              No transactions found.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mt-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-blue-500 text-2xl">💳</div>
            <h3 className="font-semibold mt-2">Make Payment</h3>
            <p className="text-sm text-gray-500">Pay your current rent</p>
            <button
              onClick={() => navigate("/payments/pay-now")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Pay Now
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-blue-500 text-2xl">🔄</div>
            <h3 className="font-semibold mt-2">Payment History</h3>
            <p className="text-sm text-gray-500">View all transactions</p>
            <button
              onClick={() => navigate("/payments/history")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              View
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-blue-500 text-2xl">🏦</div>
            <h3 className="font-semibold mt-2">Payment Methods</h3>
            <p className="text-sm text-gray-500">Manage payment options</p>
            <button
              onClick={() => navigate("/payments/manage")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
