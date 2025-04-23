// import { useState, useEffect, useMemo } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { FaSearch, FaPlus, FaEdit, FaEllipsisV } from "react-icons/fa";
// import { toast } from "react-toastify";
// import GlobalSkeleton from "../../../../components/GlobalSkeleton";
// import ErrorDisplay from "../../../../components/ErrorDisplay";
// import Button from "../../../../components/Button";
// import landlordApi from "../../../../api/landlord";

// /**
//  * Payments Component
//  *
//  * Displays a list of payments for the landlord, with summary cards for total collected, pending, and overdue payments.
//  * Includes a search bar, filter tabs (All, Pending, Completed, Overdue), and a table of payments.
//  * Fetches payment data using react-query for better state management and caching.
//  * Features:
//  * - Skeleton loader with a minimum 2-second display for UX consistency.
//  * - Responsive design: Stacks cards vertically on mobile, makes the table scrollable.
//  * - Search functionality to filter payments by name or apartment.
//  * - Sorting options for the table (by date or amount).
//  * - Dropdown menu for actions (edit, delete) on each payment.
//  * - Consistent error handling with ErrorDisplay and toast notifications.
//  */
// const Payments = () => {
//   const [filter, setFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     field: "date",
//     order: "desc",
//   });
//   const [loading, setLoading] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState({});

//   // Fetch payments using react-query
//   const {
//     data: payments = [],
//     error,
//     isLoading: paymentsLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["landlordPayments"],
//     queryFn: () => landlordApi.fetchPayments(localStorage.getItem("token")),
//     enabled: !!localStorage.getItem("token"),
//   });

//   // Delete payment mutation
//   const deletePaymentMutation = useMutation({
//     mutationFn: (paymentId) =>
//       landlordApi.deletePayment(localStorage.getItem("token"), paymentId),
//     onSuccess: () => {
//       toast.success("Payment deleted successfully!");
//       refetch(); // Refetch payments after deletion
//     },
//     onError: (err) => {
//       toast.error(`Failed to delete payment: ${err.message}`);
//     },
//   });

//   // Ensure minimum 2-second loading for UX consistency
//   useEffect(() => {
//     if (!paymentsLoading) {
//       const timer = setTimeout(() => setLoading(false), 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [paymentsLoading]);

//   // Memoized filtered and sorted payments
//   const filteredPayments = useMemo(() => {
//     let result = [...payments];

//     // Apply filter by status
//     if (filter !== "All") {
//       result = result.filter((payment) => payment.status === filter);
//     }

//     // Apply search query (case-insensitive search by name or apartment)
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (payment) =>
//           payment.name.toLowerCase().includes(query) ||
//           payment.apt.toLowerCase().includes(query)
//       );
//     }

//     // Apply sorting
//     if (sortConfig.field) {
//       result.sort((a, b) => {
//         let aValue = a[sortConfig.field];
//         let bValue = b[sortConfig.field];

//         if (sortConfig.field === "date") {
//           aValue = new Date(aValue);
//           bValue = new Date(bValue);
//         }

//         if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
//         if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [payments, filter, searchQuery, sortConfig]);

//   // Calculate totals for summary cards
//   const totalCollected = payments
//     .filter((payment) => payment.status === "Completed")
//     .reduce((sum, payment) => sum + payment.amount, 0);

//   const totalPending = payments
//     .filter((payment) => payment.status === "Pending")
//     .reduce((sum, payment) => sum + payment.amount, 0);

//   const totalOverdue = payments
//     .filter((payment) => payment.status === "Overdue")
//     .reduce((sum, payment) => sum + payment.amount, 0);

//   const handleSort = (field) => {
//     setSortConfig((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//   };

//   const toggleDropdown = (paymentId) => {
//     setDropdownOpen((prev) => ({
//       ...prev,
//       [paymentId]: !prev[paymentId],
//     }));
//   };

//   const handleEditPayment = (payment) => {
//     console.log("Editing payment:", payment);
//     // TODO: Implement edit functionality (e.g., open a modal with a form)
//   };

//   const handleDeletePayment = (paymentId) => {
//     deletePaymentMutation.mutate(paymentId);
//     setDropdownOpen((prev) => ({ ...prev, [paymentId]: false }));
//   };

