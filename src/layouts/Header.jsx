// const Header = () => {
//   return (
//     <header className="bg-white py-12">
//       <div className="max-w-6xl mx-auto px-6 md:flex md:items-center md:justify-between">
//         {/* Left Side - Title */}
//         <div className="md:w-1/2">
//           <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//             Streamline Your Rental Experience Today
//           </h1>
//         </div>

//         {/* Right Side - Text & Buttons */}
//         <div className="md:w-1/2 mt-6 md:mt-0">
//           <p className="text-gray-600 mb-4">
//             Discover a smarter way to manage your rental history and reviews. Join our
//             community of landlords and tenants for seamless communication and support.
//           </p>

//           {/* Buttons */}
//           <div className="flex space-x-4">
//             <button className="bg-black text-white px-5 py-2 rounded-md">
//               Learn More
//             </button>
//             <button className="border border-black text-black px-5 py-2 rounded-md">
//               Sign Up
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Hero Image Placeholder */}
//       <div className="mt-12">
//         <div className="w-full bg-gray-300 h-72 md:h-96 flex items-center justify-center">
//           <span className="text-gray-500">[Image Placeholder]</span>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




import { useNavigate } from "react-router-dom";
import headerImage from "../assets/header-image.png";

const Header = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup"); // Redirect to sign-up page
  };

  const handleLearnMoreClick = () => {
    window.scrollTo({
      top: window.innerHeight, // Scroll down one full screen height
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <header className="w-full bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center">
      {/* Left Side - Text Content */}
      <div className="md:w-1/2 text-black">
        <h1 className="text-4xl font-bold mb-4">
          Streamline Your Rental Experience Today
        </h1>
        <p className="text-gray-600 mb-6">
          Discover a smarter way to manage your rental history and reviews. Join
          our community of landlords and tenants for seamless communication and
          support.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleLearnMoreClick}
            className="bg-black text-white px-6 py-3 rounded transition duration-300 hover:bg-gray-800"
          >
            Learn More
          </button>
          <button
            onClick={handleSignUpClick}
            className="border border-black px-6 py-3 rounded transition duration-300 hover:bg-black hover:text-white"
          >
            Sign Up →
          </button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
        <img
          src={headerImage}
          alt="Rental Experience"
          className="w-full max-w-lg rounded-lg shadow-lg"
        />
      </div>
    </header>
  );
};

export default Header;

// import headerImage from "../assets/header-image.png";
// const Header = () => {
//   return (
//     <header className="w-full bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center">
//       {/* Left Side - Text Content */}
//       <div className="md:w-1/2 text-black">
//         <h1 className="text-4xl font-bold mb-4">
//           Streamline Your Rental Experience Today
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Discover a smarter way to manage your rental history and reviews. 
//           Join our community of landlords and tenants for seamless communication 
//           and support.
//         </p>
//         <div className="flex space-x-4">
//           <button className="bg-black text-white px-6 py-3 rounded">Learn More</button>
//           <button className="border border-black px-6 py-3 rounded">Sign Up</button>
//         </div>
//       </div>

//       {/* Right Side - Image */}
//       <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
//         <img
//           src="/assets/header-image.png"  // Update this to your actual image path
//           alt="Rental Experience"
//           className="w-full max-w-lg rounded-lg shadow-lg"
//         />
//       </div>
//     </header>
//   );
// };

// export default Header;
