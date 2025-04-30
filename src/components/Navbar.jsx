
// import PropTypes from "prop-types";
// import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import {
//   MoonIcon,
//   SunIcon,
//   BellIcon,
//   Bars3Icon,
//   UserIcon,
// } from "@heroicons/react/24/outline";
// import { useUser } from "../context/useUser";
// import { useDarkMode } from "../hooks/useDarkMode";
// import { DASHBOARD_BASE_URL } from "../config";
// import Button from "../components/Button";

// const Navbar = () => {
//   const { user, logout, loading } = useUser();
//   const { darkMode, setDarkMode } = useDarkMode();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const notificationCount = 0; // static for now

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

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

//   const handleLogout = () => {
//     logout();
//     setDropdownOpen(false);
//     setMobileMenuOpen(false);
//     navigate("/tenantlogin", { replace: true });
//   };

//   const handleNotificationClick = () => {
//     setMobileMenuOpen(false);
//     navigate(`${DASHBOARD_BASE_URL}/notifications`);
//   };

//   const shouldShowLogout =
//     location.pathname.startsWith("/dashboard") ||
//     location.pathname.startsWith("/account-success/tenant") ||
//     location.pathname.startsWith("/account-success/landlord");

//   const logoDestination =
//     user && shouldShowLogout
//       ? user.role?.toLowerCase() === "landlord"
//         ? "/dashboard/landlord"
//         : user.role?.toLowerCase() === "tenant"
//         ? "/dashboard/tenant"
//         : "/"
//       : "/";

//   const getUserInitials = () => {
//     if (!user) return "";
//     const first = user.firstName?.charAt(0).toUpperCase() || "";
//     const last = user.lastName?.charAt(0).toUpperCase() || "";
//     return `${first}${last}`;
//   };

//   const profilePath =
//     user?.role?.toLowerCase() === "landlord"
//       ? "/dashboard/landlord/profile"
//       : "/dashboard/tenant/profile";

//   if (loading) {
//     return (
//       <nav
//         className={`py-4 shadow-md w-full relative z-50 ${
//           darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"
//         }`}
//       >
//         <div className="max-w-[90%] mx-auto flex justify-between items-center">
//           <Link to="/" className="font-bold italic md:text-2xl text-lg">
//             RentalConnect
//           </Link>
//           <div className="flex items-center space-x-2">
//             <div
//               className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${
//                 darkMode ? "border-gray-200" : "border-black"
//               }`}
//             />
//             <span className={darkMode ? "text-gray-200" : "text-black"}>
//               Loading...
//             </span>
//           </div>
//         </div>
//       </nav>
//     );
//   }

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
//           className="font-bold italic md:text-2xl text-lg"
//         >
//           RentalConnect
//         </Link>

//         {/* Authenticated View */}
//         {user && shouldShowLogout ? (
//           <>
//             {/* Desktop */}
//             <div className="hidden md:flex items-center space-x-4">
//               {/* Notifications */}
//               <IconButton
//                 onClick={handleNotificationClick}
//                 Icon={BellIcon}
//                 darkMode={darkMode}
//                 notificationCount={notificationCount}
//               />
//               {/* Avatar */}
//               <div
//                 onClick={() => navigate(profilePath)}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-2 text-sm font-semibold ${
//                   darkMode
//                     ? "border-gray-600 bg-gray-700 text-gray-200"
//                     : "border-gray-300 bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 {getUserInitials() || <UserIcon className="w-5 h-5" />}
//               </div>
//               {/* Logout */}
//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="px-5 py-2"
//               >
//                 Logout
//               </Button>
//               {/* Dark Mode */}
//               <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//             </div>