//   if (loading) {
//     return (
//       <div className="flex h-screen">
//         <div className="p-6 w-full">
//           <GlobalSkeleton
//             type="payments"
//             bgColor="bg-gray-300"
//             animationSpeed="1.5s"
//           />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen">
//         <div className="p-6 w-full">
//           <div className="flex flex-col items-center justify-center h-full space-y-4">
//             <ErrorDisplay error={error} />
//             <Button
//               onClick={() => {
//                 setLoading(true);
//                 refetch();
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//               Retry
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen">
//       <div className="p-4 sm:p-6 w-full overflow-auto">
//         {/* Breadcrumb Navigation */}
//         <nav className="text-gray-500 mb-4 text-sm sm:text-base">
//           <span className="text-black font-semibold">Dashboard</span>
//         </nav>

//         {/* Header Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
//           <h2 className="text-xl sm:text-2xl font-bold">Payments</h2>
//           <Button
//             className="flex items-center bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
//             onClick={() => console.log("Record Payment clicked")}
//           >
//             <FaPlus className="mr-2" /> Record Payment
//           </Button>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
//             <div className="bg-blue-100 p-3 rounded-full mr-4">
//               <FaSearch className="text-blue-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Total Collected</p>
//               <p className="text-xl sm:text-2xl font-semibold">
//                 GH₵{totalCollected.toLocaleString()}
//               </p>
//             </div>
//           </div>
//           <div className="bg-yellow-50 p-4 rounded-lg shadow flex items-center">
//             <div className="bg-yellow-100 p-3 rounded-full mr-4">
//               <FaSearch className="text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Pending</p>
//               <p className="text-xl sm:text-2xl font-semibold">
//                 GH₵{totalPending.toLocaleString()}
//               </p>
//             </div>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg shadow flex items-center">
//             <div className="bg-red-100 p-3 rounded-full mr-4">
//               <FaSearch className="text-red-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-sm">Overdue</p>
//               <p className="text-xl sm:text-2xl font-semibold">
//                 GH₵{totalOverdue.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="flex items-center border p-2 rounded-lg bg-white shadow-sm mb-4">
//           <FaSearch className="text-gray-400 ml-2" />
//           <input
//             type="text"
//             placeholder="Search payments by name or apartment..."
//             className="ml-2 w-full outline-none text-sm sm:text-base"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex space-x-2 sm:space-x-4 text-sm border-b pb-2 mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//           {["All", "Pending", "Completed", "Overdue"].map((status) => (
//             <span
//               key={status}
//               onClick={() => setFilter(status)}
//               onKeyDown={(e) => e.key === "Enter" && setFilter(status)}
//               className={`cursor-pointer px-3 py-2 rounded-lg whitespace-nowrap ${
//                 filter === status
//                   ? "font-semibold bg-blue-600 text-white"
//                   : "text-gray-500 hover:text-gray-800"
//               }`}
//               role="button"
//               tabIndex={0}
//               aria-label={`Filter by ${status} payments`}
//             >
//               {status}
//             </span>
//           ))}
//         </div>

