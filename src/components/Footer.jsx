import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { useDarkMode } from "../hooks/useDarkMode";
import Button from "../components/Button"; // Import Button component

/**
 * Footer component for the application.
 * Displays subscription form, useful links, legal info, social media links, and contact information.
 * Visibility is controlled by the parent component (App.jsx) based on the current route.
 */
const Footer = () => {
  const { darkMode } = useDarkMode();

  return (
    <footer
      className={`py-10 border-t ${
        darkMode
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-white text-black border-gray-300"
      }`}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Subscription Section */}
        <div className="col-span-5 lg:col-span-2 space-y-2">
          <h3 className="text-lg font-semibold">Subscribe to updates</h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Stay informed about our latest news and offers.
          </p>
          <div
            className={`flex items-center border rounded-md overflow-hidden w-full lg:w-96 ${
              darkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <input
              type="email"
              placeholder="Your email here"
              className={`p-2 flex-1 outline-none ${
                darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-black"
              }`}
            />
            <Button
              variant="primary"
              className="px-6 py-2" // Match original padding
            >
              Join
            </Button>
          </div>
          <p className={darkMode ? "text-gray-500" : "text-gray-500"}>
            By subscribing, you accept our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Links Section */}
        <div className="col-span-5 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Useful Links */}
          <div>
            <h3 className="font-semibold mb-2">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div>
            <h3 className="font-semibold mb-2">Legal Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  User Agreement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-2">Get in Touch</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Call Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Live Chat
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Feedback
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={
                    darkMode
                      ? "text-gray-300 hover:text-gray-100"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  Newsletter Signup
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        className={`container mx-auto px-6 mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm ${
          darkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-300 text-gray-600"
        }`}
      >
        <p>© 2025 Rental Connects. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            Terms of Service
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            Cookie Settings
          </a>
        </div>
        <div className="flex gap-4 text-xl">
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            <FaLinkedin />
          </a>
          <a
            href="#"
            className={
              darkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
