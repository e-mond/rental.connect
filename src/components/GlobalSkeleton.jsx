// import PropTypes from "prop-types";

// /**
//  * GlobalSkeleton Component
//  *
//  * A reusable skeleton loader component that displays a placeholder UI while data is being fetched.
//  * Supports multiple skeleton types for different UI layouts across the application.
//  * Uses a custom pulse animation (`animate-customPulse`) for a smooth loading effect.
//  *
//  * @param {Object} props - Component props
//  * @param {string} props.type - The type of skeleton to display (e.g., "dashboard", "properties", "tenants", "reviews", "maintenance", "messages", "settings", "settings-profile")
//  * @param {string} props.bgColor - Background color of the skeleton (default: "bg-gray-300")
//  * @param {string} props.animationSpeed - Speed of the pulse animation (e.g., "1.5s")
//  */
// const GlobalSkeleton = ({
//   type = "list",
//   bgColor = "bg-gray-300",
//   animationSpeed = "1.5s",
// }) => {
//   // Base style for skeleton placeholders, combining background color and rounded corners
//   const baseStyle = `${bgColor} rounded`;

//   // Skeleton for property details layout
//   if (type === "property-details") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div
//           className={`animate-customPulse ${baseStyle} h-64 w-full rounded-lg`} // Placeholder for property image
//         />
//         <div
//           className={`animate-customPulse ${baseStyle} h-8 w-1/2 rounded`} // Placeholder for property title
//         />
//         <div
//           className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for price
//         />
//         <div className="flex space-x-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for bedrooms
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for bathrooms
//           />
//         </div>
//         <div
//           className={`animate-customPulse ${baseStyle} h-20 w-full rounded`} // Placeholder for description
//         />
//       </div>
//     );
//   }

//   // Skeleton for dashboard layout (e.g., LandlordDashboardHome)
//   if (type === "dashboard") {
//     return (
//       <div
//         className="space-y-6 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[...Array(3)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-32 w-full rounded-lg`} // Placeholder for dashboard cards
//             />
//           ))}
//         </div>
//         <div
//           className={`animate-customPulse ${baseStyle} h-64 w-full rounded-lg`} // Placeholder for chart or table
//         />
//       </div>
//     );
//   }

//   // Skeleton for properties list layout (e.g., Properties component)
//   if (type === "properties") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div className="flex justify-between items-center">
//           <div
//             className={`animate-customPulse ${baseStyle} h-8 w-1/4 rounded`} // Placeholder for "Properties" title
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-32 rounded-md`} // Placeholder for "Add Property" button
//           />
//         </div>
//         <div
//           className={`animate-customPulse ${baseStyle} h-10 w-full rounded`} // Placeholder for search bar
//         />
//         <div className="flex space-x-4">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-6 w-24 rounded`} // Placeholder for filter tabs
//             />
//           ))}
//         </div>
//         <div className="space-y-3">
//           {[...Array(3)].map((_, index) => (
//             <div
//               key={index}
//               className="flex justify-between items-center p-3 border-b"
//             >
//               <div className="flex items-center space-x-3">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-12 w-12 rounded-full`} // Placeholder for property image
//                 />
//                 <div className="space-y-2">
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-4 w-40 rounded`} // Placeholder for property title
//                   />
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-3 w-60 rounded`} // Placeholder for description
//                   />
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-5 w-5 rounded`} // Placeholder for edit icon
//                 />
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-5 w-5 rounded`} // Placeholder for delete icon
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for tenants list layout (e.g., Tenants component)
//   if (type === "tenants") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {/* Header Skeleton: Mimics the title */}
//         <div
//           className={`animate-customPulse ${baseStyle} h-8 w-1/4 rounded mb-4`} // Matches the h2 (text-xl sm:text-2xl)
//         />

//         {/* Search Bar Skeleton: Mimics the search input */}
//         <div className="mb-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-full rounded`} // Matches the input field (px-4 py-2)
//           />
//         </div>

