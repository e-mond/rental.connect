import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaEllipsisV,
  FaDownload,
} from "react-icons/fa";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import GlobalSkeleton from "../../../../components/GlobalSkeleton";
import ErrorDisplay from "../../../../components/ErrorDisplay";
import Button from "../../../../components/Button";
import { useDarkMode } from "../../../../context/DarkModeContext";
import landlordApi from "../../../../api/landlord/landlordApi";

// Conversion rates for currency conversion
const conversionRates = { "GH₵": 1, USD: 0.064, EUR: 0.058 };

const convertPrice = (priceInCedis, targetCurrency) => {
  // Converting price from Cedis to target currency
  const price = parseFloat(priceInCedis);
  if (isNaN(price)) return "0.00";
  return (price * conversionRates[targetCurrency]).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const Payments = () => {
  const { darkMode } = useDarkMode();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "paymentDate",
    order: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currency, setCurrency] = useState("GH₵");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("record");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    apt: "",
    amount: "",
    tenantId: "",
    leaseId: "",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    notes: "",
  });

  const {
    data: payments = [],
    error,
    isLoading: paymentsLoading,
    refetch,
  } = useQuery({
    queryKey: ["landlordPayments"],
    queryFn: () => landlordApi.fetchPayments(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: properties = [],
    error: propertiesError,
    isLoading: propertiesLoading,
  } = useQuery({
    queryKey: ["landlordProperties"],
    queryFn: () => landlordApi.fetchProperties(localStorage.getItem("token")),
    enabled: !!localStorage.getItem("token"),
    retry: 1,
    retryDelay: 2000,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (paymentData) =>
      landlordApi.recordPayment(localStorage.getItem("token"), paymentData),
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      refetch();
      closeModal();
    },
    onError: (err) => toast.error(`Failed to record payment: ${err.message}`),
  });

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
    onError: (err) => toast.error(`Failed to update payment: ${err.message}`),
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId) =>
      landlordApi.deletePayment(localStorage.getItem("token"), paymentId),
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      refetch();
    },
    onError: (err) => toast.error(`Failed to delete payment: ${err.message}`),
  });

  useEffect(() => {
    // Setting loading state with a delay after data is fetched
    if (!paymentsLoading && !propertiesLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentsLoading, propertiesLoading]);

  const filteredPayments = useMemo(() => {
    // Filtering and sorting payments based on user input
    let result = [...payments].map((payment) => ({
      ...payment,
      amountInCedis: payment.amount || 0,
      amount: parseFloat(convertPrice(payment.amount || 0, currency)),
    }));
    if (filter !== "All")
      result = result.filter((payment) => payment.status === filter);
    if (searchQuery)
      result = result.filter(
        (payment) =>
          (payment.name?.toLowerCase() || "").includes(
            searchQuery.toLowerCase()
          ) ||
          (payment.apt?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    if (sortConfig.field)
      result.sort((a, b) => {
        let aValue = a[sortConfig.field],
          bValue = b[sortConfig.field];
        if (sortConfig.field === "paymentDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        return aValue < bValue
          ? sortConfig.order === "asc"
            ? -1
            : 1
          : aValue > bValue
          ? sortConfig.order === "asc"
            ? 1
            : -1
          : 0;
      });
    return result;
  }, [payments, filter, searchQuery, sortConfig, currency]);

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalOverdue = payments
    .filter((p) => p.status === "Overdue")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleSort = (field) =>
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  const toggleDropdown = (paymentId) =>
    setDropdownOpen((prev) => ({ ...prev, [paymentId]: !prev[paymentId] }));
  const openRecordModal = () => {
    setModalType("record");
    setFormData({
      name: "",
      apt: "",
      amount: "",
      tenantId: "",
      leaseId: "",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      notes: "",
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
      tenantId: payment.tenantId || "",
      leaseId: payment.leaseId || "",
      status: payment.status || "Pending",
      paymentMethod: payment.paymentMethod || "Bank Transfer",
      notes: payment.notes || "",
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
      tenantId: "",
      leaseId: "",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      notes: "",
    });
    setSelectedPayment(null);
  };
  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleRecordPayment = () => {
    // Validating and recording a new payment
    if (
      !formData.name ||
      !formData.apt ||
      !formData.amount ||
      !formData.tenantId ||
      !formData.leaseId ||
      !formData.status ||
      !formData.paymentMethod
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString(),
    };
    recordPaymentMutation.mutate(paymentData);
    landlordApi.sendNotification(localStorage.getItem("token"), {
      recipientId: formData.tenantId,
      message: `Payment of ${formData.amount} recorded for ${formData.apt} via ${formData.paymentMethod}`,
    });
  };
  const handleEditPayment = () => {
    // Validating and updating an existing payment
    if (
      !formData.name ||
      !formData.apt ||
      !formData.amount ||
      !formData.tenantId ||
      !formData.leaseId ||
      !formData.status ||
      !formData.paymentMethod
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (isNaN(formData.amount) || formData.amount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: selectedPayment.paymentDate || new Date().toISOString(),
    };
    updatePaymentMutation.mutate({
      paymentId: selectedPayment.id,
      paymentData,
    });
    landlordApi.sendNotification(localStorage.getItem("token"), {
      recipientId: formData.tenantId,
      message: `Payment for ${formData.apt} updated to ${formData.status} via ${formData.paymentMethod}`,
    });
  };
  const handleExportPayments = () => {
    // Exporting payments data to CSV
    const csvContent = [
      [
        "Name",
        "Apartment",
        "Amount",
        "Date",
        "Status",
        "Payment Method",
        "Notes",
      ],
      ...filteredPayments.map((p) => [
        p.name || "Unknown",
        p.apt || "Unknown",
        `${currency}${p.amount.toLocaleString()}`,
        p.paymentDate
          ? new Date(p.paymentDate).toLocaleDateString()
          : "Unknown",
        p.status || "Unknown",
        p.paymentMethod || "Unknown",
        p.notes || "",
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

  const combinedError = error || propertiesError;

  if (loading)
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
  if (combinedError)
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

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="p-4 sm:p-6 w-full overflow-auto">
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
                  onClick={() => handleSort("paymentDate")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig.field === "paymentDate" &&
                      (sortConfig.order === "asc" ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      ))}
                  </div>
                </th>
                <th className="p-3 text-sm sm:text-base">Status</th>
                <th className="p-3 text-sm sm:text-base">Method</th>
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
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {payment.status || "Unknown"}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {payment.paymentMethod || "Unknown"}
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
                    htmlFor="tenantId"
                    className="block text-sm font-medium mb-1"
                  >
                    Tenant ID
                  </label>
                  <input
                    type="text"
                    id="tenantId"
                    name="tenantId"
                    value={formData.tenantId}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    placeholder="Enter tenant ID"
                  />
                </div>
                <div>
                  <label
                    htmlFor="leaseId"
                    className="block text-sm font-medium mb-1"
                  >
                    Lease ID
                  </label>
                  <input
                    type="text"
                    id="leaseId"
                    name="leaseId"
                    value={formData.leaseId}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    placeholder="Enter lease ID"
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
                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-1"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-200"
                        : "border-gray-300 bg-white text-gray-800"
                    }`}
                    placeholder="Enter any additional notes"
                    rows="3"
                  />
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
