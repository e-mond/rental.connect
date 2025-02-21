import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with real auth state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  const showLogoutRoutes = [
    "/dashboard",
    "/account-success/landlord",
    "/account-success/tenant",
    "/tenant-dashboard",
  ];

  const shouldShowLogout = showLogoutRoutes.includes(location.pathname);

  return (
    <nav className="bg-white text-black py-4 shadow-md w-full relative z-50">
      <div className="max-w-[90%] mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold italic">
          RentalConnect
        </Link>

        {shouldShowLogout && isLoggedIn ? (
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLogout}
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <ul className="hidden md:flex space-x-8">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="hover:text-gray-600"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/about")}
                  className="hover:text-gray-600"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="hover:text-gray-600"
                >
                  Contact Us
                </button>
              </li>
            </ul>

            <div className="flex items-center space-x-6">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="hover:text-gray-600 relative z-10"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Login ⌵
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg py-2 w-44 border rounded-md z-50">
                    <button
                      onClick={() => handleNavigation("/tenant-login")}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      Tenant Login
                    </button>
                    <button
                      onClick={() => handleNavigation("/landlord-login")}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      Landlord Login
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavigation("/signup")}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-600"
              >
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