//         {/* Tenant List Skeleton: Mimics the tenant cards (2 columns on larger screens) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className="bg-white p-4 sm:p-6 rounded-lg shadow flex flex-col items-start"
//             >
//               <div
//                 className={`animate-customPulse ${baseStyle} h-8 sm:h-10 w-8 sm:w-10 rounded-full mb-2`} // Matches the User icon
//               />
//               <div
//                 className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-3/4 rounded mb-1`} // Matches the tenant name (text-base sm:text-lg)
//               />
//               <div
//                 className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-1/2 rounded`} // Matches the status (text-sm sm:text-base)
//               />
//             </div>
//           ))}
//         </div>

//         {/* Tabs Skeleton: Mimics the 4 tabs (Overview, Payments, Documents, History) */}
//         <div className="flex space-x-4 sm:space-x-6 border-b pb-2 mb-4">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-20 rounded`} // Matches the tab width and height (text-sm sm:text-base)
//             />
//           ))}
//         </div>

//         {/* Tab Content Skeleton: Mimics the Overview tab content */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           {[...Array(4)].map((_, index) => (
//             <div key={index} className="flex items-center space-x-4 mb-4">
//               <div
//                 className={`animate-customPulse ${baseStyle} h-5 sm:h-6 w-5 sm:w-6 rounded`} // Matches the icons (Calendar, CreditCard, etc.)
//               />
//               <div className="flex-1">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/4 rounded mb-1`} // Matches the heading (text-sm sm:text-base)
//                 />
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-3/4 rounded`} // Matches the content (text-xs sm:text-sm)
//                 />
//               </div>
//             </div>
//           ))}
//           {/* Buttons Skeleton: Mimics the action buttons */}
//           <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
//             {[...Array(4)].map((_, index) => (
//               <div
//                 key={index}
//                 className={`animate-customPulse ${baseStyle} h-10 w-32 sm:w-36 rounded`} // Matches the buttons (px-4 py-2)
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for reviews list layout (e.g., Reviews component)
//   if (type === "reviews") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {/* Header Skeleton: Mimics the title and "Export Reviews" button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
//           <div
//             className={`animate-customPulse ${baseStyle} h-8 w-1/4 rounded`} // Matches the h2 (text-xl sm:text-2xl)
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-full sm:w-32 rounded-md`} // Matches the button size (px-4 py-2)
//           />
//         </div>

//         {/* Search Bar Skeleton: Mimics the search input with icon */}
//         <div className="relative mb-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 rounded`} // Matches the Search icon
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-12 w-full rounded-md`} // Matches the input field (p-3 pl-10)
//           />
//         </div>

//         {/* Filter Tabs Skeleton: Mimics the 4 filter tabs (All Reviews, Recent, Positive, Negative) */}
//         <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-8 sm:h-10 w-24 sm:w-28 rounded-md`} // Matches the tab size (px-3 sm:px-4 py-1 sm:py-2)
//             />
//           ))}
//         </div>

//         {/* Review List Skeleton: Mimics the review list with 3 placeholder entries */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
//           {[...Array(3)].map((_, index) => (
//             <div
//               key={index}
//               className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b last:border-0"
//             >
//               <div className="flex items-center space-x-4">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-10 w-10 rounded-full`} // Matches the property image
//                 />
//                 <div className="flex-1">
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/3 rounded mb-1`} // Matches the property name (text-base sm:text-lg)
//                   />
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-3/4 rounded`} // Matches the review text (text-sm sm:text-base)
//                   />
//                 </div>
//               </div>
//               <div className="flex space-x-3 mt-2 sm:mt-0">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-5 w-5 rounded-full`} // Matches the RefreshCcw icon
//                 />
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-5 w-5 rounded-full`} // Matches the MoreVertical icon
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for maintenance requests list layout (e.g., Maintenance component)
//   if (type === "maintenance") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {/* Header Skeleton: Mimics the title and "Schedule Maintenance" button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
//           <div
//             className={`animate-customPulse ${baseStyle} h-8 w-1/3 rounded`} // Matches the h2 (text-xl sm:text-2xl)
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-full sm:w-40 rounded-lg`} // Matches the button size (px-4 py-2)
//           />
//         </div>

