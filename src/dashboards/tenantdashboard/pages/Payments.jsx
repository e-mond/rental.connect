import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import TenantSkeleton from "../../../components/skeletons/TenantSkeleton";
import { useDarkMode } from "../../../context/DarkModeContext";
import Button from "../../../components/Button";
import tenantApi from "../../../api/tenant/tenantApi";
import {
  FaList,
  FaClock,
  FaExclamationCircle,
  FaDollarSign,
  FaUser,
  FaNetworkWired,
  FaPhone,
  FaUniversity,
  FaHashtag,
  FaCode,
} from "react-icons/fa";

// Modal component for displaying payment forms with animation
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmAction,
  confirmLabel,
}) => {
  const { darkMode } = useDarkMode();
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className={`rounded-xl p-6 w-11/12 max-w-lg shadow-2xl ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="modal-title" className="text-xl font-semibold">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-4 py-3 rounded-lg touch-manipulation"
            aria-label="Cancel"
          >
            Cancel
          </Button>
          {confirmAction && confirmLabel && (
            <Button
              variant="primary"
              onClick={confirmAction}
              className="px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 rounded-lg shadow-md touch-manipulation"
              aria-label={confirmLabel}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmAction: PropTypes.func,
  confirmLabel: PropTypes.string,
};

const Payments = () => {
  const { darkMode } = useDarkMode();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [modalOpen, setModalOpen] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [momoData, setMomoData] = useState({
    network: "",
    number: "",
    amount: "",
  });
  const [bankData, setBankData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscSwiftCode: "",
    amount: "",
  });
  const [paystackData, setPaystackData] = useState({
    email: "",
    amount: "",
  });
  const [abortController] = useState(new AbortController());

  // Fetch current user details to ensure userId is stored
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user details.");
      }

      const userData = await response.json();
      if (userData.userId) {
        localStorage.setItem("userId", userData.userId);
      } else {
        throw new Error("User ID not found in response.");
      }
    } catch (err) {
      setError(
        err.message === "No token found. Please log in." ||
          err.message === "Invalid or expired token"
          ? "Your session has expired. Please log in again."
          : err.message.includes("Network Error")
          ? "Network issue. Please check your connection and try again."
          : err.message.includes("Server Error")
          ? "Server error. Please try again later."
          : err.message || "Failed to fetch user details."
      );
      setErrorType(
        err.message === "No token found. Please log in." ||
          err.message === "Invalid or expired token"
          ? "auth"
          : err.message.includes("Network Error")
          ? "network"
          : err.message.includes("Server Error")
          ? "server"
          : "unknown"
      );
      toast.error(err.message, { position: "top-right", autoClose: 2000 });

      if (
        err.message === "No token found. Please log in." ||
        err.message === "Invalid or expired token"
      ) {
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      }
    }
  }, [abortController]);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in. Please log in to view your payments.");
        setErrorType("auth");
        toast.error("Please log in to view your payments.", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
        return;
      }

      toast.info("Fetching your payments...", {
        position: "top-right",
        autoClose: 2000,
      });
      const data = await tenantApi.fetchPayments(token);
      setPayments(data || []);
    } catch (err) {
      setError(
        err.message === "Invalid or expired token"
          ? "Your session appears to be invalid. Please log in again."
          : err.message.includes("Network Error")
          ? "We’re having trouble connecting. Please check your network."
          : err.message.includes("Server Error")
          ? "Server unavailable. Please try again later."
          : "Error fetching payments. Please try again."
      );
      setErrorType(
        err.message === "Invalid or expired token"
          ? "auth"
          : err.message.includes("Network Error")
          ? "network"
          : err.message.includes("Server Error")
          ? "server"
          : "unknown"
      );
      toast.error(err.message, { position: "top-right", autoClose: 2000 });

      if (err.message === "Invalid or expired token") {
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Removed `error` and `errorType` from dependencies to prevent loop

  useEffect(() => {
    const initialize = async () => {
      await fetchCurrentUser();
      const tenantId = localStorage.getItem("userId");
      if (!tenantId) {
        await fetchCurrentUser(); // Retry once if userId is not set
      }
      await fetchPayments();
    };
    initialize();

    return () => abortController.abort();
  }, [fetchCurrentUser, fetchPayments, abortController]); // Dependencies are stable now

  const handleRetry = () => {
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

  const handleProcessPayment = async (payment) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in to process payments.");
      setErrorType("auth");
      toast.error("Please log in to process payments.", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      return;
    }

    const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, ""));
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid payment amount.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await tenantApi.processPayment(
        token,
        payment.id.toString(),
        {
          paymentMethod: selectedMethod,
          amount,
          email: "tenant@example.com", // Replace with dynamic tenant email
        }
      );

      if (
        selectedMethod === "paystack" &&
        response.headers["x-paystack-redirect"]
      ) {
        const redirectUrl = response.headers["x-paystack-redirect"];
        toast.info("Redirecting to Paystack Payment...", { autoClose: 2000 });
        window.location.href = redirectUrl; // Redirect to Paystack payment page
      } else {
        toast.success("Payment processed successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        await fetchPayments();
        setModalOpen(null);
        tenantApi.sendNotification(token, {
          recipientId: payment.landlordId || "landlord",
          message: `Payment of ${amount} GHS received from tenant for ${payment.name}`,
        });
      }
    } catch (err) {
      setError(
        err.message === "Invalid or expired token"
          ? "Your session has expired. Please log in again."
          : err.message.includes("Network Error")
          ? "Network issue. Please check your connection and try again."
          : err.message.includes("Server Error")
          ? "Server error. Please try again later."
          : err.message || "Failed to process payment."
      );
      setErrorType(
        err.message === "Invalid or expired token"
          ? "auth"
          : err.message.includes("Network Error")
          ? "network"
          : err.message.includes("Server Error")
          ? "server"
          : "unknown"
      );
      toast.error(err.message, { position: "top-right", autoClose: 2000 });

      if (err.message === "Invalid or expired token") {
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      }
    } finally {
      setProcessing(false);
    }
  };

  const initiatePaystackPayment = async (
    amount,
    email,
    paymentId,
    tenantId
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "You are not logged in. Please log in to process payments."
        );
      }

      console.log(`Initiating Paystack payment: ${amount} GHS for ${email}`);
      toast.info("Redirecting to Paystack Payment...", { autoClose: 2000 });

      const response = await fetch(
        `/api/payments/tenant/paystack/${paymentId}?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            email,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to initiate Paystack payment."
        );
      }

      const { redirectUrl } = await response.json();
      if (redirectUrl) {
        window.location.href = redirectUrl; // Redirect to Paystack payment page
      } else {
        throw new Error("No redirect URL provided by Paystack.");
      }
    } catch (err) {
      toast.error(`Paystack error: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Paystack payment error:", err);
      setProcessing(false);
    }
  };

  const handlePayment = async (e, payment) => {
    e.stopPropagation();
    if (payment.status !== "Pending") return;

    const tenantId = localStorage.getItem("userId");
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      return;
    }

    if (selectedMethod === "paystack") {
      const { email: paystackEmail, amount: paystackAmount } = paystackData;
      if (
        !paystackEmail ||
        !paystackAmount ||
        isNaN(paystackAmount) ||
        paystackAmount <= 0
      ) {
        toast.error("Please provide a valid email and amount.", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      await initiatePaystackPayment(
        paystackAmount,
        paystackEmail,
        payment.id,
        tenantId
      );
    } else if (selectedMethod === "momo") {
      setModalOpen("momo");
    } else if (selectedMethod === "bank") {
      setModalOpen("bank");
    } else {
      await handleProcessPayment(payment);
    }
  };

  const initiateMomoPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in to process payments.");
      setErrorType("auth");
      toast.error("Please log in to process payments.", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      return;
    }

    let tenantId = localStorage.getItem("userId");
    if (!tenantId) {
      await fetchCurrentUser(); // Retry fetching user details
      tenantId = localStorage.getItem("userId");
      if (!tenantId) {
        setError("Failed to retrieve tenant ID. Please log in again.");
        setErrorType("auth");
        toast.error("Failed to retrieve tenant ID. Please log in again.", {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
        return;
      }
    }

    const { network, number, amount } = momoData;
    if (!network || !number || !amount || isNaN(amount) || amount <= 0) {
      toast.error("Please fill all fields with valid data.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setProcessing(true);
    toast.info("You will receive a prompt to confirm the payment.", {
      position: "top-right",
      autoClose: 2000,
    });

    try {
      await tenantApi.initiateMomoPayment(token, {
        network,
        number,
        amount,
        tenantId,
      });
      toast.success("Transaction completed successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      setModalOpen(null);
      await fetchPayments();
      tenantApi.sendNotification(token, {
        recipientId: "landlord",
        message: `Payment of ${amount} GHS received via Mobile Money from tenant`,
      });
    } catch (err) {
      setError(
        err.message === "Invalid or expired token"
          ? "Your session has expired. Please log in again."
          : err.message.includes("Network Error")
          ? "Network issue. Please check your connection and try again."
          : err.message.includes("Server Error")
          ? "Server error. Please try again later."
          : err.message || "Failed to initiate Momo payment."
      );
      setErrorType(
        err.message === "Invalid or expired token"
          ? "auth"
          : err.message.includes("Network Error")
          ? "network"
          : err.message.includes("Server Error")
          ? "server"
          : "unknown"
      );
      toast.error(err.message, { position: "top-right", autoClose: 2000 });

      if (err.message === "Invalid or expired token") {
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      }
    } finally {
      setProcessing(false);
    }
  };

  const initiateSupportRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please log in to contact support.");
      setErrorType("auth");
      toast.error("Please log in to contact support.", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      return;
    }

    setProcessing(true);
    toast.info("Your support request is being initiated.", {
      position: "top-right",
      autoClose: 2000,
    });

    try {
      await tenantApi.initiateSupportRequest(token);
      toast.success("Support request completed! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
      });
      setProcessing(false);
      window.location.href = "/dashboard/tenant/support";
    } catch (err) {
      setError(
        err.message === "Invalid or expired token"
          ? "Your session has expired. Please log in again."
          : err.message.includes("Network Error")
          ? "Network issue. Please check your connection and try again."
          : err.message.includes("Server Error")
          ? "Server error. Please try again later."
          : err.message || "Failed to contact support."
      );
      setErrorType(
        err.message === "Invalid or expired token"
          ? "auth"
          : err.message.includes("Network Error")
          ? "network"
          : err.message.includes("Server Error")
          ? "server"
          : "unknown"
      );
      toast.error(err.message, { position: "top-right", autoClose: 2000 });

      if (err.message === "Invalid or expired token") {
        setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-[80%] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Rendering filter tabs for payment categorization */}
      <nav
        className={`flex flex-wrap gap-3 sm:gap-4 mt-10 sticky top-0 z-10 py-3 rounded-xl shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        {[
          { key: "all", label: "All Transactions", icon: FaList },
          { key: "upcoming", label: "Upcoming Due", icon: FaClock },
          { key: "past-due", label: "Past Due", icon: FaExclamationCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`flex items-center py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-teal-500 touch-manipulation ${
              activeFilter === key
                ? darkMode
                  ? "bg-teal-500 text-white"
                  : "bg-black text-white"
                : darkMode
                ? "bg-teal-500 text-white hover:bg-teal-600"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            aria-label={`Filter by ${label}`}
            role="tab"
            aria-selected={activeFilter === key}
          >
            <Icon className="mr-2 text-base" />
            {label}
          </button>
        ))}
        <button
          onClick={initiateSupportRequest}
          className={`ml-auto py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-teal-500 touch-manipulation ${
            darkMode
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-black text-white hover:bg-gray-800"
          }`}
          aria-label="Contact Support"
          disabled={processing}
        >
          <FaExclamationCircle className="mr-2 text-base" />
          Contact Support
        </button>
      </nav>

      {/* Displaying payment list with loading and error states */}
      <div
        className={`rounded-xl shadow-lg mt-6 p-6 ${
          darkMode ? "bg-gray-900 shadow-gray-800" : "bg-white shadow-gray-200"
        }`}
      >
        {loading ? (
          <TenantSkeleton
            layout="payments"
            bgColor={darkMode ? "bg-gray-700" : "bg-gray-300"}
            animationSpeed="1.2s"
            items={3}
          />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p
              className={`text-center text-lg ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
            >
              {error}
            </p>
            {(errorType === "network" || errorType === "server") && (
              <Button
                variant="primary"
                onClick={handleRetry}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 rounded-lg shadow-md touch-manipulation"
                aria-label="Retry fetching payments"
              >
                Retry
              </Button>
            )}
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl shadow-md p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    expandedCard === payment.id
                      ? darkMode
                        ? "bg-gradient-to-br from-gray-800 to-teal-900"
                        : "bg-gradient-to-br from-blue-50 to-blue-100"
                      : darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => toggleCardExpansion(payment.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      toggleCardExpansion(payment.id);
                  }}
                  aria-expanded={expandedCard === payment.id}
                  aria-label={`View details for ${payment.name}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <FaDollarSign
                        className={`text-2xl ${
                          payment.status === "Pending"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <h3
                          className={`font-semibold text-lg ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {payment.name}
                        </h3>
                        <p
                          className={`text-base ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Due: {payment.date}
                        </p>
                        <p
                          className={`text-base ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Transaction ID: {payment.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-base rounded-full font-medium ${
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
                          className={`text-lg ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        />
                      ) : (
                        <FiChevronDown
                          className={`text-lg ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedCard === payment.id ? "auto" : 0,
                      opacity: expandedCard === payment.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span
                          className={`text-base ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Amount:
                        </span>
                        <span
                          className={`font-semibold text-base ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {payment.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className={`text-base ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Type:
                        </span>
                        <span
                          className={`text-base ${
                            darkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {payment.type}
                        </span>
                      </div>
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className={`w-full p-3 rounded-lg border text-base ${
                          darkMode
                            ? "bg-gray-700 text-gray-100 border-gray-600"
                            : "bg-gray-100 text-gray-900 border-gray-300"
                        } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                        aria-label="Select payment method"
                        disabled={processing}
                      >
                        <option value="paystack">Paystack (Card/Wallet)</option>
                        <option value="momo">Mobile Money (Momo)</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                      <Button
                        variant={
                          payment.status === "Pending" ? "primary" : "secondary"
                        }
                        onClick={(e) => {
                          if (payment.status === "Pending") {
                            handlePayment(e, payment);
                          } else {
                            e.stopPropagation();
                            window.location.href =
                              "/dashboard/tenant/payments/details";
                          }
                        }}
                        className={`w-full py-3 bg-gradient-to-r text-base ${
                          payment.status === "Pending"
                            ? "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
                            : "from-gray-400 to-gray-500 text-gray-100 opacity-75 cursor-not-allowed"
                        } rounded-lg shadow-md transition-all duration-200 touch-manipulation`}
                        disabled={payment.status !== "Pending" || processing}
                        aria-label={
                          payment.status === "Pending"
                            ? `Pay now with ${selectedMethod}`
                            : "View payment details"
                        }
                      >
                        {processing
                          ? "Processing..."
                          : payment.status === "Pending"
                          ? `Pay Now with ${
                              selectedMethod === "paystack"
                                ? "Paystack"
                                : selectedMethod.charAt(0).toUpperCase() +
                                  selectedMethod.slice(1)
                            }`
                          : "View Details"}
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12" role="alert" aria-live="polite">
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No transactions found.
            </p>
          </div>
        )}
      </div>

      {/* Displaying payment instructions to users */}
      <section className="mt-10">
        <h2
          className={`text-2xl font-semibold mb-6 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Instructions
        </h2>
        <p
          className={`text-base ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mb-6`}
        >
          Select your preferred payment method below. Review your payment
          details before confirming. For assistance, contact support via the
          button above.
        </p>
      </section>

      {/* Rendering payment method selection interface */}
      <section className="mt-6">
        <h2
          className={`text-2xl font-semibold mb-6 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Payment Method
        </h2>
        <div
          className={`rounded-xl shadow-lg p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <Button
                variant={
                  selectedMethod === "paystack" ? "primary" : "secondary"
                }
                onClick={() => setSelectedMethod("paystack")}
                className={`px-4 py-3 rounded-lg text-base ${
                  selectedMethod === "paystack"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                    : darkMode
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-black text-white hover:bg-gray-800"
                } touch-manipulation`}
                aria-label="Select Credit Card"
                disabled={processing}
              >
                Paystack (Card/Wallet)
              </Button>
              <Button
                variant={selectedMethod === "momo" ? "primary" : "secondary"}
                onClick={() => setSelectedMethod("momo")}
                className={`px-4 py-3 rounded-lg text-base ${
                  selectedMethod === "momo"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                    : darkMode
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-black text-white hover:bg-gray-800"
                } touch-manipulation`}
                aria-label="Select Mobile Money (Momo)"
                disabled={processing}
              >
                Mobile Money (Momo)
              </Button>
              <Button
                variant={selectedMethod === "bank" ? "primary" : "secondary"}
                onClick={() => setSelectedMethod("bank")}
                className={`px-4 py-3 rounded-lg text-base ${
                  selectedMethod === "bank"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
                    : darkMode
                    ? "bg-teal-500 text-white hover:bg-teal-600"
                    : "bg-black text-white hover:bg-gray-800"
                } touch-manipulation`}
                aria-label="Select Bank Transfer"
                disabled={processing}
              >
                Bank Transfer
              </Button>
            </div>
            {selectedMethod === "paystack" && (
              <div className="space-y-4">
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                  </label>
                  <FaUser
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={paystackData.email}
                    onChange={(e) =>
                      setPaystackData({
                        ...paystackData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-opacity-50"
                        : "bg-gray-100 text-gray-900 border-gray-300 placeholder-opacity-50"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Email"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Amount (GHS)
                  </label>
                  <FaDollarSign
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={paystackData.amount}
                    onChange={(e) =>
                      setPaystackData({
                        ...paystackData,
                        amount: e.target.value,
                      })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-opacity-50"
                        : "bg-gray-100 text-gray-900 border-gray-300 placeholder-opacity-50"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Amount"
                  />
                </div>
              </div>
            )}
            {selectedMethod === "momo" && (
              <div className="space-y-4">
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Network
                  </label>
                  <FaNetworkWired
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <select
                    value={momoData.network}
                    onChange={(e) =>
                      setMomoData({ ...momoData, network: e.target.value })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Select network"
                  >
                    <option value="">Select Network</option>
                    <option value="mtn">MTN</option>
                    <option value="vodafone">Vodafone</option>
                    <option value="airteltigo">AirtelTigo</option>
                  </select>
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <FaPhone
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={momoData.number}
                    onChange={(e) =>
                      setMomoData({ ...momoData, number: e.target.value })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Phone number"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Amount (GHS)
                  </label>
                  <FaDollarSign
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={momoData.amount}
                    onChange={(e) =>
                      setMomoData({ ...momoData, amount: e.target.value })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Amount"
                  />
                </div>
              </div>
            )}
            {selectedMethod === "bank" && (
              <div className="space-y-4">
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Account Holder Name
                  </label>
                  <FaUser
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Enter account holder name"
                    value={bankData.accountHolderName}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountHolderName: e.target.value,
                      })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Account holder name"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Bank Name
                  </label>
                  <FaUniversity
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Enter bank name"
                    value={bankData.bankName}
                    onChange={(e) =>
                      setBankData({ ...bankData, bankName: e.target.value })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Bank name"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Account Number
                  </label>
                  <FaHashtag
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={bankData.accountNumber}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        accountNumber: e.target.value,
                      })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Account number"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    IFSC/Swift Code
                  </label>
                  <FaCode
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Enter IFSC or Swift code"
                    value={bankData.ifscSwiftCode}
                    onChange={(e) =>
                      setBankData({
                        ...bankData,
                        ifscSwiftCode: e.target.value,
                      })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="IFSC/Swift code"
                  />
                </div>
                <div className="relative">
                  <label
                    className={`block text-base mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Amount (GHS)
                  </label>
                  <FaDollarSign
                    className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={bankData.amount}
                    onChange={(e) =>
                      setBankData({ ...bankData, amount: e.target.value })
                    }
                    className={`w-full p-3 pr-10 rounded-lg border text-base ${
                      darkMode
                        ? "bg-gray-700 text-gray-100 border-gray-600"
                        : "bg-gray-100 text-gray-900 border-gray-300"
                    } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                    aria-label="Amount"
                  />
                </div>
              </div>
            )}
            <Button
              variant="primary"
              className={`w-full py-3 bg-gradient-to-r text-base ${
                processing
                  ? "from-gray-400 to-gray-500 text-gray-100 opacity-75 cursor-not-allowed"
                  : "from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
              } rounded-lg shadow-md touch-manipulation`}
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) {
                  setError(
                    "You are not logged in. Please log in to process payments."
                  );
                  setErrorType("auth");
                  toast.error("Please log in to process payments.", {
                    position: "top-right",
                    autoClose: 2000,
                  });
                  setTimeout(
                    () => (window.location.href = "/tenantlogin"),
                    2000
                  );
                  return;
                }

                let tenantId = localStorage.getItem("userId");
                if (!tenantId) {
                  await fetchCurrentUser();
                  tenantId = localStorage.getItem("userId");
                  if (!tenantId) {
                    toast.error("Tenant ID not found. Please log in again.", {
                      position: "top-right",
                      autoClose: 2000,
                    });
                    setTimeout(
                      () => (window.location.href = "/tenantlogin"),
                      2000
                    );
                    return;
                  }
                }

                setProcessing(true);
                setError(null);

                const amount = 5000; // Example amount in GHS
                const email = "tenant@example.com"; // Replace with dynamic tenant email
                const paymentId = "rent_payment";

                if (selectedMethod === "paystack") {
                  const { email: paystackEmail, amount: paystackAmount } =
                    paystackData;
                  if (
                    !paystackEmail ||
                    !paystackAmount ||
                    isNaN(paystackAmount) ||
                    paystackAmount <= 0
                  ) {
                    toast.error("Please provide a valid email and amount.", {
                      position: "top-right",
                      autoClose: 2000,
                    });
                    setProcessing(false);
                    return;
                  }
                  await initiatePaystackPayment(
                    paystackAmount,
                    paystackEmail,
                    paymentId,
                    tenantId
                  );
                } else if (selectedMethod === "momo") {
                  setModalOpen("momo");
                } else if (selectedMethod === "bank") {
                  setModalOpen("bank");
                } else {
                  const paymentDetails = {
                    paymentMethod: selectedMethod,
                    amount,
                    email,
                  };
                  try {
                    await tenantApi.processPayment(
                      token,
                      paymentId,
                      paymentDetails
                    );
                    toast.success("Payment successful!", { autoClose: 2000 });
                    await fetchPayments();
                    tenantApi.sendNotification(token, {
                      recipientId: "landlord",
                      message: `Payment of ${amount} GHS received from tenant`,
                    });
                  } catch (err) {
                    setError(
                      err.message === "Invalid or expired token"
                        ? "Your session has expired. Please log in again."
                        : err.message.includes("Network Error")
                        ? "Network issue. Please check your connection and try again."
                        : err.message.includes("Server Error")
                        ? "Server error. Please try again later."
                        : err.message || "Failed to process payment."
                    );
                    setErrorType(
                      err.message === "Invalid or expired token"
                        ? "auth"
                        : err.message.includes("Network Error")
                        ? "network"
                        : err.message.includes("Server Error")
                        ? "server"
                        : "unknown"
                    );
                    toast.error(err.message, {
                      position: "top-right",
                      autoClose: 2000,
                    });

                    if (err.message === "Invalid or expired token") {
                      setTimeout(
                        () => (window.location.href = "/tenantlogin"),
                        2000
                      );
                    }
                  }
                }
                setProcessing(false);
              }}
              disabled={processing}
              aria-label={processing ? "Processing payment" : "Pay Now"}
            >
              {processing ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </section>

      {/* Pay Now Modal for initiating payment */}
      <Modal
        isOpen={modalOpen === "pay"}
        onClose={() => setModalOpen(null)}
        title="Pay Your Rent"
        confirmAction={async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            setError(
              "You are not logged in. Please log in to process payments."
            );
            setErrorType("auth");
            toast.error("Please log in to process payments.", {
              position: "top-right",
              autoClose: 2000,
            });
            setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
            return;
          }

          let tenantId = localStorage.getItem("userId");
          if (!tenantId) {
            await fetchCurrentUser();
            tenantId = localStorage.getItem("userId");
            if (!tenantId) {
              toast.error("Tenant ID not found. Please log in again.", {
                position: "top-right",
                autoClose: 2000,
              });
              setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
              return;
            }
          }

          setProcessing(true);
          setError(null);

          const amount = 5000; // Example amount in GHS
          const email = "tenant@example.com"; // Replace with dynamic tenant email
          const paymentId = "rent_payment";

          if (selectedMethod === "paystack") {
            const { email: paystackEmail, amount: paystackAmount } =
              paystackData;
            if (
              !paystackEmail ||
              !paystackAmount ||
              isNaN(paystackAmount) ||
              paystackAmount <= 0
            ) {
              toast.error("Please provide a valid email and amount.", {
                position: "top-right",
                autoClose: 2000,
              });
              setProcessing(false);
              return;
            }
            await initiatePaystackPayment(
              paystackAmount,
              paystackEmail,
              paymentId,
              tenantId
            );
          } else if (selectedMethod === "momo") {
            setModalOpen("momo");
          } else if (selectedMethod === "bank") {
            setModalOpen("bank");
          } else {
            const paymentDetails = {
              paymentMethod: selectedMethod,
              amount,
              email,
            };
            try {
              await tenantApi.processPayment(token, paymentId, paymentDetails);
              toast.success("Payment successful!", { autoClose: 2000 });
              setModalOpen(null);
              await fetchPayments();
              tenantApi.sendNotification(token, {
                recipientId: "landlord",
                message: `Payment of ${amount} GHS received from tenant`,
              });
            } catch (err) {
              setError(
                err.message === "Invalid or expired token"
                  ? "Your session has expired. Please log in again."
                  : err.message.includes("Network Error")
                  ? "Network issue. Please check your connection and try again."
                  : err.message.includes("Server Error")
                  ? "Server error. Please try again later."
                  : err.message || "Failed to process payment."
              );
              setErrorType(
                err.message === "Invalid or expired token"
                  ? "auth"
                  : err.message.includes("Network Error")
                  ? "network"
                  : err.message.includes("Server Error")
                  ? "server"
                  : "unknown"
              );
              toast.error(err.message, {
                position: "top-right",
                autoClose: 2000,
              });

              if (err.message === "Invalid or expired token") {
                setTimeout(() => (window.location.href = "/tenantlogin"), 2000);
              }
            }
          }
          setProcessing(false);
        }}
        confirmLabel={processing ? "Processing..." : "Confirm Payment"}
      >
        <div>
          <p className="mb-4 text-base">
            Select a payment method to pay your rent.
          </p>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className={`w-full p-3 rounded-lg border text-base ${
              darkMode
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
            } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
            aria-label="Select payment method for rent"
            disabled={processing}
          >
            <option value="paystack">Paystack (Card/Wallet)</option>
            <option value="momo">Mobile Money (Momo)</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
      </Modal>

      {/* Momo Payment Modal for Mobile Money payments */}
      <Modal
        isOpen={modalOpen === "momo"}
        onClose={() => setModalOpen(null)}
        title="Mobile Money Payment"
        confirmAction={initiateMomoPayment}
        confirmLabel={processing ? "Processing..." : "Confirm Payment"}
      >
        <div>
          <p className="mb-4 text-base">Enter your Mobile Money details.</p>
          <div className="relative mb-4">
            <label
              className={`block text-base mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Network
            </label>
            <FaNetworkWired
              className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <select
              value={momoData.network}
              onChange={(e) =>
                setMomoData({ ...momoData, network: e.target.value })
              }
              className={`w-full p-3 pr-10 rounded-lg border text-base ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
              aria-label="Select network"
            >
              <option value="">Select Network</option>
              <option value="mtn">MTN</option>
              <option value="vodafone">Vodafone</option>
              <option value="airteltigo">AirtelTigo</option>
            </select>
          </div>
          <div className="relative mb-4">
            <label
              className={`block text-base mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Phone Number
            </label>
            <FaPhone
              className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="tel"
              placeholder="Enter phone number"
              value={momoData.number}
              onChange={(e) =>
                setMomoData({ ...momoData, number: e.target.value })
              }
              className={`w-full p-3 pr-10 rounded-lg border text-base ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
              aria-label="Phone number"
            />
          </div>
          <div className="relative">
            <label
              className={`block text-base mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Amount (GHS)
            </label>
            <FaDollarSign
              className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="number"
              placeholder="Enter amount"
              value={momoData.amount}
              onChange={(e) =>
                setMomoData({ ...momoData, amount: e.target.value })
              }
              className={`w-full p-3 pr-10 rounded-lg border text-base ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-100 text-gray-900 border-gray-300"
              } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
              aria-label="Amount"
            />
          </div>
        </div>
      </Modal>

      {/* Bank Transfer Modal for bank payment details */}
      <Modal
        isOpen={modalOpen === "bank"}
        onClose={() => setModalOpen(null)}
        title="Bank Transfer"
      >
        <div>
          <p className="mb-4 text-base">Enter your bank transfer details.</p>
          <div className="space-y-4">
            <div className="relative">
              <label
                className={`block text-base mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Account Holder Name
              </label>
              <FaUser
                className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Enter account holder name"
                value={bankData.accountHolderName}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    accountHolderName: e.target.value,
                  })
                }
                className={`w-full p-3 pr-10 rounded-lg border text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                aria-label="Account holder name"
              />
            </div>
            <div className="relative">
              <label
                className={`block text-base mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Bank Name
              </label>
              <FaUniversity
                className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Enter bank name"
                value={bankData.bankName}
                onChange={(e) =>
                  setBankData({ ...bankData, bankName: e.target.value })
                }
                className={`w-full p-3 pr-10 rounded-lg border text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                aria-label="Bank name"
              />
            </div>
            <div className="relative">
              <label
                className={`block text-base mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Account Number
              </label>
              <FaHashtag
                className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Enter account number"
                value={bankData.accountNumber}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    accountNumber: e.target.value,
                  })
                }
                className={`w-full p-3 pr-10 rounded-lg border text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                aria-label="Account number"
              />
            </div>
            <div className="relative">
              <label
                className={`block text-base mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                IFSC/Swift Code
              </label>
              <FaCode
                className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Enter IFSC or Swift code"
                value={bankData.ifscSwiftCode}
                onChange={(e) =>
                  setBankData({
                    ...bankData,
                    ifscSwiftCode: e.target.value,
                  })
                }
                className={`w-full p-3 pr-10 rounded-lg border text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                aria-label="IFSC/Swift code"
              />
            </div>
            <div className="relative">
              <label
                className={`block text-base mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Amount (GHS)
              </label>
              <FaDollarSign
                className={`absolute right-3 top-11 transform -translate-y-1/2 text-base ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="number"
                placeholder="Enter amount"
                value={bankData.amount}
                onChange={(e) =>
                  setBankData({ ...bankData, amount: e.target.value })
                }
                className={`w-full p-3 pr-10 rounded-lg border text-base ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } focus:ring-2 focus:ring-teal-500 touch-manipulation`}
                aria-label="Amount"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
