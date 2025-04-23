// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import {
//   MoonIcon,
//   SunIcon,
//   BellIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/outline";
// import { useUser } from "../context/UserContextObject";
// import { useDarkMode } from "../hooks/useDarkMode";
// import { DEFAULT_PROFILE_PIC, DASHBOARD_BASE_URL } from "../config";
// import Button from "../components/Button";

// const Navbar = () => {
//   const { user, logout } = useUser();
//   const { darkMode, setDarkMode } = useDarkMode();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Mock notification count (replace with API call if needed)
//   const notificationCount = 0; // Static for now; re-add useQuery if backend supports

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//     if (
//       mobileMenuRef.current &&
//       !mobileMenuRef.current.contains(event.target)
//     ) {
//       setMobileMenuOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleNavigation = (path) => {
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     logout(); // Clears token and user state
//     setMobileMenuOpen(false);
//     setDropdownOpen(false);
//     navigate("/tenantlogin", { replace: true }); // Redirect to login
//   };

//   const handleNotificationClick = () => {
//     navigate(`${DASHBOARD_BASE_URL}/notifications`);
//     setMobileMenuOpen(false);
//   };

//   const shouldShowLogout =
//     location.pathname.startsWith("/dashboard") ||
//     location.pathname.startsWith("/account-success/tenant") ||
//     location.pathname.startsWith("/account-success/landlord") ||
//     location.pathname.startsWith("/dashboard/tenant/dashboard") ||
//     location.pathname.startsWith("/dashboard/landlord/dashboard");

//   const logoDestination =
//     user && shouldShowLogout
//       ? user.role?.toLowerCase() === "landlord"
//         ? "/dashboard/landlord"
//         : user.role?.toLowerCase() === "tenant"
//         ? "/dashboard/tenant"
//         : "/"
//       : "/";

//   return (
//     <nav
//       className={`py-4 shadow-md w-full relative z-50 ${
//         darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"
//       }`}
//     >
//       <div className="max-w-[90%] mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link
//           to={logoDestination}
//           className={`font-bold italic md:text-2xl text-lg`}
//         >
//           RentalConnect
//         </Link>

//         {/* Navigation Links and Buttons */}
//         {user && shouldShowLogout ? (
//           <>
//             {/* Desktop View (md and above) */}
//             <div className="hidden md:flex items-center space-x-4">
//               <button
//                 onClick={handleNotificationClick}
//                 className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label="View notifications"
//               >
//                 <BellIcon
//                   className={`w-6 h-6 ${
//                     darkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 />
//                 {notificationCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {notificationCount}
//                   </span>
//                 )}
//               </button>

//               <img
//                 src={user.profilePic || DEFAULT_PROFILE_PIC}
//                 alt="Profile"
//                 className={`w-8 h-8 rounded-full cursor-pointer border-2 p-0.5 ${
//                   darkMode
//                     ? "border-gray-600 bg-gray-700"
//                     : "border-gray-300 bg-gray-100"
//                 }`}
//                 onClick={() =>
//                   navigate(
//                     user.role?.toLowerCase() === "landlord"
//                       ? "/dashboard/landlord/profile"
//                       : "/dashboard/tenant/profile"
//                   )
//                 }
//               />
//               <span className="text-sm hidden sm:block">{user.name}</span>
//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="px-5 py-2"
//               >
//                 Logout
//               </Button>
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>
//             </div>

//             {/* Mobile View (below md) */}
//             <div className="md:hidden flex items-center space-x-1">
//               <button
//                 onClick={handleNotificationClick}
//                 className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label="View notifications"
//               >
//                 <BellIcon
//                   className={`w-6 h-6 ${
//                     darkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 />
//                 {notificationCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {notificationCount}
//                   </span>
//                 )}
//               </button>

//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>