//         {/* Search Bar Skeleton: Mimics the search input with icon */}
//         <div className="relative mb-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 rounded`} // Matches the Search icon
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-full rounded-lg`} // Matches the input field (px-4 py-2)
//           />
//         </div>

//         {/* Filter Tabs Skeleton: Mimics the 4 filter tabs (All Requests, Open, In Progress, Completed) */}
//         <div className="flex gap-2 border-b pb-2 mb-4">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-8 w-24 sm:w-28 rounded`} // Matches the tab size (px-3 py-1)
//             />
//           ))}
//         </div>

//         {/* Maintenance Requests Skeleton: Mimics the request list with 4 placeholder entries */}
//         <div className="space-y-2">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg shadow-sm"
//             >
//               <div className="flex items-start sm:items-center gap-3 sm:gap-4">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-8 w-8 rounded`} // Matches the request icon (text-2xl sm:text-3xl)
//                 />
//                 <div className="flex-1">
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/2 rounded mb-1`} // Matches the request type and address (text-sm sm:text-base)
//                   />
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-3/4 rounded mb-1`} // Matches the details (text-xs sm:text-sm)
//                   />
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-1/3 rounded`} // Matches the scheduled date (text-xs sm:text-sm)
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 mt-2 sm:mt-0">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-4 sm:w-5 rounded`} // Matches the status icon (AlertTriangle, Clock, CheckCircle)
//                 />
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-6 sm:h-7 w-16 sm:w-20 rounded`} // Matches the "Select ▼" button (px-2 py-1)
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for messages list layout (e.g., Messages component)
//   if (type === "messages") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {/* Header Skeleton: Mimics the title and "New Message" button */}
//         <div className="flex justify-between items-center mb-6">
//           <div
//             className={`animate-customPulse ${baseStyle} h-8 w-1/4 rounded`} // Matches the h2 (text-2xl)
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-32 rounded-lg`} // Matches the button size (px-4 py-2)
//           />
//         </div>

//         {/* Search Bar Skeleton: Mimics the search input with icon */}
//         <div className="relative mb-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-5 w-5 absolute left-3 top-3 rounded`} // Matches the Search icon
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-full rounded-md`} // Matches the input field (p-2 pl-10)
//           />
//         </div>

//         {/* Filter Tabs Skeleton: Mimics the 3 filter tabs (All Messages, Unread, Archived) */}
//         <div className="flex flex-wrap gap-4 mb-4">
//           {[...Array(3)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-7 w-24 rounded`} // Matches the tab size (px-3 py-1)
//             />
//           ))}
//         </div>

//         {/* Messages List Skeleton: Mimics the messages list with 4 placeholder entries */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b last:border-0"
//             >
//               <div className="flex items-start sm:items-center space-x-4">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-10 w-10 rounded-full`} // Matches the avatar image
//                 />
//                 <div className="flex-1">
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/3 rounded mb-1`} // Matches the name (font-semibold)
//                   />
//                   <div
//                     className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-3/4 rounded`} // Matches the subject (text-xs sm:text-sm)
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3 mt-2 sm:mt-0">
//                 {[...Array(4)].map((_, btnIndex) => (
//                   <div
//                     key={btnIndex}
//                     className={`animate-customPulse ${baseStyle} h-5 w-5 rounded-full`} // Matches the action icons (Clock, Check, Bell, MoreVertical)
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for settings list layout (e.g., Settings component)
//   if (type === "settings") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {/* Breadcrumb Skeleton: Mimics the breadcrumb navigation */}
//         <div className="mb-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Matches the breadcrumb text (text-sm sm:text-base)
//           />
//         </div>

//         {/* Header Skeleton: Mimics the title */}
//         <div className="mb-6">
//           <div
//             className={`animate-customPulse ${baseStyle} h-8 w-1/4 rounded`} // Matches the h1 (text-xl sm:text-2xl)
//           />
//         </div>

//         {/* Tabs Skeleton: Mimics the 4 tabs (Account, Notifications, Security, Billing) */}
//         <div className="flex space-x-4 border-b mb-6">
//           {[...Array(4)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-8 w-20 sm:w-24 rounded`} // Matches the tab size (px-3 sm:px-4 py-2)
//             />
//           ))}
//         </div>