//             {/* Mobile */}
//             <MobileMenu
//               darkMode={darkMode}
//               mobileMenuOpen={mobileMenuOpen}
//               setMobileMenuOpen={setMobileMenuOpen}
//               mobileMenuRef={mobileMenuRef}
//               navigate={navigate}
//               profilePath={profilePath}
//               handleLogout={handleLogout}
//               notificationCount={notificationCount}
//               handleNotificationClick={handleNotificationClick}
//               setDarkMode={setDarkMode}
//             />
//           </>
//         ) : (
//           <>
//             {/* Desktop (Public) */}
//             <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
//               <ul className="flex space-x-8">
//                 {[
//                   { text: "Home", path: "/" },
//                   { text: "About Us", path: "/about" },
//                   { text: "Contact Us", path: "/contact" },
//                 ].map((item, idx) => (
//                   <li key={idx}>
//                     <NavLink
//                       to={item.path}
//                       className={({ isActive }) =>
//                         darkMode
//                           ? `hover:text-gray-400 ${
//                               isActive
//                                 ? "text-teal-400 font-bold underline"
//                                 : ""
//                             }`
//                           : `hover:text-gray-600 ${
//                               isActive
//                                 ? "text-black font-bold underline"
//                                 : ""
//                             }`
//                       }
//                     >
//                       {item.text}
//                     </NavLink>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               {/* Login Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   className={`${
//                     darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
//                   } relative z-10`}
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   aria-haspopup="true"
//                   aria-expanded={dropdownOpen}
//                 >
//                   Login ⌵
//                 </button>
//                 {dropdownOpen && (
//                   <DropdownMenu
//                     darkMode={darkMode}
//                     setDropdownOpen={setDropdownOpen}
//                   />
//                 )}
//               </div>
//               {/* Signup */}
//               <Button
//                 variant="primary"
//                 as={Link}
//                 to="/signup"
//                 className="px-5 py-2"
//               >
//                 Sign Up
//               </Button>
//               {/* Dark Mode */}
//               <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//             </div>

//             {/* Mobile (Public) */}
//             <MobileMenu
//               darkMode={darkMode}
//               mobileMenuOpen={mobileMenuOpen}
//               setMobileMenuOpen={setMobileMenuOpen}
//               mobileMenuRef={mobileMenuRef}
//               setDarkMode={setDarkMode}
//             />
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// /* --- Utility Components --- */
// const IconButton = ({ onClick, Icon, darkMode, notificationCount }) => (
//   <button
//     onClick={onClick}
//     className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//       darkMode
//         ? "bg-gray-700 border border-gray-600"
//         : "bg-gray-100 border border-gray-300"
//     }`}
//     aria-label="View notifications"
//   >
//     <Icon
//       className={`w-6 h-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
//     />
//     {notificationCount > 0 && (
//       <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//         {notificationCount}
//       </span>
//     )}
//   </button>
// );

// IconButton.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   Icon: PropTypes.elementType.isRequired,
//   darkMode: PropTypes.bool.isRequired,
//   notificationCount: PropTypes.number,
// };

// IconButton.defaultProps = {
//   notificationCount: 0,
// };

// const DarkModeToggle = ({ darkMode, setDarkMode }) => (
//   <button
//     onClick={() => setDarkMode(!darkMode)}
//     className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//       darkMode
//         ? "bg-gray-700 border border-gray-600"
//         : "bg-gray-100 border border-gray-300"
//     }`}
//     aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//   >
//     {darkMode ? (
//       <SunIcon className="w-6 h-6 text-gray-300" />
//     ) : (
//       <MoonIcon className="w-6 h-6 text-gray-600" />
//     )}
//   </button>
// );

// DarkModeToggle.propTypes = {
//   darkMode: PropTypes.bool.isRequired,
//   setDarkMode: PropTypes.func.isRequired,
// };

// const DropdownMenu = ({ darkMode, setDropdownOpen }) => (
//   <div
//     className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//       darkMode
//         ? "bg-gray-700 text-gray-200 border-gray-600"
//         : "bg-white text-black border-gray-300"
//     }`}
//     role="menu"
//   >
//     <NavLink
//       to="/tenantlogin"
//       className={({ isActive }) =>
//         `block px-4 py-2 w-full text-left font-semibold ${
//           darkMode
//             ? `hover:bg-gray-600 ${
//                 isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//               }`
//             : `hover:bg-gray-100 ${
//                 isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//               }`
//         }`
//       }
//       onClick={() => setDropdownOpen(false)}
//     >
//       Tenant Login
//     </NavLink>
//     <NavLink
//       to="/landlordlogin"
//       className={({ isActive }) =>
//         `block px-4 py-2 w-full text-left font-semibold ${
//           darkMode
//             ? `hover:bg-gray-600 ${
//                 isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//               }`
//             : `hover:bg-gray-100 ${
//                 isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//               }`
//         }`
//       }
//       onClick={() => setDropdownOpen(false)}
//     >
//       Landlord Login
//     </NavLink>
//   </div>
// );

// DropdownMenu.propTypes = {
//   darkMode: PropTypes.bool.isRequired,
//   setDropdownOpen: PropTypes.func.isRequired,
// };

