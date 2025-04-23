import { Link } from "react-router-dom";
import bannerImage from "../assets/Banner2.jpg";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button"; // Import Button component

const About = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen py-10 px-4 sm:px-8 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-black"
      }`}
    >
      {/* Header Section with Image Background */}
      <header
        className="relative text-center mb-10 bg-cover bg-center h-64 flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent bg-opacity-90"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Our Mission</h1>
          <p className="text-lg text-gray-200">
            Revolutionizing the rental experience by building trust,
            transparency, and efficiency for landlords and tenants.
          </p>
        </div>
      </header>

      {/* Who We Are Section */}
      <section
        className={`rounded-2xl shadow-lg p-6 sm:p-10 mb-12 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
        <p className="leading-relaxed">
          We are a team of property management experts and technology
          enthusiasts committed to transforming rental relationships. Our
          platform empowers landlords and tenants to manage rental history, rate
          and review each other, and receive timely notifications about
          important updates such as rent payments, maintenance, and lease
          agreements. Whether it&apos;s a short-term stay or a long-term lease, our
          solution caters to all rental durations with ease and efficiency.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div
          className={`rounded-xl p-6 shadow-md ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full w-12 h-12 mb-4 ${
              darkMode ? "bg-gray-600" : "bg-blue-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16l-4-4m0 0l4-4m-4 4h16"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Trust</h3>
          <p>
            Build transparent relationships through verified reviews and
            seamless communication.
          </p>
        </div>

        <div
          className={`rounded-xl p-6 shadow-md ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-green-50"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full w-12 h-12 mb-4 ${
              darkMode ? "bg-gray-600" : "bg-green-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                darkMode ? "text-green-400" : "text-green-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h11M9 21V3m8 18l4-4-4-4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Efficiency</h3>
          <p>
            Simplify property management with smart automation and real-time
            notifications.
          </p>
        </div>

        <div
          className={`rounded-xl p-6 shadow-md ${
            darkMode ? "bg-gray-700 text-gray-300" : "bg-red-50"
          }`}
        >
          <div
            className={`flex items-center justify-center rounded-full w-12 h-12 mb-4 ${
              darkMode ? "bg-gray-600" : "bg-red-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A9 9 0 1119.07 3.866M9 13h6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Security</h3>
          <p>
            Protect your data with enterprise-grade encryption and reliable
            backup solutions.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section
        className={`rounded-2xl shadow-lg p-6 sm:p-10 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-6">
          Need help or have questions? Reach out to our support team for
          assistance.
        </p>
        <Button
          variant="primary"
          as={Link}
          to="/contact"
          className="shadow-md" // Preserve the shadow from the original Link
        >
          Get in Touch
        </Button>
      </section>
    </div>
  );
};

export default About;
