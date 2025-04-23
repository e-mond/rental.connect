import { FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import Link
import empowerImage from "../assets/Empower.jpg";
import { useDarkMode } from "../hooks/useDarkMode";
// Import useDarkMode
import Button from "../components/Button"; // Import Button component

export default function RentalExperienceSection() {
  const navigate = useNavigate(); // Initializes navigate hook
  const { darkMode } = useDarkMode(); // Access dark mode state

  const handleLearnMoreClick = () => {
    navigate("/about"); // Redirects to About page
  };

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirects to Sign-Up page
  };

  return (
    <section
      className={`flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-20 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"
      }`}
    >
      <div className="max-w-lg space-y-4">
        <h6
          className={`text-sm font-semibold ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Empower
        </h6>
        <h2
          className={`text-4xl font-bold ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Transform Your Rental Experience Today
        </h2>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Our system fosters transparency and enhances communication between
          landlords and tenants. Enjoy a streamlined rental management process
          that saves time and reduces stress.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex space-x-4">
            <FaStar
              className={`w-8 h-8 ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
            />
            <div>
              <h6
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Transparency Matters
              </h6>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Experience clear insights into rental agreements and tenant
                history.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaStar
              className={`w-8 h-8 ${
                darkMode ? "text-gray-400" : "text-gray-700"
              }`}
            />
            <div>
              <h6
                className={`font-semibold ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Better Communication
              </h6>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Stay informed with timely notifications about rent and
                maintenance updates.
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Button
            variant="primary"
            as={Link}
            to="/about"
            onClick={handleLearnMoreClick}
            className="px-6 py-3" // Match original padding
          >
            Learn More
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/signup"
            onClick={handleSignUpClick}
            className="px-6 py-3" // Match original padding
          >
            Sign Up →
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-64 flex items-center justify-center mt-8 lg:mt-0">
        <img
          src={empowerImage}
          alt="Empower"
          className={`w-full h-full object-cover rounded-lg shadow-md ${
            darkMode ? "shadow-gray-700" : "shadow-gray-300"
          }`}
        />
      </div>
    </section>
  );
}
