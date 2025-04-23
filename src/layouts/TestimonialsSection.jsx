import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import JetLeeImg from "../assets/Jet Lee.jpg";
import KofiKwameImg from "../assets/Kofi Kwame.jpg";
import StephImg from "../assets/Steph.jpg";
import HappyHomesLogo from "../assets/HappyHomes.jpg";
import LandmarkLogo from "../assets/Landmark.jpg";
import TrevlynLogo from "../assets/Trevlyn.jpg";
import { useDarkMode } from "../hooks/useDarkMode";
 // Import useDarkMode

const testimonials = [
  {
    logo: TrevlynLogo,
    quote:
      "Using this platform has transformed my rental experience. I can easily communicate with my tenants and stay updated on everything.",
    image: KofiKwameImg,
    name: "Kofi Kwame",
    title: "Landlord, Trevlyn Estates",
  },
  {
    logo: LandmarkLogo,
    quote:
      "This service has been a game-changer for managing my rental properties. Highly recommended!",
    image: StephImg,
    name: "Stephanie R. Smith",
    title: "Property Manager, Landmark Homes Ghana",
  },
  {
    logo: HappyHomesLogo,
    quote:
      "An intuitive and reliable platform that makes renting easier than ever!",
    image: JetLeeImg,
    name: "Jet Lee",
    title: "Tenant, Happy Homes",
  },
];

const TestimonialsSection = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div
      className={`flex flex-col items-center py-12 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"
      }`}
    >
      <h2 className="text-3xl font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 -cols-3 gap-6 max-w-6xl w-fit p-4">
        <Slider
          {...sliderSettings}
          className={`w-full p-4 rounded-xl shadow-lg ${
            darkMode
              ? "bg-gray-800 shadow-gray-700"
              : "bg-gray-100 shadow-gray-300"
          }`}
        >
          {testimonials.map((testimonial, i) => (
            <div key={i} className="text-center p-6">
              <img
                src={testimonial.logo}
                alt="Company Logo"
                className="h-12 mx-auto mb-4"
              />
              <p
                className={`text-xl italic mb-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >{`"${testimonial.quote}"`}</p>
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={`w-20 h-20 rounded-full mb-4 border-4 ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                />
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TestimonialsSection;