// const MobileMenu = ({
//   darkMode,
//   mobileMenuOpen,
//   setMobileMenuOpen,
//   mobileMenuRef,
//   navigate,
//   profilePath,
//   handleLogout,
//   notificationCount,
//   handleNotificationClick,
//   setDarkMode,
// }) => (
//   <div className="md:hidden flex items-center space-x-1">
//     <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//     <div className="relative" ref={mobileMenuRef}>
//       <button
//         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
//           darkMode
//             ? "bg-gray-700 border border-gray-600"
//             : "bg-gray-100 border border-gray-300"
//         }`}
//         aria-label="Toggle menu"
//         aria-expanded={mobileMenuOpen}
//       >
//         <Bars3Icon
//           className={`w-6 h-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
//         />
//       </button>
//       {mobileMenuOpen && (
//         <div
//           className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
//             darkMode
//               ? "bg-gray-700 text-gray-200 border-gray-600"
//               : "bg-white text-black border-gray-300"
//           }`}
//         >
//           {navigate ? (
//             <>
//               <div className="flex justify-between items-center px-4 py-2">
//                 <span className="font-semibold">Menu</span>
//                 <IconButton
//                   onClick={handleNotificationClick}
//                   Icon={BellIcon}
//                   darkMode={darkMode}
//                   notificationCount={notificationCount}
//                 />
//               </div>
//               <button
//                 onClick={() => navigate(profilePath)}
//                 className={`block px-4 py-2 w-full text-left font-semibold ${
//                   darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
//                 }`}
//               >
//                 Profile
//               </button>
//               <Button
//                 variant="danger"
//                 onClick={handleLogout}
//                 className="block px-4 py-2 w-full text-left"
//               >
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 w-full text-left font-semibold ${
//                     darkMode
//                       ? `hover:bg-gray-600 ${
//                           isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//                         }`
//                       : `hover:bg-gray-100 ${
//                           isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//                         }`
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Home
//               </NavLink>
//               <NavLink
//                 to="/about"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 w-full text-left font-semibold ${
//                     darkMode
//                       ? `hover:bg-gray-600 ${
//                           isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//                         }`
//                       : `hover:bg-gray-100 ${
//                           isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//                         }`
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 About Us
//               </NavLink>
//               <NavLink
//                 to="/contact"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 w-full text-left font-semibold ${
//                     darkMode
//                       ? `hover:bg-gray-600 ${
//                           isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//                         }`
//                       : `hover:bg-gray-100 ${
//                           isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//                         }`
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Contact Us
//               </NavLink>
//               <NavLink
//                 to="/tenantlogin"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 w-full text-left font-semibold ${
//                     darkMode
//                       ? `hover:bg-gray-600 ${
//                           isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//                         }`
//                       : `hover:bg-gray-100 ${
//                           isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//                         }`
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Tenant Login
//               </NavLink>
//               <NavLink
//                 to="/landlordlogin"
//                 className={({ isActive }) =>
//                   `block px-4 py-2 w-full text-left font-semibold ${
//                     darkMode
//                       ? `hover:bg-gray-600 ${
//                           isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
//                         }`
//                       : `hover:bg-gray-100 ${
//                           isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
//                         }`
//                   }`
//                 }
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Landlord Login
//               </NavLink>
//               <Button
//                 variant="primary"
//                 as={NavLink}
//                 to="/signup"
//                 className="block px-4 py-2 w-full text-left"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Sign Up
//               </Button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   </div>
// );

// MobileMenu.propTypes = {
//   darkMode: PropTypes.bool.isRequired,
//   mobileMenuOpen: PropTypes.bool.isRequired,
//   setMobileMenuOpen: PropTypes.func.isRequired,
//   mobileMenuRef: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
//   ]),
//   navigate: PropTypes.func,
//   profilePath: PropTypes.string,
//   handleLogout: PropTypes.func,
//   notificationCount: PropTypes.number,
//   handleNotificationClick: PropTypes.func,
//   setDarkMode: PropTypes.func.isRequired,
// };

// MobileMenu.defaultProps = {
//   notificationCount: 0,
// };

// export default Navbar;




import PropTypes from "prop-types";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  Bars3Icon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../context/useUser";
import { useDarkMode } from "../hooks/useDarkMode";
import { DASHBOARD_BASE_URL } from "../config";
import Button from "../components/Button";

/**
 * Navbar Component
 *
 * Provides a responsive navigation bar with support for authenticated and public views.
 * Includes features like dark mode toggle, user profile, notifications, and mobile menu.
 * Handles user authentication state and navigation based on user role (tenant or landlord).
 *
 * @returns {JSX.Element} The rendered Navbar component
 */
const Navbar = () => {
  const { user, logout } = useUser();
  const { darkMode, setDarkMode } = useDarkMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const notificationCount = 0; // Static for now

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Handle logout and redirect to tenant login
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/tenantlogin", { replace: true });
  };

  // Navigate to notifications page
  const handleNotificationClick = () => {
    setMobileMenuOpen(false);
    navigate(`${DASHBOARD_BASE_URL}/notifications`);
  };

  // Determine if logout button should be shown
  const shouldShowLogout =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/account-success/tenant") ||
    location.pathname.startsWith("/account-success/landlord");

  // Set logo destination based on user role
  const logoDestination =
    user && shouldShowLogout
      ? user.role?.toLowerCase() === "landlord"
        ? "/dashboard/landlord"
        : user.role?.toLowerCase() === "tenant"
        ? "/dashboard/tenant"
        : "/"
      : "/";

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    const first = user.firstName?.charAt(0).toUpperCase() || "";
    const last = user.lastName?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  };

  // Set profile path based on user role
  const profilePath =
    user?.role?.toLowerCase() === "landlord"
      ? "/dashboard/landlord/profile"
      : "/dashboard/tenant/profile";

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
          className="font-bold italic md:text-2xl text-lg"
        >
          RentalConnect
        </Link>

        {/* Authenticated View */}
        {user && shouldShowLogout ? (
          <>
            {/* Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <IconButton
                onClick={handleNotificationClick}
                Icon={BellIcon}
                darkMode={darkMode}
                notificationCount={notificationCount}
              />
              {/* Avatar */}
              <div
                onClick={() => navigate(profilePath)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-2 text-sm font-semibold ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-gray-200"
                    : "border-gray-300 bg-gray-100 text-gray-800"
                }`}
              >
                {getUserInitials() || <UserIcon className="w-5 h-5" />}
              </div>
              {/* Logout */}
              <Button
                variant="danger"
                onClick={handleLogout}
                className="px-5 py-2"
              >
                Logout
              </Button>
              {/* Dark Mode */}
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            {/* Mobile */}
            <MobileMenu
              darkMode={darkMode}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              mobileMenuRef={mobileMenuRef}
              navigate={navigate}
              profilePath={profilePath}
              handleLogout={handleLogout}
              notificationCount={notificationCount}
              handleNotificationClick={handleNotificationClick}
              setDarkMode={setDarkMode}
            />
          </>
        ) : (
          <>
            {/* Desktop (Public) */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
              <ul className="flex space-x-8">
                {[
                  { text: "Home", path: "/" },
                  { text: "About Us", path: "/about" },
                  { text: "Contact Us", path: "/contact" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        darkMode
                          ? `hover:text-gray-400 ${
                              isActive
                                ? "text-teal-400 font-bold underline"
                                : ""
                            }`
                          : `hover:text-gray-600 ${
                              isActive ? "text-black font-bold underline" : ""
                            }`
                      }
                    >
                      {item.text}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* Login Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className={`${
                    darkMode ? "hover:text-gray-400" : "hover:text-gray-600"
                  } relative z-10`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  Login ⌵
                </button>
                {dropdownOpen && (
                  <DropdownMenu
                    darkMode={darkMode}
                    setDropdownOpen={setDropdownOpen}
                  />
                )}
              </div>
              {/* Signup */}
              <Button
                variant="primary"
                as={Link}
                to="/signup"
                className="px-5 py-2"
              >
                Sign Up
              </Button>
              {/* Dark Mode */}
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            {/* Mobile (Public) */}
            <MobileMenu
              darkMode={darkMode}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              mobileMenuRef={mobileMenuRef}
              setDarkMode={setDarkMode}
            />
          </>
        )}
      </div>
    </nav>
  );
};

/* --- Utility Components --- */
const IconButton = ({ onClick, Icon, darkMode, notificationCount }) => (
  <button
    onClick={onClick}
    className={`relative p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
      darkMode
        ? "bg-gray-700 border border-gray-600"
        : "bg-gray-100 border border-gray-300"
    }`}
    aria-label="View notifications"
  >
    <Icon
      className={`w-6 h-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
    />
    {notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {notificationCount}
      </span>
    )}
  </button>
);

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  Icon: PropTypes.elementType.isRequired,
  darkMode: PropTypes.bool.isRequired,
  notificationCount: PropTypes.number,
};

