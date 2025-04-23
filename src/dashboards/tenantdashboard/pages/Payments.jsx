import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BASE_URL } from "../../../config";
import TenantSkeleton from "../../../components/skeletons/TenantSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext"; // Import useDarkMode
import Button from "../../../components/Button"; // Import Button component

const Payments = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchPayments = useCallback(async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/tenantlogin");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/payments/tenant/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || "Unknown error"}`
        );
      }

      const data = await response.json();
      setPayments(data || []);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching payments data:", err);
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
        }, 2000);
      } else {
        setError(
          `Failed to fetch payments after ${maxRetries} attempts: ${err.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, retryCount]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRetry = () => {
    setRetryCount(0);
    setLoading(true);
    fetchPayments();
  };

  const toggleCardExpansion = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const filteredPayments = payments.filter((payment) => {
    if (activeFilter === "upcoming") return payment.status === "Pending";
    if (activeFilter === "past-due") return payment.status !== "Pending";
    return true;
  });

  return (
    <div
      className={`flex flex-col h-screen p-4 md:p-6 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <h1 className="text-2xl font-bold text-center md:text-left">Payments</h1>

      <nav
        className={`flex space-x-6 mt-6 overflow-x-auto sticky top-0 z-10 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        {[
          { key: "all", label: "All Transactions" },
          { key: "upcoming", label: "Upcoming Due" },
          { key: "past-due", label: "Past Due" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`py-2 px-4 rounded-md text-base min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeFilter === key
                ? darkMode
                  ? "bg-teal-500 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={`Filter by ${label}`}
            role="tab"
            aria-selected={activeFilter === key}
          >
            {label}
          </button>
        ))}
      </nav>

      <div
        className={`rounded-lg shadow-md pb-20 mt-6 overflow-y-auto ${
          darkMode ? "bg-gray-900 shadow-gray-700" : "bg-white shadow-gray-200"
        }`}
      >
        {loading ? (
          <TenantSkeleton
            layout="payments"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
          />
        ) : error ? (
          <div className="flex flex-col items-center justify-center">
            <p
              className={`text-center ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              {error}
            </p>
            <Button
              variant="primary"
              onClick={handleRetry}
              className="mt-4 text-base"
              aria-label="Retry fetching payments"
            >
              Retry
            </Button>
          </div>
        ) : filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className={`p-4 border-b last:border-none rounded-lg mb-3 shadow-sm cursor-pointer ${
                expandedCard === payment.id
                  ? darkMode
                    ? "bg-teal-900"
                    : "bg-blue-100"
                  : darkMode
                  ? "bg-gray-800"
                  : "bg-gray-50"
              }`}
              onClick={() => toggleCardExpansion(payment.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleCardExpansion(payment.id);
                }
              }}
              aria-expanded={expandedCard === payment.id}
              aria-label={`View details for ${payment.name}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg" aria-hidden="true">
                    💰
                  </span>
                  <div>
                    <h3 className="font-semibold text-base">{payment.name}</h3>
                    <p
                      className={`text-base ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {payment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-base rounded-lg ${
                      payment.status === "Pending"
                        ? darkMode
                          ? "bg-yellow-900 text-yellow-300"
                          : "bg-yellow-100 text-yellow-600"
                        : darkMode
                        ? "bg-green-900 text-green-300"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                  {expandedCard === payment.id ? (
                    <FiChevronUp
                      className={darkMode ? "text-gray-400" : "text-gray-500"}
                    />
                  ) : (
                    <FiChevronDown
                      className={darkMode ? "text-gray-400" : "text-gray-500"}
                    />
                  )}
                </div>
              </div>
              {expandedCard === payment.id && (
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span
                      className={`text-base ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Amount:
                    </span>
                    <span className="font-semibold text-base">
                      {payment.amount}
                    </span>
                  </div>
                  <Button
                    variant={
                      payment.status === "Pending" ? "primary" : "secondary"
                    }
                    onClick={() => {
                      if (payment.status === "Pending") {
                        navigate("/payments/pay-now");
                      }
                    }}
                    className={`mt-3 w-full text-base ${
                      payment.status !== "Pending" ? "cursor-not-allowed" : ""
                    }`}
                    disabled={payment.status !== "Pending"}
                    aria-label={
                      payment.status === "Pending"
                        ? "Pay now"
                        : "View payment details"
                    }
                  >
                    {payment.status === "Pending" ? "Pay Now" : "View Details"}
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p
            className={`text-center mt-4 text-base ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Payments;
