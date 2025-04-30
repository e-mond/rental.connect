// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

// // Mock exchange rates
// const mockRates = {
//   USD: { EUR: 0.92, GBP: 0.8, JPY: 134.5, GHS: 11.6 },
//   EUR: { USD: 1.09, GBP: 0.87, JPY: 146.2, GHS: 12.5 },
//   GBP: { USD: 1.25, EUR: 1.15, JPY: 168.3, GHS: 14.3 },
//   JPY: { USD: 0.0074, EUR: 0.0068, GBP: 0.0059, GHS: 0.087 },
//   GHS: { USD: 0.086, EUR: 0.08, GBP: 0.07, JPY: 11.5 },
//   NGN: { USD: 0.0013, EUR: 0.0012, GBP: 0.001, GHS: 0.0075 },
//   ZAR: { USD: 0.055, EUR: 0.051, GBP: 0.044, GHS: 0.62 },
//   CAD: { USD: 0.73, EUR: 0.67, GBP: 0.58, GHS: 8.5 },
// };

// const currencyFlags = {
//   USD: "🇺🇸",
//   EUR: "🇪🇺",
//   GBP: "🇬🇧",
//   JPY: "🇯🇵",
//   GHS: "🇬🇭",
//   NGN: "🇳🇬",
//   ZAR: "🇿🇦",
//   CAD: "🇨🇦",
// };

// export default function CurrencyConverter() {
//   const [amount, setAmount] = useState(
//     () => localStorage.getItem("amount") || ""
//   );
//   const [fromCurrency, setFromCurrency] = useState(
//     () => localStorage.getItem("fromCurrency") || "GHS"
//   );
//   const [toCurrency, setToCurrency] = useState(
//     () => localStorage.getItem("toCurrency") || "USD"
//   );
//   const [convertedAmount, setConvertedAmount] = useState(null);
//   const [darkMode, setDarkMode] = useState(
//     () => JSON.parse(localStorage.getItem("darkMode")) || false
//   );
//   const [addFees, setAddFees] = useState(false);
//   const [isConverting, setIsConverting] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("amount", amount);
//     localStorage.setItem("fromCurrency", fromCurrency);
//     localStorage.setItem("toCurrency", toCurrency);
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [amount, fromCurrency, toCurrency, darkMode]);

//   useEffect(() => {
//     if (amount) handleConvert();
//   }, [amount, fromCurrency, toCurrency, addFees]);

//   const handleConvert = () => {
//     if (!amount || isNaN(amount)) return;
//     setIsConverting(true);
//     setTimeout(() => {
//       const rate = mockRates[fromCurrency]?.[toCurrency];
//       if (rate) {
//         let result = amount * rate;
//         if (addFees) {
//           result *= 0.98; // simulate 2% fee
//         }
//         setConvertedAmount(result.toFixed(2));
//       } else {
//         setConvertedAmount("Rate unavailable");
//       }
//       setIsConverting(false);
//     }, 600);
//   };

//   const swapCurrencies = () => {
//     setFromCurrency(toCurrency);
//     setToCurrency(fromCurrency);
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(`${convertedAmount} ${toCurrency}`);
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <motion.div
//       className={`flex justify-center items-center min-h-screen transition-all duration-500 ${
//         darkMode
//           ? "bg-gray-900 text-white"
//           : "bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-800"
//       } p-6`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div
//         className={`w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6 ${
//           darkMode ? "bg-gray-800" : "bg-white"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-extrabold text-indigo-500">
//             Currency Converter
//           </h1>
//           <button onClick={toggleDarkMode} className="text-xl">
//             {darkMode ? "☀️" : "🌙"}
//           </button>
//         </div>

//         {/* Amount Input */}
//         <input
//           type="number"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Enter amount"
//           className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
//         />

//         {/* Currencies Select */}
//         <div className="flex items-center gap-4">
//           <select
//             value={fromCurrency}
//             onChange={(e) => setFromCurrency(e.target.value)}
//             className="w-full p-3 rounded-lg border bg-transparent"
//           >
//             {Object.keys(mockRates).map((currency) => (
//               <option key={currency} value={currency}>
//                 {currencyFlags[currency]} {currency}
//               </option>
//             ))}
//           </select>

//           <motion.button
//             whileTap={{ rotate: 180 }}
//             onClick={swapCurrencies}
//             className="p-2 text-indigo-500 text-2xl"
//           >
//             ⇄
//           </motion.button>

//           <select
//             value={toCurrency}
//             onChange={(e) => setToCurrency(e.target.value)}
//             className="w-full p-3 rounded-lg border bg-transparent"
//           >
//             {Object.keys(mockRates).map((currency) => (
//               <option key={currency} value={currency}>
//                 {currencyFlags[currency]} {currency}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Add Fee Checkbox */}
//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             checked={addFees}
//             onChange={() => setAddFees(!addFees)}
//             id="fee-toggle"
//             className="w-4 h-4"
//           />
//           <label htmlFor="fee-toggle" className="text-sm">
//             Apply 2% Bank Fee
//           </label>
//         </div>

//         {/* Result */}
//         <div className="text-center mt-4">
//           {isConverting ? (
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 1 }}
//               className="text-2xl"
//             >
//               🔄
//             </motion.div>
//           ) : convertedAmount !== null ? (
//             <>
//               <p className="text-xl font-bold">
//                 {amount} {currencyFlags[fromCurrency]} {fromCurrency} ={" "}
//                 {convertedAmount} {currencyFlags[toCurrency]} {toCurrency}
//               </p>
//               <button
//                 onClick={copyToClipboard}
//                 className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm"
//               >
//                 Copy Result
//               </button>
//             </>
//           ) : null}
//         </div>
//       </div>
//     </motion.div>
//   );
// }