IconButton.defaultProps = {
  notificationCount: 0,
};

const DarkModeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
      darkMode
        ? "bg-gray-700 border border-gray-600"
        : "bg-gray-100 border border-gray-300"
    }`}
    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
  >
    {darkMode ? (
      <SunIcon className="w-6 h-6 text-gray-300" />
    ) : (
      <MoonIcon className="w-6 h-6 text-gray-600" />
    )}
  </button>
);

DarkModeToggle.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};

const DropdownMenu = ({ darkMode, setDropdownOpen }) => (
  <div
    className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
      darkMode
        ? "bg-gray-700 text-gray-200 border-gray-600"
        : "bg-white text-black border-gray-300"
    }`}
    role="menu"
  >
    <NavLink
      to="/tenantlogin"
      className={({ isActive }) =>
        `block px-4 py-2 w-full text-left font-semibold ${
          darkMode
            ? `hover:bg-gray-600 ${
                isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
              }`
            : `hover:bg-gray-100 ${
                isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
              }`
        }`
      }
      onClick={() => setDropdownOpen(false)}
    >
      Tenant Login
    </NavLink>
    <NavLink
      to="/landlordlogin"
      className={({ isActive }) =>
        `block px-4 py-2 w-full text-left font-semibold ${
          darkMode
            ? `hover:bg-gray-600 ${
                isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
              }`
            : `hover:bg-gray-100 ${
                isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
              }`
        }`
      }
      onClick={() => setDropdownOpen(false)}
    >
      Landlord Login
    </NavLink>
  </div>
);

