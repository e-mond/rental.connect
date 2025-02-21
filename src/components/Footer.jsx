// import { Link } from "react-router-dom";
// import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="bg-black text-white py-8">
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
//         {/* Logo & Subscription */}
//         <div>
//           <h2 className="text-2xl font-bold">Logo</h2>
//           <p className="mt-2 text-gray-400">
//             Stay informed about our latest news and offers.
//           </p>
//           <div className="mt-4 flex">
//             <input
//               type="email"
//               placeholder="Your email"
//               className="p-2 rounded-l bg-gray-800 text-white w-full focus:outline-none"
//             />
//             <button className="bg-primary px-4 py-2 rounded-r">Join</button>
//           </div>
//         </div>

//         {/* Useful Links */}
//         <div>
//           <h3 className="text-lg font-semibold">Useful Links</h3>
//           <ul className="mt-2 text-gray-400 space-y-2">
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/about">About Us</Link>
//             </li>
//             <li>
//               <Link to="/contact">Contact</Link>
//             </li>
//             <li>
//               <Link to="/faq">FAQ</Link>
//             </li>
//           </ul>
//         </div>

//         {/* Legal & Policies */}
//         <div>
//           <h3 className="text-lg font-semibold">Legal</h3>
//           <ul className="mt-2 text-gray-400 space-y-2">
//             <li>
//               <Link to="/privacy-policy">Privacy Policy</Link>
//             </li>
//             <li>
//               <Link to="/terms-of-service">Terms of Service</Link>
//             </li>
//             <li>
//               <Link to="/cookie-policy">Cookie Policy</Link>
//             </li>
//           </ul>
//         </div>

//         {/* Social Media */}
//         <div>
//           <h3 className="text-lg font-semibold">Follow Us</h3>
//           <div className="flex space-x-4 mt-2">
//             <a href="#" className="hover:text-primary">
//               <Facebook />
//             </a>
//             <a href="#" className="hover:text-primary">
//               <Twitter />
//             </a>
//             <a href="#" className="hover:text-primary">
//               <Instagram />
//             </a>
//             <a href="#" className="hover:text-primary">
//               <Linkedin />
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Footer */}
//       <div className="text-center text-gray-500 mt-8">
//         <p>© 2025 Rental Review. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// import {
//   FaFacebookF,
//   FaInstagram,
//   FaTwitter,
//   FaLinkedin,
//   FaYoutube,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-white text-black py-10 border-t border-gray-300">
//       <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//         {/* Logo */}
//         <div className="col-span-1">
//           <h2 className="text-2xl font-bold">Logo</h2>
//         </div>

//         {/* Useful Links */}
//         <div>
//           <h3 className="font-semibold mb-2">Useful Links</h3>
//           <ul className="space-y-2 text-sm">
//             <li>
//               <a href="#">About Us</a>
//             </li>
//             <li>
//               <a href="#">Contact Us</a>
//             </li>
//             <li>
//               <a href="#">FAQs</a>
//             </li>
//             <li>
//               <a href="#">Blog</a>
//             </li>
//             <li>
//               <a href="#">Support</a>
//             </li>
//           </ul>
//         </div>

//         {/* Legal Info */}
//         <div>
//           <h3 className="font-semibold mb-2">Legal Info</h3>
//           <ul className="space-y-2 text-sm">
//             <li>
//               <a href="#">Privacy Policy</a>
//             </li>
//             <li>
//               <a href="#">Terms of Use</a>
//             </li>
//             <li>
//               <a href="#">User Agreement</a>
//             </li>
//             <li>
//               <a href="#">Cookie Policy</a>
//             </li>
//             <li>
//               <a href="#">Community Guidelines</a>
//             </li>
//           </ul>
//         </div>

//         {/* Follow Us */}
//         <div>
//           <h3 className="font-semibold mb-2">Follow Us</h3>
//           <ul className="space-y-2 text-sm">
//             <li>
//               <a href="#">Facebook</a>
//             </li>
//             <li>
//               <a href="#">Twitter</a>
//             </li>
//             <li>
//               <a href="#">Instagram</a>
//             </li>
//             <li>
//               <a href="#">LinkedIn</a>
//             </li>
//             <li>
//               <a href="#">YouTube</a>
//             </li>
//           </ul>
//         </div>

//         {/* Get in Touch */}
//         <div>
//           <h3 className="font-semibold mb-2">Get in Touch</h3>
//           <ul className="space-y-2 text-sm">
//             <li>
//               <a href="#">Email Us</a>
//             </li>
//             <li>
//               <a href="#">Call Us</a>
//             </li>
//             <li>
//               <a href="#">Live Chat</a>
//             </li>
//             <li>
//               <a href="#">Feedback</a>
//             </li>
//             <li>
//               <a href="#">Newsletter Signup</a>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Newsletter Section */}
//       <div className="container mx-auto px-6 mt-8 text-center md:text-left">
//         <h3 className="text-lg font-semibold">Subscribe to updates</h3>
//         <p className="text-sm text-gray-600">
//           Stay informed about our latest news and offers.
//         </p>
//         <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
//           <input
//             type="email"
//             placeholder="Your email here"
//             className="border border-gray-300 p-2 rounded-md w-full md:w-auto"
//           />
//           <button className="bg-black text-white px-6 py-2 rounded-md">
//             Join
//           </button>
//         </div>
//         <p className="text-xs text-gray-500 mt-2">
//           By subscribing, you accept our{" "}
//           <a href="#" className="underline">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>

//       {/* Bottom Section */}
//       <div className="container mx-auto px-6 mt-8 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
//         <p>© 2024 Rental Review. All rights reserved.</p>
//         <div className="flex gap-4">
//           <a href="#" className="hover:underline">
//             Privacy Policy
//           </a>
//           <a href="#" className="hover:underline">
//             Terms of Service
//           </a>
//           <a href="#" className="hover:underline">
//             Cookie Settings
//           </a>
//         </div>
//         <div className="flex gap-4 text-xl">
//           <FaFacebookF />
//           <FaInstagram />
//           <FaTwitter />
//           <FaLinkedin />
//           <FaYoutube />
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-white text-black py-10 border-t border-gray-300">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Subscription Section */}
        <div className="col-span-5 lg:col-span-2 space-y-2">
          <h3 className="text-lg font-semibold">Subscribe to updates</h3>
          <p className="text-sm text-gray-600">
            Stay informed about our latest news and offers.
          </p>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full lg:w-96">
            <input
              type="email"
              placeholder="Your email here"
              className="p-2 flex-1 outline-none"
            />
            <button className="bg-black text-white px-6 py-2">Join</button>
          </div>
          <p className="text-xs text-gray-500">
            By subscribing, you accept our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Links Section */}
        <div className="col-span-5 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Useful Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Use</a>
              </li>
              <li>
                <a href="#">User Agreement</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Community Guidelines</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
              <li>
                <a href="#">YouTube</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Get in Touch</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#">Email Us</a>
              </li>
              <li>
                <a href="#">Call Us</a>
              </li>
              <li>
                <a href="#">Live Chat</a>
              </li>
              <li>
                <a href="#">Feedback</a>
              </li>
              <li>
                <a href="#">Newsletter Signup</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-6 mt-8 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>© 2024 Rental Review. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Cookie Settings
          </a>
        </div>
        <div className="flex gap-4 text-xl">
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
          <FaLinkedin />
          <FaYoutube />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
