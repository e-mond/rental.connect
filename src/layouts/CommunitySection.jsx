import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const CommunitySection = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to the sign-up page
  };

  const handleLearnMoreClick = () => {
    navigate("/about"); // Redirect to the about page
  };

  return (
    <div className="bg-black text-white flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold mb-4">
        Join Our Rental Community Today
      </h1>
      <p className="text-lg text-gray-400 mb-6 text-center max-w-2xl">
        Discover a seamless way to manage your rental experience. Sign up for
        more information now!
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleSignUpClick} // Attach sign-up handler
          className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow-md hover:bg-gray-200 transition"
        >
          Sign Up
        </button>
        <button
          onClick={handleLearnMoreClick} // Attach learn-more handler
          className="border border-white text-white font-semibold px-6 py-2 rounded-md hover:bg-white hover:text-black transition"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default CommunitySection;
