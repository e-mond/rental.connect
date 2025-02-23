import { useState } from "react";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaStar,
  FaWrench,
  FaEnvelope,
  FaDollarSign,
  FaFileAlt,
  FaCog,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-4 text-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-100 p-4 flex flex-col h-screen transform transition-transform md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-4 flex-grow">
          <a
            href="/dashboard"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaHome className="mr-2" /> Dashboard
          </a>
          <a
            href="/properties"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaBuilding className="mr-2" /> Properties
          </a>
          <a
            href="/tenants"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaUsers className="mr-2" /> Tenants
          </a>
          <a
            href="/reviews"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaStar className="mr-2" /> Reviews
          </a>
          <a
            href="/maintenance"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaWrench className="mr-2" /> Maintenance
          </a>
          <a
            href="/messages"
            className="flex items-center text-gray-700 hover:text-black"
          >
            <FaEnvelope className="mr-2" /> Messages
          </a>

          <div className="mt-8">
            <h2 className="text-gray-600 text-sm uppercase">Management</h2>
            <a
              href="/payments"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaDollarSign className="mr-2" /> Payments
            </a>
            <a
              href="/documents"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaFileAlt className="mr-2" /> Documents
            </a>
            <a
              href="/settings"
              className="flex items-center text-gray-700 hover:text-black mt-2"
            >
              <FaCog className="mr-2" /> Settings
            </a>
          </div>
        </nav>

        {/* User Profile at Bottom */}
        <div className="mt-auto flex items-center text-gray-700 p-4 bg-gray-200 rounded-lg">
          <FaUser className="mr-2" />
          <span>Johnny Quayson</span>
        </div>
      </aside>

      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