//               {/* Hamburger Menu */}
//               <div className="relative" ref={mobileMenuRef}>
//                 <button
//                   onClick={() => setMobileMenuOpen((prev) => !prev)}
//                   className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                     darkMode
//                       ? "bg-gray-700 border border-gray-600"
//                       : "bg-gray-100 border border-gray-300"
//                   }`}
//                   aria-label="Toggle menu"
//                   aria-expanded={mobileMenuOpen ? "true" : "false"}
//                 >
//                   <Bars3Icon
//                     className={`w-6 h-6 ${
//                       darkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   />
//                 </button>

//                 {mobileMenuOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <div className="px-4 py-2 flex items-center space-x-2 border-b border-gray-600">
//                       <img
//                         src={user.profilePic || DEFAULT_PROFILE_PIC}
//                         alt="Profile"
//                         className={`w-6 h-6 rounded-full border-2 p-0.5 ${
//                           darkMode
//                             ? "border-gray-600 bg-gray-700"
//                             : "border-gray-300 bg-gray-100"
//                         }`}
//                         onClick={() =>
//                           navigate(
//                             user.role?.toLowerCase() === "landlord"
//                               ? "/dashboard/landlord/profile"
//                               : "/dashboard/tenant/profile"
//                           )
//                         }
//                       />
//                       <span className="text-sm">{user.name}</span>
//                     </div>
//                     <button
//                       onClick={() =>
//                         handleNavigation(
//                           user.role?.toLowerCase() === "landlord"
//                             ? "/dashboard/landlord/profile"
//                             : "/dashboard/tenant/profile"
//                         )
//                       }
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Profile
//                     </button>
//                     <Button
//                       variant="danger"
//                       onClick={handleLogout}
//                       className="block px-4 py-2 w-full text-left"
//                     >
//                       Logout
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Desktop View (md and above) */}
//             <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
//               <ul className="flex space-x-8">
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     Home
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/about")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     About Us
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/contact")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     Contact Us
//                   </button>
//                 </li>
//               </ul>
//             </div>

