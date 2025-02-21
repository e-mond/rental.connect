import { Link } from "react-router-dom";
import bannerImage from "../assets/Banner2.jpg";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
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
      <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h2>
        <p className="text-gray-600 leading-relaxed">
          We are a team of property management experts and technology
          enthusiasts committed to transforming rental relationships. Our
          platform empowers landlords and tenants to manage rental history, rate
          and review each other, and receive timely notifications about
          important updates such as rent payments, maintenance, and lease
          agreements. Whether it's a short-term stay or a long-term lease, our
          solution caters to all rental durations with ease and efficiency.
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-center bg-blue-100 rounded-full w-12 h-12 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Trust</h3>
          <p className="text-gray-600">
            Build transparent relationships through verified reviews and
            seamless communication.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-center bg-green-100 rounded-full w-12 h-12 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Efficiency
          </h3>
          <p className="text-gray-600">
            Simplify property management with smart automation and real-time
            notifications.
          </p>
        </div>

        <div className="bg-red-50 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-center bg-red-100 rounded-full w-12 h-12 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Security</h3>
          <p className="text-gray-600">
            Protect your data with enterprise-grade encryption and reliable
            backup solutions.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Need help or have questions? Reach out to our support team for
          assistance.
        </p>
        <Link
          to="/contact"
          className="bg-black text-white font-semibold px-6 py-2 rounded-md shadow-md hover:bg-gray-200 transition"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
};

export default About;
