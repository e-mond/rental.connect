import { useNavigate, Link } from "react-router-dom";
import headerImage from "../assets/header-image.png";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button";

const Header = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLearnMoreClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`w-full py-12 px-6 md:px-16 flex flex-col md:flex-row items-center ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"
      }`}
    >
      {/* Left Side - Text Content */}
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">
          Streamline Your Rental Experience Today
        </h1>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Discover a smarter way to manage your rental history and reviews. Join
          our community of landlords and tenants for seamless communication and
          support.
        </p>
        <div className="flex space-x-4 mt-6">
          <Button
            variant="primary"
            onClick={handleLearnMoreClick}
            className="px-6 py-3"
          >
            Learn More
          </Button>
          <Button
            variant="secondary"
            as={Link}
            to="/signup"
            onClick={handleSignUpClick}
            className="px-6 py-3"
          >
            Sign Up →
          </Button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <img
          src={headerImage}
          alt="Rental Experience"
          className={`w-full max-w-lg rounded-lg shadow-lg ${
            darkMode ? "shadow-gray-700" : "shadow-gray-300"
          }`}
        />
      </div>
    </header>
  );
};

export default Header;
