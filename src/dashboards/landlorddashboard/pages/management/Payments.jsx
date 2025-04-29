import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaEllipsisV,
  FaDownload,
} from "react-icons/fa";
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // For sorting indicators
import { toast } from "react-toastify";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Button from "../../../../components/Button";
import { useDarkMode } from "../../../../context/DarkModeContext";
import landlordApi from "../../../../api/landlordApi";

// Conversion rates (approximate as of April 2025)
const conversionRates = {
  "GH₵": 1, // Base currency
  USD: 0.064, // 1 GH₵ = 0.064 USD
  EUR: 0.058, // 1 GH₵ = 0.058 EUR
};

// Convert price from GH₵ to the selected currency
const convertPrice = (priceInCedis, targetCurrency) => {
  const price = parseFloat(priceInCedis);
  if (isNaN(price)) return "0.00";
  const convertedPrice = price * conversionRates[targetCurrency];
  return convertedPrice.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

/**
 * Payments Component for Landlord
 *
 * Displays a list of payments for the landlord, with summary cards for total collected, pending, and overdue payments.
 * Includes a search bar, filter tabs (All, Pending, Completed, Overdue), and a table of payments.
 * Fetches payment data using react-query for better state management and caching.
 * Features:
 * - Skeleton loader with a minimum 2-second display for UX consistency.
 * - Responsive design: Stacks cards vertically on mobile, makes the table scrollable.
 * - Search functionality to filter payments by name or apartment.
 * - Sorting options for the table (by date or amount).
 * - Currency conversion between GH₵, USD, and EUR.
 * - Modal for recording new payments.
 * - Edit payment functionality via a modal.
 * - Download receipt for completed payments.
 * - Export payments to CSV.
 * - Consistent error handling with ErrorDisplay and toast notifications.
 */
const Payments = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    order: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currency, setCurrency] = useState("GH₵");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("record"); // "record" or "edit"
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    apt: "",
    amount: "",
    date: "",
    status: "Pending",
  });

  // Fetch payments using react-query
  const {
    data: payments = [],
    error,
    isLoading: paymentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["landlordPayments"],
    queryFn: () => landlordApi.fetchPayments(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[Payments] Fetch payments error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false, // Prevent bounces
  });

  // Fetch properties to populate dropdowns in the modal
  const {
    data: properties = [],
    error: propertiesError,
    isLoading: propertiesLoading,
  } = useQuery({
    queryKey: ["landlordProperties"],
    queryFn: () => landlordApi.fetchProperties(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    onError: (error) => {
      console.error("[Payments] Fetch properties error:", error);
    },
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Mutation to record a new payment
  const recordPaymentMutation = useMutation({
    mutationFn: (paymentData) =>
      landlordApi.recordPayment(localStorage.getItem("token"), paymentData),
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      refetch();
      closeModal();
    },
    onError: (err) => {
      toast.error(`Failed to record payment: ${err.message}`);
    },
  });

  // Mutation to update a payment
  const updatePaymentMutation = useMutation({
    mutationFn: ({ paymentId, paymentData }) =>
      landlordApi.updatePayment(
        localStorage.getItem("token"),
        paymentId,
        paymentData
      ),
    onSuccess: () => {
      toast.success("Payment updated successfully!");
      refetch();
      closeModal();
    },
    onError: (err) => {
      toast.error(`Failed to update payment: ${err.message}`);
    },
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId) =>
      landlordApi.deletePayment(localStorage.getItem("token"), paymentId),
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to delete payment: ${err.message}`);
    },
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!paymentsLoading && !propertiesLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentsLoading, propertiesLoading]);

  // Memoized filtered and sorted payments with currency conversion
  const filteredPayments = useMemo(() => {
    let result = [...payments].map((payment) => ({
      ...payment,
      amountInCedis: payment.amount || 0, // Store original amount in GH₵
      amount: parseFloat(convertPrice(payment.amount || 0, currency)), // Convert for display
    }));

    // Apply filter by status
    if (filter !== "All") {
      result = result.filter((payment) => payment.status === filter);
    }

    // Apply search query (case-insensitive search by name or apartment)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (payment) =>
          (payment.name?.toLowerCase() || "").includes(query) ||
          (payment.apt?.toLowerCase() || "").includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        if (sortConfig.field === "date") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [payments, filter, searchQuery, sortConfig, currency]);

  // Calculate totals for summary cards (in selected currency)
  const totalCollected = payments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalPending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const totalOverdue = payments
    .filter((payment) => payment.status === "Overdue")
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const toggleDropdown = (paymentId) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [paymentId]: !prev[paymentId],
    }));
  };

  const openRecordModal = () => {
    setModalType("record");
    setFormData({
      name: "",
      apt: "",
      amount: "",
      date: new Date().toISOString().split("T")[0], // Default to today
      status: "Pending",
    });
    setSelectedPayment(null);
    setModalOpen(true);
  };

  const openEditModal = (payment) => {
    setModalType("edit");
    setFormData({
      name: payment.name || "",
      apt: payment.apt || "",
      amount: payment.amountInCedis || "",
      date: payment.date
        ? new Date(payment.date).toISOString().split("T")[0]
        : "",
      status: payment.status || "Pending",
    });
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      name: "",
      apt: "",
      amount: "",
      date: "",
      status: "Pending",
    });
    setSelectedPayment(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordPayment = () => {
    const { name, apt, amount, date, status } = formData;
    if (!name || !apt || !amount || !date || !status) {
      toast.error("All fields are required.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }

    recordPaymentMutation.mutate({
      name,
      apt,
      amount: parseFloat(amount),
      date,
      status,
    });
  };

  const handleEditPayment = () => {
    const { name, apt, amount, date, status } = formData;
    if (!name || !apt || !amount || !date || !status) {
      toast.error("All fields are required.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }

    updatePaymentMutation.mutate({
      paymentId: selectedPayment.id,
      paymentData: {
        name,
        apt,
        amount: parseFloat(amount),
        date,
        status,
      },
    });
  };

  const handleDownloadReceipt = (payment) => {
    console.log("Downloading receipt for payment:", payment);
    // TODO: Implement receipt download (e.g., generate PDF or fetch from API)
  };

  const handleExportPayments = () => {
    const csvContent = [
      ["Name", "Apartment", "Amount", "Date", "Status"],
      ...filteredPayments.map((payment) => [
        payment.name || "Unknown",
        payment.apt || "Unknown",
        `${currency}${payment.amount.toLocaleString()}`,
        payment.date ? new Date(payment.date).toLocaleDateString() : "Unknown",
        payment.status || "Unknown",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "payments_export.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  // Combine errors for display
  const combinedError = error || propertiesError;

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <GlobalSkeleton
            type="payments"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.5s"
          />
        </div>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={combinedError}
              className={darkMode ? "text-red-400" : "text-red-500"}
            />
            <Button
              variant="primary"
              onClick={() => {
                setLoading(true);
                refetch();
              }}
              className="text-sm sm:text-base"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="p-4 sm:p-6 w-full overflow-auto">
        {/* Breadcrumb Navigation */}
        <nav
          className={`mb-4 text-sm sm:text-base ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <span
            className={`font-semibold ${
              darkMode ? "text-gray-200" : "text-black"
            }`}
          >
            Dashboard
          </span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold">Payments</h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              className="flex items-center text-sm sm:text-base"
              onClick={openRecordModal}
            >
              <FaPlus className="mr-2" /> Record Payment
            </Button>
            <Button
              variant="secondary"
              className="flex items-center text-sm sm:text-base"
              onClick={handleExportPayments}
            >
              <FaDownload className="mr-2" /> Export Payments
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg shadow flex items-center ${
              darkMode ? "bg-blue-900" : "bg-blue-50"
            }`}
          >
            <div
              className={`p-3 rounded-full mr-4 ${
                darkMode ? "bg-blue-700" : "bg-blue-100"
              }`}
            >
              <FaSearch
                className={darkMode ? "text-blue-400" : "text-blue-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Collected
              </p>
              <p className="text-xl sm:text-2xl font-semibold">
                {currency}
                {convertPrice(totalCollected, currency)}
              </p>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg shadow flex items-center ${
              darkMode ? "bg-yellow-900" : "bg-yellow-50"
            }`}
          >
            <div
              className={`p-3 rounded-full mr-4 ${
                darkMode ? "bg-yellow-700" : "bg-yellow-100"
              }`}
            >
              <FaSearch
                className={darkMode ? "text-yellow-400" : "text-yellow-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Pending
              </p>
              <p className="text-xl sm:text-2xl font-semibold">
                {currency}
                {convertPrice(totalPending, currency)}
              </p>
            </div>
          </div>
          <div
            className={`p-4 rounded-lg shadow flex items-center ${
              darkMode ? "bg-red-900" : "bg-red-50"
            }`}
          >
            <div
              className={`p-3 rounded-full mr-4 ${
                darkMode ? "bg-red-700" : "bg-red-100"
              }`}
            >
              <FaSearch
                className={darkMode ? "text-red-400" : "text-red-600"}
              />
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Overdue
              </p>
              <p className="text-xl sm:text-2xl font-semibold">
                {currency}
                {convertPrice(totalOverdue, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar and Currency Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div
            className={`flex items-center border p-2 rounded-lg shadow-sm flex-1 ${
              darkMode
                ? "border-gray-600 bg-gray-800"
                : "border-gray-300 bg-white"
            }`}
          >
            <FaSearch
              className={darkMode ? "text-gray-400 ml-2" : "text-gray-400 ml-2"}
            />
            <input
              type="text"
              placeholder="Search payments by name or apartment..."
              className={`ml-2 w-full outline-none text-sm sm:text-base ${
                darkMode
                  ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "bg-white text-gray-800 placeholder-gray-500"
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`border p-2 rounded-lg text-sm sm:text-base ${
              darkMode
                ? "border-gray-600 bg-gray-800 text-gray-200"
                : "border-gray-300 bg-white text-gray-800"
            }`}
          >
            <option value="GH₵">GH₵ (Cedis)</option>
            <option value="USD">USD (Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
        </div>

        {/* Filter Tabs */}
        <div
          className={`flex space-x-2 sm:space-x-4 text-sm border-b pb-2 mb-4 overflow-x-auto scrollbar-thin ${
            darkMode
              ? "border-gray-700 scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              : "border-gray-200 scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          }`}
        >
          {["All", "Pending", "Completed", "Overdue"].map((status) => (
            <span
              key={status}
              onClick={() => setFilter(status)}
              onKeyDown={(e) => e.key === "Enter" && setFilter(status)}
              className={`cursor-pointer px-3 py-2 rounded-lg whitespace-nowrap ${
                filter === status
                  ? darkMode
                    ? "font-semibold bg-teal-500 text-white"
                    : "font-semibold bg-blue-600 text-white"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${status} payments`}
            >
              {status}
            </span>
          ))}
        </div>

        {/* Payments Table */}
        <div
          className={`rounded-lg shadow p-4 overflow-x-auto ${
            darkMode
              ? "bg-gray-900 shadow-gray-700"
              : "bg-white shadow-gray-200"
          }`}
        >
          <table className="w-full text-left">
            <thead>
              <tr
                className={`border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <th
                  className="p-3 cursor-pointer text-sm sm:text-base"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig.field === "name" &&
                      (sortConfig.order === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      ))}
                  </div>
                </th>
                <th className="p-3 text-sm sm:text-base">Apartment</th>
                <th
                  className="p-3 cursor-pointer text-sm sm:text-base"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    {sortConfig.field === "amount" &&
                      (sortConfig.order === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      ))}
                  </div>
                </th>
                <th
                  className="p-3 cursor-pointer text-sm sm:text-base"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.field === "date" &&
                      (sortConfig.order === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      ))}
                  </div>
                </th>
                <th className="p-3 text-sm sm:text-base">Status</th>
                <th className="p-3 text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className={`border-b ${
                    payment.status === "Completed"
                      ? darkMode
                        ? "bg-green-900"
                        : "bg-green-50"
                      : payment.status === "Pending"
                      ? darkMode
                        ? "bg-yellow-900"
                        : "bg-yellow-50"
                      : payment.status === "Overdue"
                      ? darkMode
                        ? "bg-red-900"
                        : "bg-red-50"
                      : darkMode
                      ? "bg-gray-800"
                      : "bg-white"
                  } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <td className="p-3 text-sm sm:text-base">
                    {payment.name || "Unknown"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {payment.apt || "Unknown"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {currency}
                    {payment.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {payment.date
                      ? new Date(payment.date).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {payment.status || "Unknown"}
                  </td>
                  <td className="p-3 relative">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        className="text-sm sm:text-base"
                        onClick={() => openEditModal(payment)}
                        aria-label={`Edit payment for ${
                          payment.name || "payment"
                        }`}
                      >
                        <FaEdit />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="secondary"
                          className="text-sm sm:text-base"
                          onClick={() => toggleDropdown(payment.id)}
                          aria-label={`More actions for ${
                            payment.name || "payment"
                          }`}
                        >
                          <FaEllipsisV />
                        </Button>
                        {dropdownOpen[payment.id] && (
                          <div
                            className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-10 ${
                              darkMode
                                ? "bg-gray-800 border-gray-600"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <Button
                              variant="secondary"
                              className="block w-full text-left px-4 py-2 text-sm"
                              onClick={() => openEditModal(payment)}
                            >
                              Edit
                            </Button>
                            {payment.status === "Completed" && (
                              <Button
                                variant="secondary"
                                className="block w-full text-left px-4 py-2 text-sm"
                                onClick={() => handleDownloadReceipt(payment)}
                              >
                                Download Receipt
                              </Button>
                            )}
                            <Button
                              variant="secondary"
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                darkMode ? "text-red-400" : "text-red-600"
                              } hover:bg-gray-100`}
                              onClick={() => {
                                deletePaymentMutation.mutate(payment.id);
                                setDropdownOpen((prev) => ({
                                  ...prev,
                                  [payment.id]: false,
                                }));
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <p
              className={`text-center py-4 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No payments found for &quot;{filter}&quot; status.
            </p>
          )}
        </div>

        {/* Modal for Recording/Editing Payments */}
        {modalOpen && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              darkMode ? "bg-black/50" : "bg-black/30"
            }`}
          >
            <div
              className={`rounded-lg p-6 w-full max-w-md ${
                darkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                {modalType === "record" ? "Record Payment" : "Edit Payment"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    placeholder="Enter tenant name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apt"
                    className="block text-sm font-medium mb-1"
                  >
                    Apartment
                  </label>
                  <select
                    id="apt"
                    name="apt"
                    value={formData.apt}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    disabled={propertiesLoading}
                  >
                    <option value="">Select an apartment</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.title}>
                        {property.title || "Untitled Property"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium mb-1"
                  >
                    Amount (GH₵)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    placeholder="Enter amount"
                    min="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  className="text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={
                    modalType === "record"
                      ? handleRecordPayment
                      : handleEditPayment
                  }
                  className="text-sm sm:text-base"
                  disabled={
                    recordPaymentMutation.isLoading ||
                    updatePaymentMutation.isLoading
                  }
                >
                  {recordPaymentMutation.isLoading ||
                  updatePaymentMutation.isLoading
                    ? "Saving..."
                    : modalType === "record"
                    ? "Record"
                    : "Update"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
