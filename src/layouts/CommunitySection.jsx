import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button";

const CommunitySection = () => {
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleSignUpClick = () => {
    navigate("/signup");
  };

  const handleLearnMoreClick = () => {
    navigate("/about");
  };

  return (
    <div
      className={`flex flex-col items-center py-12 md:py-12 px-4 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-black text-white"
      }`}
    >
      <h1
        className={`text-4xl md:text-4xl font-bold mb-4 text-center`} // Removed text-2xl
      >
        Join Our Rental Community Today
      </h1>
      <p
        className={`text-lg mb-6 text-center max-w-2xl ${
          darkMode ? "text-gray-400" : "text-gray-400"
        }`}
      >
        Discover a seamless way to manage your rental experience. Sign up for
        more information now!
      </p>
      <div className="flex space-x-4">
        <Button
          variant="primary"
          as={Link}
          to="/signup"
          onClick={handleSignUpClick}
          className="px-6 py-2 shadow-md"
        >
          Sign Up
        </Button>
        <Button
          variant="secondary"
          as={Link}
          to="/about"
          onClick={handleLearnMoreClick}
          className="px-6 py-2"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default CommunitySection;
