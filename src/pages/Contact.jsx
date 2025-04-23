import {
  ChatBubbleLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button";

const Contact = () => {
  const { darkMode } = useDarkMode();

  const handleChat = () => {
    alert("Starting chat support...");
    // Replace with actual chat support logic
  };

  const handleEmail = () => {
    window.location.href = "mailto:support@example.com";
  };

  const handleCall = () => {
    window.location.href = "tel:+1234567890";
  };

  return (
    <div
      className={`min-h-screen py-10 px-4 sm:px-8 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Hero Section */}
      <div
        className={`relative h-64 py-20 px-4 text-center mb-10 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-black text-white"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">We&apos;re Here to Help</h1>
          <p className="text-lg">
            Choose the best way to reach out to us. Our team is ready to assist
            you.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 mb-12">
        <div
          className={`shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-900"
          }`}
        >
          <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Live Chat</h2>
          <p className="mb-4">Chat with our support team in real time.</p>
          <Button variant="primary" onClick={handleChat}>
            Start Chat
          </Button>
        </div>

        <div
          className={`shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
          }`}
        >
          <EnvelopeIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Email Support</h2>
          <p className="mb-4">Send us a detailed message.</p>
          <Button variant="primary" onClick={handleEmail}>
            Send Email
          </Button>
        </div>

        <div
          className={`shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-300 text-gray-900"
          }`}
        >
          <PhoneIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Phone Support</h2>
          <p className="mb-4">Talk to us directly.</p>
          <Button variant="primary" onClick={handleCall}>
            Call Now
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg shadow hover:shadow-lg transition ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h3 className="font-semibold">How do I reset my password?</h3>
            <p className="text-sm mt-2">
              You can reset your password by clicking on the &quot;Forgot Password&quot;
              link on the login page. An email will be sent to your registered
              address with instructions.
            </p>
          </div>
          <div
            className={`p-4 rounded-lg shadow hover:shadow-lg transition ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h3 className="font-semibold">
              Can I update my account information?
            </h3>
            <p className="text-sm mt-2">
              Yes, you can update your account information in the &quot;Account
              Settings&quot; section after logging in.
            </p>
          </div>
          <div
            className={`p-4 rounded-lg shadow hover:shadow-lg transition ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            <h3 className="font-semibold">Is my data secure?</h3>
            <p className="text-sm mt-2">
              We prioritize your data security and use advanced encryption to
              ensure your information is safe.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Form */}
      <div
        className={`max-w-6xl mx-auto py-12 px-4 sm:px-8 ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Quick Contact Form
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block font-medium mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full border rounded-lg px-4 py-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-900 text-gray-200"
                  : "border-gray-300"
              }`}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full border rounded-lg px-4 py-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-900 text-gray-200"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className={`w-full border rounded-lg px-4 py-2 ${
                darkMode
                  ? "border-gray-700 bg-gray-900 text-gray-200"
                  : "border-gray-300"
              }`}
              rows="5"
              placeholder="Type your message here"
            ></textarea>
          </div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
