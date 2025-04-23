import { FaCube } from "react-icons/fa"; // Importing an icon
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
// Import useDarkMode

const Features = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const { darkMode } = useDarkMode(); // Access dark mode state

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirects to sign-up page
  };

  const handleLearnMoreClick = () => {
    navigate("/about"); // Redirects to About page
  };

  const handleGetStartedClick = () => {
    navigate("/review"); // Redirects to Review page
  };

  const features = [
    {
      title:
        "Streamlined Process for Landlords and Tenants to Connect and Communicate",
      description:
        "Our platform simplifies rental management, making it easy for both landlords and tenants.",
      link: "Learn More",
      action: handleLearnMoreClick, // Navigates to About page
    },
    {
      title:
        "Track Your Rental History and Receive Important Notifications Effortlessly",
      description:
        "Stay informed with timely updates on rent, maintenance, and lease agreements.",
      link: "Sign Up",
      action: handleSignUpClick, // Navigates to Sign-Up page
    },
    {
      title:
        "Rate and Review Your Experience for Enhanced Trust and Transparency",
      description:
        "Share your feedback to help improve the rental experience for everyone.",
      link: "Get Started",
      action: handleGetStartedClick, // Navigates to Review page
    },
  ];

  return (
    <section
      className={`text-center py-16 px-6 md:px-16 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"
      }`}
    >
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-10">
        Easily Manage Your Rentals and Reviews <br />
        with Our User-Friendly Platform
      </h2>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`text-center p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl ${
              darkMode
                ? "bg-gray-800 shadow-gray-700"
                : "bg-white shadow-gray-300"
            }`}
          >
            <FaCube
              className={`text-3xl mx-auto mb-4 transition duration-300 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-700 hover:text-black"
              }`}
            />{" "}
            {/* Icon */}
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p
              className={
                darkMode ? "text-gray-400 mt-2 mb-4" : "text-gray-600 mt-2 mb-4"
              }
            >
              {feature.description}
            </p>
            <a
              href="#"
              onClick={feature.action} // Action handler
              className={`font-semibold transition duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-blue-300"
                  : "text-black hover:text-blue-400"
              }`}
            >
              {feature.link} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
