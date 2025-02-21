import { FaCube } from "react-icons/fa"; // Importing an icon
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to sign-up page
  };

  const handleLearnMoreClick = () => {
    navigate("/about"); // Redirect to About page
  };

  const handleGetStartedClick = () => {
    navigate("/review"); // Redirect to Review page
  };

  const features = [
    {
      title:
        "Streamlined Process for Landlords and Tenants to Connect and Communicate",
      description:
        "Our platform simplifies rental management, making it easy for both landlords and tenants.",
      link: "Learn More",
      action: handleLearnMoreClick, // Navigate to About page
    },
    {
      title:
        "Track Your Rental History and Receive Important Notifications Effortlessly",
      description:
        "Stay informed with timely updates on rent, maintenance, and lease agreements.",
      link: "Sign Up",
      action: handleSignUpClick, // Navigate to Sign-Up page
    },
    {
      title:
        "Rate and Review Your Experience for Enhanced Trust and Transparency",
      description:
        "Share your feedback to help improve the rental experience for everyone.",
      link: "Get Started",
      action: handleGetStartedClick, // Navigate to Review page
    },
  ];

  return (
    <section className="text-center py-16 px-6 md:px-16 bg-white">
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
            className="text-center p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
          >
            <FaCube className="text-3xl mx-auto mb-4 text-gray-700 hover:text-black transition duration-300" />{" "}
            {/* Icon */}
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600 mt-2 mb-4">{feature.description}</p>
            <a
              href="#"
              onClick={feature.action} // Attach action handler
              className="font-semibold text-blue-600 hover:text-black transition duration-300"
            >
              {feature.link} &rarr;
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