DropdownMenu.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDropdownOpen: PropTypes.func.isRequired,
};

const MobileMenu = ({
  darkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileMenuRef,
  navigate,
  profilePath,
  handleLogout,
  notificationCount,
  handleNotificationClick,
  setDarkMode,
}) => (
  <div className="md:hidden flex items-center space-x-1">
    <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    <div className="relative" ref={mobileMenuRef}>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className={`p-1 rounded-full focus:ring-2 focus:ring-blue-500 ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-gray-100 border border-gray-300"
        }`}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <Bars3Icon
          className={`w-6 h-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        />
      </button>
      {mobileMenuOpen && (
        <div
          className={`absolute right-0 mt-2 shadow-lg py-2 w-44 border rounded-md z-50 ${
            darkMode
              ? "bg-gray-700 text-gray-200 border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {navigate ? (
            <>
              <div className="flex justify-between items-center px-4 py-2">
                <span className="font-semibold">Menu</span>
                <IconButton
                  onClick={handleNotificationClick}
                  Icon={BellIcon}
                  darkMode={darkMode}
                  notificationCount={notificationCount}
                />
              </div>
              <button
                onClick={() => navigate(profilePath)}
                className={`block px-4 py-2 w-full text-left font-semibold ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
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
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 w-full text-left font-semibold ${
                    darkMode
                      ? `hover:bg-gray-600 ${
                          isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
                        }`
                      : `hover:bg-gray-100 ${
                          isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
                        }`
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block px-4 py-2 w-full text-left font-semibold ${
                    darkMode
                      ? `hover:bg-gray-600 ${
                          isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
                        }`
                      : `hover:bg-gray-100 ${
                          isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
                        }`
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `block px-4 py-2 w-full text-left font-semibold ${
                    darkMode
                      ? `hover:bg-gray-600 ${
                          isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
                        }`
                      : `hover:bg-gray-100 ${
                          isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
                        }`
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </NavLink>
              <NavLink
                to="/tenantlogin"
                className={({ isActive }) =>
                  `block px-4 py-2 w-full text-left font-semibold ${
                    darkMode
                      ? `hover:bg-gray-600 ${
                          isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
                        }`
                      : `hover:bg-gray-100 ${
                          isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
                        }`
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Tenant Login
              </NavLink>
              <NavLink
                to="/landlordlogin"
                className={({ isActive }) =>
                  `block px-4 py-2 w-full text-left font-semibold ${
                    darkMode
                      ? `hover:bg-gray-600 ${
                          isActive ? "bg-blue-900 text-blue-400 font-bold" : ""
                        }`
                      : `hover:bg-gray-100 ${
                          isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
                        }`
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Landlord Login
              </NavLink>
              <Button
                variant="primary"
                as={NavLink}
                to="/signup"
                className="block px-4 py-2 w-full text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  </div>
);

MobileMenu.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  mobileMenuOpen: PropTypes.bool.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired,
  mobileMenuRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  navigate: PropTypes.func,
  profilePath: PropTypes.string,
  handleLogout: PropTypes.func,
  notificationCount: PropTypes.number,
  handleNotificationClick: PropTypes.func,
  setDarkMode: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  notificationCount: 0,
};

export default Navbar;
