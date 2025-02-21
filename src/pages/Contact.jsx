
import {
  ChatBubbleLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      {/* Hero Section */}
      <div className="relative bg-black text-white h-64 py-20 px-4 text-center mb-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">We're Here to Help</h1>
          <p className="text-lg text-gray-200">
            Choose the best way to reach out to us. Our team is ready to assist
            you.
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-8 mb-12">
        {/* Live Chat */}
        <div className="bg-gray-200 text-black shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
          <ChatBubbleLeftIcon className="w-12 h-12 text-black mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Live Chat</h2>
          <p className="mb-4">Chat with our support team in real time.</p>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Start Chat
          </button>
        </div>

        {/* Email Support */}
        <div className="bg-gray-100 text-black shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
          <EnvelopeIcon className="w-12 h-12 text-black mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Email Support</h2>
          <p className="mb-4">Send us a detailed message.</p>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Send Email
          </button>
        </div>

        {/* Phone Support */}
        <div className="bg-gray-300 text-black shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition">
          <PhoneIcon className="w-12 h-12 text-black mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Phone Support</h2>
          <p className="mb-4">Talk to us directly.</p>
          <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            Call Now
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold">How do I reset my password?</h3>
            <p className="text-sm mt-2">
              You can reset your password by clicking on the "Forgot Password"
              link on the login page. An email will be sent to your registered
              address with instructions.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold">
              Can I update my account information?
            </h3>
            <p className="text-sm mt-2">
              Yes, you can update your account information in the "Account
              Settings" section after logging in.
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold">Is my data secure?</h3>
            <p className="text-sm mt-2">
              We prioritize your data security and use advanced encryption to
              ensure your information is safe.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Form */}
      <div className="max-w-6xl mx-auto bg-gray-100 py-12 px-4 sm:px-8">
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              rows="5"
              placeholder="Type your message here"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