//         {/* Settings List Skeleton: Mimics the settings list with 2 placeholder entries */}
//         <div className="space-y-4">
//           {[...Array(2)].map((_, index) => (
//             <div
//               key={index}
//               className="flex items-center p-4 bg-white shadow rounded-lg"
//             >
//               <div
//                 className={`animate-customPulse ${baseStyle} h-6 sm:h-8 w-6 sm:w-8 rounded mr-3 sm:mr-4`} // Matches the icon (text-xl sm:text-2xl)
//               />
//               <div className="flex-1">
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/3 rounded mb-1`} // Matches the title (text-sm sm:text-base)
//                 />
//                 <div
//                   className={`animate-customPulse ${baseStyle} h-3 sm:h-4 w-3/4 rounded`} // Matches the description (text-xs sm:text-sm)
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for settings profile section (e.g., Profile section in Settings component)
//   if (type === "settings-profile") {
//     return (
//       <div
//         className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div className="flex items-center space-x-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-16 w-16 sm:h-20 sm:w-20 rounded-full`} // Matches the avatar image
//           />
//           <div className="flex-1">
//             <div
//               className={`animate-customPulse ${baseStyle} h-5 sm:h-6 w-1/3 rounded mb-2`} // Matches the name (text-lg sm:text-xl)
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 sm:h-5 w-1/2 rounded mb-3`} // Matches the email (text-sm sm:text-base)
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-8 sm:h-10 w-24 sm:w-32 rounded`} // Matches the "Edit Profile" button (px-3 sm:px-4 py-1 sm:py-2)
//             />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for a generic list layout
//   if (type === "list") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(5)].map((_, index) => (
//           <div
//             key={index}
//             className={`animate-customPulse ${baseStyle} h-12 w-full rounded`} // Placeholder for list items
//           />
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for a form layout
//   if (type === "form") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(4)].map((_, index) => (
//           <div key={index} className="space-y-2">
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for form labels
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-10 w-full rounded`} // Placeholder for form inputs
//             />
//           </div>
//         ))}
//         <div
//           className={`animate-customPulse ${baseStyle} h-10 w-32 rounded`} // Placeholder for form submit button
//         />
//       </div>
//     );
//   }

//   // Skeleton for a cards layout
//   if (type === "cards") {
//     return (
//       <div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(3)].map((_, index) => (
//           <div
//             key={index}
//             className={`animate-customPulse ${baseStyle} h-48 w-full rounded-lg`} // Placeholder for cards
//           />
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for settings notifications layout
//   if (type === "settings-notifications") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(3)].map((_, index) => (
//           <div key={index} className="flex items-center space-x-4">
//             <div
//               className={`animate-customPulse ${baseStyle} h-5 w-5 rounded`} // Placeholder for checkbox
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/2 rounded`} // Placeholder for notification label
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for profile header layout
//   if (type === "profile-header") {
//     return (
//       <div
//         className="flex items-center space-x-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div
//           className={`animate-customPulse ${baseStyle} h-16 w-16 rounded-full`} // Placeholder for profile picture
//         />
//         <div className="space-y-2">
//           <div
//             className={`animate-customPulse ${baseStyle} h-6 w-40 rounded`} // Placeholder for name
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-4 w-20 rounded`} // Placeholder for account type
//           />
//         </div>
//       </div>
//     );
//   }

//   // Skeleton for profile info layout
//   if (type === "profile-info") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(3)].map((_, index) => (
//           <div key={index} className="space-y-2">
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for label
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/2 rounded`} // Placeholder for info
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for profile settings layout
//   if (type === "profile-settings") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(4)].map((_, index) => (
//           <div key={index} className="space-y-2">
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for label
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-10 w-full rounded`} // Placeholder for input
//             />
//           </div>
//         ))}
//         <div
//           className={`animate-customPulse ${baseStyle} h-10 w-32 rounded`} // Placeholder for save button
//         />
//       </div>
//     );
//   }

//   // Skeleton for profile activity layout
//   if (type === "profile-activity") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(5)].map((_, index) => (
//           <div key={index} className="flex items-center space-x-4">
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/2 rounded`} // Placeholder for activity text
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for timestamp
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for payments layout
//   if (type === "payments") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(5)].map((_, index) => (
//           <div key={index} className="flex justify-between items-center">
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/3 rounded`} // Placeholder for payment description
//             />
//             <div
//               className={`animate-customPulse ${baseStyle} h-4 w-1/4 rounded`} // Placeholder for amount
//             />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for quick actions layout
//   if (type === "quick-actions") {
//     return (
//       <div
//         className="grid grid-cols-2 gap-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         {[...Array(4)].map((_, index) => (
//           <div
//             key={index}
//             className={`animate-customPulse ${baseStyle} h-20 w-full rounded-lg`} // Placeholder for action buttons 
//           />
//         ))}
//       </div>
//     );
//   }

//   // Skeleton for sidebar profile layout
//   if (type === "sidebar-profile") {
//     return (
//       <div
//         className="space-y-4 overflow-hidden"
//         aria-hidden="true"
//         style={{ "--animation-speed": animationSpeed }}
//       >
//         <div className="flex items-center space-x-4">
//           <div
//             className={`animate-customPulse ${baseStyle} h-10 w-10 rounded-full`}// Placeholder for profile picture
//           />
//           <div
//             className={`animate-customPulse ${baseStyle} h-4 w-1/2 rounded`} // Placeholder for name
//           />
//         </div>
//         <div className="space-y-2">
//           {[...Array(5)].map((_, index) => (
//             <div
//               key={index}
//               className={`animate-customPulse ${baseStyle} h-4 w-full rounded`} // Placeholder for sidebar links
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Define PropTypes for type safety and validation
//   GlobalSkeleton.propTypes = {
//     type: PropTypes.oneOf([
//       "property-details",
//       "dashboard",
//       "properties",
//       "tenants",
//       "reviews",
//       "maintenance",
//       "messages",
//       "settings",
//       "settings-profile", 
//       "list",
//       "form",
//       "cards",
//       "settings-notifications",
//       "profile-header",
//       "profile-info",
//       "profile-settings",
//       "profile-activity",
//       "payments",
//       "quick-actions",
//       "sidebar-profile",
//     ]),
//     bgColor: PropTypes.string,
//     animationSpeed: PropTypes.string,
//   };

//   return null;
// };

// export default GlobalSkeleton;

import PropTypes from "prop-types";

const GlobalSkeleton = ({
  type,
  bgColor = "bg-gray-300",
  animationSpeed = "1.5s",
}) => {
  const skeletonStyles = {
    backgroundColor: bgColor,
    animation: `pulse ${animationSpeed} ease-in-out infinite`,
  };

  const renderSkeleton = () => {
    switch (type) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <div
              className="h-32 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
            <div className="h-16 w-3/4 rounded-lg" style={skeletonStyles}></div>
          </div>
        );
      case "properties":
        return (
          <div className="space-y-4">
            <div
              className="h-20 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
            <div
              className="h-20 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
          </div>
        );
      case "tenants":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="h-24 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
            <div
              className="h-24 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
          </div>
        );
      case "reviews":
        return (
          <div className="space-y-4">
            <div
              className="h-16 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
            <div
              className="h-16 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
          </div>
        );
      case "maintenance":
        return (
          <div className="space-y-4">
            <div
              className="h-20 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
            <div
              className="h-20 w-full rounded-lg"
              style={skeletonStyles}
            ></div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-4">
            <div
              className="h-24 w-24 rounded-full mx-auto"
              style={skeletonStyles}
            ></div>
            <div
              className="h-10 w-3/4 rounded-lg mx-auto"
              style={skeletonStyles}
            ></div>
          </div>
        );
      default:
        return (
          <div className="h-24 w-full rounded-lg" style={skeletonStyles}></div>
        );
    }
  };

  return <div className="p-4">{renderSkeleton()}</div>;
};

GlobalSkeleton.propTypes = {
  type: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  animationSpeed: PropTypes.string,
};

export default GlobalSkeleton;