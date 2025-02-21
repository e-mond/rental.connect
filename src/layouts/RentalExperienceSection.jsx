import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import empowerImage from "../assets/Empower.jpg"; // Import the image

export default function RentalExperienceSection() {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLearnMoreClick = () => {
    navigate("/about"); // Redirect to About page
  };

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to Sign-Up page
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-20">
      <div className="max-w-lg space-y-4">
        <h6 className="text-sm font-semibold text-gray-600">Empower</h6>
        <h2 className="text-4xl font-bold text-gray-900">
          Transform Your Rental Experience Today
        </h2>
        <p className="text-gray-600">
          Our system fosters transparency and enhances communication between
          landlords and tenants. Enjoy a streamlined rental management process
          that saves time and reduces stress.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex space-x-4">
            <FaStar className="w-8 h-8 text-gray-700" />
            <div>
              <h6 className="font-semibold text-gray-900">
                Transparency Matters
              </h6>
              <p className="text-gray-600">
                Experience clear insights into rental agreements and tenant
                history.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <FaStar className="w-8 h-8 text-gray-700" />
            <div>
              <h6 className="font-semibold text-gray-900">
                Better Communication
              </h6>
              <p className="text-gray-600">
                Stay informed with timely notifications about rent and
                maintenance updates.
              </p>
            </div>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleLearnMoreClick} // Add click handler
            className="bg-black text-white px-6 py-3 rounded transition duration-300 hover:bg-gray-400"
          >
            Learn More
          </button>
          <button
            onClick={handleSignUpClick} // Add click handler
            className="border border-black px-6 py-3 rounded transition duration-300 hover:bg-black hover:text-white"
          >
            Sign Up →
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-64 flex items-center justify-center mt-8 lg:mt-0">
        <img
          src={empowerImage}
          alt="Empower"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