//         {/* Payments Table */}
//         <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th
//                   className="p-3 cursor-pointer text-sm sm:text-base"
//                   onClick={() => handleSort("name")}
//                 >
//                   Name{" "}
//                   {sortConfig.field === "name" &&
//                     (sortConfig.order === "asc" ? "↑" : "↓")}
//                 </th>
//                 <th className="p-3 text-sm sm:text-base">Apartment</th>
//                 <th
//                   className="p-3 cursor-pointer text-sm sm:text-base"
//                   onClick={() => handleSort("amount")}
//                 >
//                   Amount{" "}
//                   {sortConfig.field === "amount" &&
//                     (sortConfig.order === "asc" ? "↑" : "↓")}
//                 </th>
//                 <th
//                   className="p-3 cursor-pointer text-sm sm:text-base"
//                   onClick={() => handleSort("date")}
//                 >
//                   Date{" "}
//                   {sortConfig.field === "date" &&
//                     (sortConfig.order === "asc" ? "↑" : "↓")}
//                 </th>
//                 <th className="p-3 text-sm sm:text-base">Status</th>
//                 <th className="p-3 text-sm sm:text-base">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPayments.map((payment) => (
//                 <tr
//                   key={payment.id}
//                   className={`border-b ${
//                     payment.status === "Completed"
//                       ? "bg-green-50"
//                       : payment.status === "Pending"
//                       ? "bg-yellow-50"
//                       : payment.status === "Overdue"
//                       ? "bg-red-50"
//                       : ""
//                   }`}
//                 >
//                   <td className="p-3 text-sm sm:text-base">{payment.name}</td>
//                   <td className="p-3 text-sm sm:text-base">{payment.apt}</td>
//                   <td className="p-3 text-sm sm:text-base">
//                     GH₵{payment.amount.toLocaleString()}
//                   </td>
//                   <td className="p-3 text-sm sm:text-base">
//                     {new Date(payment.date).toLocaleDateString()}
//                   </td>
//                   <td className="p-3 text-sm sm:text-base">{payment.status}</td>
//                   <td className="p-3 relative">
//                     <div className="flex space-x-2">
//                       <FaEdit
//                         className="text-gray-500 cursor-pointer hover:text-gray-700"
//                         onClick={() => handleEditPayment(payment)}
//                         aria-label={`Edit payment for ${payment.name}`}
//                       />
//                       <div className="relative">
//                         <FaEllipsisV
//                           className="text-gray-500 cursor-pointer hover:text-gray-700"
//                           onClick={() => toggleDropdown(payment.id)}
//                           aria-label={`More actions for ${payment.name}`}
//                         />
//                         {dropdownOpen[payment.id] && (
//                           <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
//                             <button
//                               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                               onClick={() => handleEditPayment(payment)}
//                             >
//                               Edit
//                             </button>
//                             <button
//                               className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                               onClick={() => handleDeletePayment(payment.id)}
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredPayments.length === 0 && (
//             <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
//               No payments found for &quot;{filter}&quot; status.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payments;

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
import { useDarkMode } from "../../../../context/DarkModeContext"; // Import useDarkMode
import landlordApi from "../../../../api/landlord";

// Conversion rates (approximate as of April 2025)
const conversionRates = {
  "GH₵": 1, // Base currency
  USD: 0.064, // 1 GH₵ = 0.064 USD
  EUR: 0.058, // 1 GH₵ = 0.058 EUR
};

// Convert price from GH₵ to the selected currency
const convertPrice = (priceInCedis, targetCurrency) => {
  const price = parseFloat(priceInCedis);
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
 */
const Payments = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    order: "desc",
  });
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currency, setCurrency] = useState("GH₵"); // Default currency is Cedis

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
  });

  // Delete payment mutation
  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId) =>
      landlordApi.deletePayment(localStorage.getItem("token"), paymentId),
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      refetch(); // Refetch payments after deletion
    },
    onError: (err) => {
      toast.error(`Failed to delete payment: ${err.message}`);
    },
  });

  // Ensure minimum 2-second loading for UX consistency
  useEffect(() => {
    if (!paymentsLoading) {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentsLoading]);

  // Memoized filtered and sorted payments with currency conversion
  const filteredPayments = useMemo(() => {
    let result = [...payments].map((payment) => ({
      ...payment,
      amountInCedis: payment.amount, // Store original amount in GH₵
      amount: parseFloat(convertPrice(payment.amount, currency)), // Convert for display
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
          payment.name.toLowerCase().includes(query) ||
          payment.apt.toLowerCase().includes(query)
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
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalPending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalOverdue = payments
    .filter((payment) => payment.status === "Overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

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

  const handleEditPayment = (payment) => {
    console.log("Editing payment:", payment);
    // TODO: Implement edit functionality (e.g., open a modal with a form)
  };

  const handleDeletePayment = (paymentId) => {
    deletePaymentMutation.mutate(paymentId);
    setDropdownOpen((prev) => ({ ...prev, [paymentId]: false }));
  };

  const handleDownloadReceipt = (payment) => {
    console.log("Downloading receipt for payment:", payment);
    // TODO: Implement receipt download (e.g., generate PDF or fetch from API)
  };

  const handleExportPayments = () => {
    const csvContent = [
      ["Name", "Apartment", "Amount", "Date", "Status"],
      ...filteredPayments.map((payment) => [
        payment.name,
        payment.apt,
        `${currency}${payment.amount}`,
        new Date(payment.date).toLocaleDateString(),
        payment.status,
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

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="p-6 w-full">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ErrorDisplay
              error={error}
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
              onClick={() => console.log("Record Payment clicked")}
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
                  <td className="p-3 text-sm sm:text-base">{payment.name}</td>
                  <td className="p-3 text-sm sm:text-base">{payment.apt}</td>
                  <td className="p-3 text-sm sm:text-base">
                    {currency}
                    {payment.amount.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm sm:text-base">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm sm:text-base">{payment.status}</td>
                  <td className="p-3 relative">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        className="text-sm sm:text-base"
                        onClick={() => handleEditPayment(payment)}
                        aria-label={`Edit payment for ${payment.name}`}
                      >
                        <FaEdit />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="secondary"
                          className="text-sm sm:text-base"
                          onClick={() => toggleDropdown(payment.id)}
                          aria-label={`More actions for ${payment.name}`}
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
                              onClick={() => handleEditPayment(payment)}
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
                              onClick={() => handleDeletePayment(payment.id)}
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
      </div>
    </div>
  );
};

export default Payments;