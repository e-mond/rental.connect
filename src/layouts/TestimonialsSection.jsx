import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import JetLeeImg from "../assets/Jet Lee.jpg";
import KofiKwameImg from "../assets/Kofi Kwame.jpg";
import StephImg from "../assets/Steph.jpg";
import HappyHomesLogo from "../assets/HappyHomes.jpg";
import LandmarkLogo from "../assets/Landmark.jpg";
import TrevlynLogo from "../assets/Trevlyn.jpg";

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
    <div className="bg-white text-black flex flex-col items-center py-12">
      <h2 className="text-3xl font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 -cols-3 gap-6 max-w-6xl w-fit p-4">
        <Slider
          {...sliderSettings}
          className="w-full p-4 bg-gray-100 rounded-xl shadow-lg"
        >
          {testimonials.map((testimonial, i) => (
            <div key={i} className="text-center p-6">
              <img
                src={testimonial.logo}
                alt="Company Logo"
                className="h-12 mx-auto mb-4"
              />
              <p className="text-xl italic text-gray-600 mb-6">{`"${testimonial.quote}"`}</p>
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mb-4 border-4 border-gray-300"
                />
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p className="text-gray-500 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TestimonialsSection;