//             <div className="hidden md:flex items-center space-x-4">
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   className={
//                     darkMode
//                       ? "hover:text-gray-400 relative z-10"
//                       : "hover:text-gray-600 relative z-10"
//                   }
//                   aria-haspopup="true"
//                   aria-expanded={dropdownOpen ? "true" : "false"}
//                   onClick={() => setDropdownOpen((prev) => !prev)}
//                 >
//                   Login ⌵
//                 </button>
//                 {dropdownOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <button
//                       onClick={() => handleNavigation("/tenantlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Tenant Login
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/landlordlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Landlord Login
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <Button
//                 variant="primary"
//                 onClick={() => handleNavigation("/signup")}
//                 className="px-5 py-2"
//                 as={Link}
//                 to="/signup"
//               >
//                 Sign Up
//               </Button>
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>
//             </div>

//             {/* Mobile View (below md) */}
//             <div className="md:hidden flex items-center space-x-1">
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>

//               {/* Hamburger Menu */}
//               <div className="relative" ref={mobileMenuRef}>
//                 <button
//                   onClick={() => setMobileMenuOpen((prev) => !prev)}
//                   className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                     darkMode
//                       ? "bg-gray-700 border border-gray-600"
//                       : "bg-gray-100 border border-gray-300"
//                   }`}
//                   aria-label="Toggle menu"
//                   aria-expanded={mobileMenuOpen ? "true" : "false"}
//                 >
//                   <Bars3Icon
//                     className={`w-6 h-6 ${
//                       darkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   />
//                 </button>

//                 {mobileMenuOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <button
//                       onClick={() => handleNavigation("/")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Home
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/about")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       About Us
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/contact")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Contact Us
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/tenantlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Tenant Login
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/landlordlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Landlord Login
//                     </button>
//                     <Button
//                       variant="primary"
//                       onClick={() => handleNavigation("/signup")}
//                       className="block px-4 py-2 w-full text-left"
//                       as={Link}
//                       to="/signup"
//                       role="menuitem"
//                     >
//                       Sign Up
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { DEFAULT_PROFILE_PIC, DASHBOARD_BASE_URL } from "../config";
import Button from "../components/Button";

const Navbar = () => {
  const { user, logout } = useUser();
  const { darkMode, setDarkMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock notification count (replace with API call if needed)
  const notificationCount = 0; // Static for now; re-add useQuery if backend supports

  // Debug logging
  useEffect(() => {
    console.log("Navbar user state:", { user, pathname: location.pathname });
  }, [user, location.pathname]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target)
    ) {
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout(); // Clears token and user state
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate("/tenantlogin", { replace: true }); // Redirect to login
  };

  const handleNotificationClick = () => {
    navigate(`${DASHBOARD_BASE_URL}/notifications`);
    setMobileMenuOpen(false);
  };

  const shouldShowLogout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/account-success/tenant") ||
    location.pathname.startsWith("/account-success/landlord") ||
    location.pathname.startsWith("/dashboard/tenant/dashboard") ||
    location.pathname.startsWith("/dashboard/landlord/dashboard");

  const logoDestination =
    user && shouldShowLogout
      ? user.role?.toLowerCase() === "landlord"
        ? "/dashboard/landlord"
        : user.role?.toLowerCase() === "tenant"
        ? "/dashboard/tenant"
        : "/"
      : "/";

  return (
    <nav
      className={`py-4 shadow-md w-full relative z-50 ${
        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"
      }`}
    >
      <div className="max-w-[90%] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to={logoDestination}
          className={`font-bold italic md:text-2xl text-lg`}
        >
          RentalConnect
        </Link>

        {/* Navigation Links and Buttons */}
        {user && shouldShowLogout ? (
          <>
            {/* Desktop View (md and above) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleNotificationClick}
                className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label="View notifications"
              >
                <BellIcon
                  className={`w-6 h-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              <img
                src={user.profilePic || DEFAULT_PROFILE_PIC}
                alt="Profile"
                className={`w-8 h-8 rounded-full cursor-pointer border-2 p-0.5 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700"
                    : "border-gray-300 bg-gray-100"
                }`}
                onClick={() =>
                  navigate(
                    user.role?.toLowerCase() === "landlord"
                      ? "/dashboard/landlord/profile"
                      : "/dashboard/tenant/profile"
                  )
                }
              />
              <span className="text-sm hidden sm:block">{user.name}</span>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="px-5 py-2"
              >
                Logout
              </Button>
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <SunIcon className="w-6 h-6 text-gray-300" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile View (below md) */}
            <div className="md:hidden flex items-center space-x-1">
              <button
                onClick={handleNotificationClick}
                className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label="View notifications"
              >
                <BellIcon
                  className={`w-6 h-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <SunIcon className="w-6 h-6 text-gray-300" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Hamburger Menu */}
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border border-gray-600"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen ? "true" : "false"}
                >
                  <Bars3Icon
                    className={`w-6 h-6 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                </button>

                {mobileMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-black border-gray-300"
                    }`}
                    role="menu"
                  >
                    <div className="px-4 py-2 flex items-center space-x-2 border-b border-gray-600">
                      <img
                        src={user.profilePic || DEFAULT_PROFILE_PIC}
                        alt="Profile"
                        className={`w-6 h-6 rounded-full border-2 p-0.5 ${
                          darkMode
                            ? "border-gray-600 bg-gray-700"
                            : "border-gray-300 bg-gray-100"
                        }`}
                        onClick={() =>
                          navigate(
                            user.role?.toLowerCase() === "landlord"
                              ? "/dashboard/landlord/profile"
                              : "/dashboard/tenant/profile"
                          )
                        }
                      />
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <button
                      onClick={() =>
                        handleNavigation(
                          user.role?.toLowerCase() === "landlord"
                            ? "/dashboard/landlord/profile"
                            : "/dashboard/tenant/profile"
                        )
                      }
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Profile
                    </button>
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      className="block px-4 py-2 w-full text-left"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop View (md and above) */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
              <ul className="flex space-x-8">
                <li>
                  <button
                    onClick={() => handleNavigation("/")}
                    className={
                      darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
                    }
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/about")}
                    className={
                      darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
                    }
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("/contact")}
                    className={
                      darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
                    }
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  className={
                    darkMode
                      ? "hover:text-gray-400 relative z-10"
                      : "hover:text-gray-600 relative z-10"
                  }
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen ? "true" : "false"}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  Login ⌵
                </button>
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-black border-gray-300"
                    }`}
                    role="menu"
                  >
                    <button
                      onClick={() => handleNavigation("/tenantlogin")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Tenant Login
                    </button>
                    <button
                      onClick={() => handleNavigation("/landlordlogin")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Landlord Login
                    </button>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                onClick={() => handleNavigation("/signup")}
                className="px-5 py-2"
                as={Link}
                to="/signup"
              >
                Sign Up
              </Button>
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <SunIcon className="w-6 h-6 text-gray-300" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Mobile View (below md) */}
            <div className="md:hidden flex items-center space-x-1">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600"
                    : "bg-gray-100 border border-gray-300"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <SunIcon className="w-6 h-6 text-gray-300" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Hamburger Menu */}
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border border-gray-600"
                      : "bg-gray-100 border border-gray-300"
                  }`}
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen ? "true" : "false"}
                >
                  <Bars3Icon
                    className={`w-6 h-6 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  />
                </button>

                {mobileMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-black border-gray-300"
                    }`}
                    role="menu"
                  >
                    <button
                      onClick={() => handleNavigation("/")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => handleNavigation("/about")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      About Us
                    </button>
                    <button
                      onClick={() => handleNavigation("/contact")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Contact Us
                    </button>
                    <button
                      onClick={() => handleNavigation("/tenantlogin")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Tenant Login
                    </button>
                    <button
                      onClick={() => handleNavigation("/landlordlogin")}
                      className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      Landlord Login
                    </button>
                    <Button
                      variant="primary"
                      onClick={() => handleNavigation("/signup")}
                      className="block px-4 py-2 w-full text-left"
                      as={Link}
                      to="/signup"
                      role="menuitem"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import {
//   MoonIcon,
//   SunIcon,
//   BellIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/outline";
// import { useUser } from "../context/UserContext";
// import { useDarkMode } from "../context/DarkModeUtils"; // Updated import
// import { DEFAULT_PROFILE_PIC, DASHBOARD_BASE_URL } from "../config";
// import Button from "../components/Button";

// const Navbar = () => {
//   const { user, logout } = useUser();
//   const { darkMode, setDarkMode } = useDarkMode();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Mock notification count (replace with API call if needed)
//   const notificationCount = 0; // Static for now; re-add useQuery if backend supports

//   // Debug logging
//   useEffect(() => {
//     console.log("Navbar user state:", { user, pathname: location.pathname });
//   }, [user, location.pathname]);

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setDropdownOpen(false);
//     }
//     if (
//       mobileMenuRef.current &&
//       !mobileMenuRef.current.contains(event.target)
//     ) {
//       setMobileMenuOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleNavigation = (path) => {
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//     navigate(path);
//   };

//   const handleLogout = () => {
//     logout(); // Clears token and user state
//     setMobileMenuOpen(false);
//     setDropdownOpen(false);
//     navigate("/tenantlogin", { replace: true }); // Redirect to login
//   };

//   const handleNotificationClick = () => {
//     navigate(`${DASHBOARD_BASE_URL}/notifications`);
//     setMobileMenuOpen(false);
//   };

//   const shouldShowLogout =
//     location.pathname.startsWith("/dashboard") ||
//     location.pathname.startsWith("/account-success/tenant") ||
//     location.pathname.startsWith("/account-success/landlord") ||
//     location.pathname.startsWith("/dashboard/tenant/dashboard") ||
//     location.pathname.startsWith("/dashboard/landlord/dashboard");

//   const logoDestination =
//     user && shouldShowLogout
//       ? user.role?.toLowerCase() === "landlord"
//         ? "/dashboard/landlord"
//         : user.role?.toLowerCase() === "tenant"
//         ? "/dashboard/tenant"
//         : "/"
//       : "/";

//   return (
//     <nav
//       className={`py-4 shadow-md w-full relative z-50 ${
//         darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"
//       }`}
//     >
//       <div className="max-w-[90%] mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <Link
//           to={logoDestination}
//           className={`font-bold italic md:text-2xl text-lg`}
//         >
//           RentalConnect
//         </Link>

//         {/* Navigation Links and Buttons */}
//         {user && shouldShowLogout ? (
//           <>
//             {/* Desktop View (md and above) */}
//             <div className="hidden md:flex items-center space-x-4">
//               <button
//                 onClick={handleNotificationClick}
//                 className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label="View notifications"
//               >
//                 <BellIcon
//                   className={`w-6 h-6 ${
//                     darkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 />
//                 {notificationCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {notificationCount}
//                   </span>
//                 )}
//               </button>

//               <img
//                 src={user.profilePic || DEFAULT_PROFILE_PIC}
//                 alt="Profile"
//                 className={`w-8 h-8 rounded-full cursor-pointer border-2 p-0.5 ${
//                   darkMode
//                     ? "border-gray-600 bg-gray-700"
//                     : "border-gray-300 bg-gray-100"
//                 }`}
//                 onClick={() =>
//                   navigate(
//                     user.role?.toLowerCase() === "landlord"
//                       ? "/dashboard/landlord/profile"
//                       : "/dashboard/tenant/profile"
//                   )
//                 }
//               />
//               <span className="text-sm hidden sm:block">{user.name}</span>
//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="px-5 py-2"
//               >
//                 Logout
//               </Button>
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>
//             </div>

//             {/* Mobile View (below md) */}
//             <div className="md:hidden flex items-center space-x-1">
//               <button
//                 onClick={handleNotificationClick}
//                 className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label="View notifications"
//               >
//                 <BellIcon
//                   className={`w-6 h-6 ${
//                     darkMode ? "text-gray-300" : "text-gray-600"
//                   }`}
//                 />
//                 {notificationCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {notificationCount}
//                   </span>
//                 )}
//               </button>

//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>

//               {/* Hamburger Menu */}
//               <div className="relative" ref={mobileMenuRef}>
//                 <button
//                   onClick={() => setMobileMenuOpen((prev) => !prev)}
//                   className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                     darkMode
//                       ? "bg-gray-700 border border-gray-600"
//                       : "bg-gray-100 border border-gray-300"
//                   }`}
//                   aria-label="Toggle menu"
//                   aria-expanded={mobileMenuOpen ? "true" : "false"}
//                 >
//                   <Bars3Icon
//                     className={`w-6 h-6 ${
//                       darkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   />
//                 </button>

//                 {mobileMenuOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <div className="px-4 py-2 flex items-center space-x-2 border-b border-gray-600">
//                       <img
//                         src={user.profilePic || DEFAULT_PROFILE_PIC}
//                         alt="Profile"
//                         className={`w-6 h-6 rounded-full border-2 p-0.5 ${
//                           darkMode
//                             ? "border-gray-600 bg-gray-700"
//                             : "border-gray-300 bg-gray-100"
//                         }`}
//                         onClick={() =>
//                           navigate(
//                             user.role?.toLowerCase() === "landlord"
//                               ? "/dashboard/landlord/profile"
//                               : "/dashboard/tenant/profile"
//                           )
//                         }
//                       />
//                       <span className="text-sm">{user.name}</span>
//                     </div>
//                     <button
//                       onClick={() =>
//                         handleNavigation(
//                           user.role?.toLowerCase() === "landlord"
//                             ? "/dashboard/landlord/profile"
//                             : "/dashboard/tenant/profile"
//                         )
//                       }
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Profile
//                     </button>
//                     <Button
//                       variant="danger"
//                       onClick={handleLogout}
//                       className="block px-4 py-2 w-full text-left"
//                     >
//                       Logout
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Desktop View (md and above) */}
//             <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
//               <ul className="flex space-x-8">
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     Home
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/about")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     About Us
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => handleNavigation("/contact")}
//                     className={
//                       darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                     }
//                   >
//                     Contact Us
//                   </button>
//                 </li>
//               </ul>
//             </div>

//             <div className="hidden md:flex items-center space-x-4">
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   className={
//                     darkMode
//                       ? "hover:text-gray-400 relative z-10"
//                       : "hover:text-gray-600 relative z-10"
//                   }
//                   aria-haspopup="true"
//                   aria-expanded={dropdownOpen ? "true" : "false"}
//                   onClick={() => setDropdownOpen((prev) => !prev)}
//                 >
//                   Login ⌵
//                 </button>
//                 {dropdownOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <button
//                       onClick={() => handleNavigation("/tenantlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Tenant Login
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/landlordlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Landlord Login
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <Button
//                 variant="primary"
//                 onClick={() => handleNavigation("/signup")}
//                 className="px-5 py-2"
//                 as={Link}
//                 to="/signup"
//               >
//                 Sign Up
//               </Button>
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>
//             </div>

//             {/* Mobile View (below md) */}
//             <div className="md:hidden flex items-center space-x-1">
//               {/* Dark Mode Toggle */}
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                   darkMode
//                     ? "bg-gray-700 border border-gray-600"
//                     : "bg-gray-100 border border-gray-300"
//                 }`}
//                 aria-label={
//                   darkMode ? "Switch to light mode" : "Switch to dark mode"
//                 }
//               >
//                 {darkMode ? (
//                   <SunIcon className="w-6 h-6 text-gray-300" />
//                 ) : (
//                   <MoonIcon className="w-6 h-6 text-gray-600" />
//                 )}
//               </button>

//               {/* Hamburger Menu */}
//               <div className="relative" ref={mobileMenuRef}>
//                 <button
//                   onClick={() => setMobileMenuOpen((prev) => !prev)}
//                   className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//                     darkMode
//                       ? "bg-gray-700 border border-gray-600"
//                       : "bg-gray-100 border border-gray-300"
//                   }`}
//                   aria-label="Toggle menu"
//                   aria-expanded={mobileMenuOpen ? "true" : "false"}
//                 >
//                   <Bars3Icon
//                     className={`w-6 h-6 ${
//                       darkMode ? "text-gray-300" : "text-gray-600"
//                     }`}
//                   />
//                 </button>

//                 {mobileMenuOpen && (
//                   <div
//                     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//                       darkMode
//                         ? "bg-gray-700 text-gray-200 border-gray-600"
//                         : "bg-white text-black border-gray-300"
//                     }`}
//                     role="menu"
//                   >
//                     <button
//                       onClick={() => handleNavigation("/")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Home
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/about")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       About Us
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/contact")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Contact Us
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/tenantlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Tenant Login
//                     </button>
//                     <button
//                       onClick={() => handleNavigation("/landlordlogin")}
//                       className={`block px-4 py-2 w-full text-left font-semibold transition-colors ${
//                         darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                       }`}
//                       role="menuitem"
//                     >
//                       Landlord Login
//                     </button>
//                     <Button
//                       variant="primary"
//                       onClick={() => handleNavigation("/signup")}
//                       className="block px-4 py-2 w-full text-left"
//                       as={Link}
//                       to="/signup"
//                       role="menuitem"
//                     >
//                       Sign Up
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;