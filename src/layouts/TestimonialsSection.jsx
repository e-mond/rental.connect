
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const testimonials = [
//   {
//     logo: "Webflow",
//     quote:
//       "Using this platform has transformed my rental experience. I can easily communicate with my tenants and stay updated on everything.",
//     image: "https://via.placeholder.com/80",
//     name: "John Doe",
//     title: "Landlord, Property Group",
//   },
//   {
//     logo: "Airbnb",
//     quote:
//       "This service has been a game-changer for managing my rental properties. Highly recommended!",
//     image: "https://via.placeholder.com/80",
//     name: "Jane Smith",
//     title: "Property Manager, RentEase",
//   },
// ];

// const TestimonialsSection = () => {
//   return (
//     <div className="bg-white text-black flex flex-col items-center py-12">
//       <Swiper
//         modules={[Navigation, Pagination]}
//         navigation
//         pagination={{ clickable: true }}
//         spaceBetween={50}
//         slidesPerView={1}
//         className="w-full max-w-4xl"
//       >
//         {testimonials.map((testimonial, index) => (
//           <SwiperSlide key={index} className="text-center">
//             <img
//               src={testimonial.logo}
//               alt={testimonial.logo}
//               className="h-12 mx-auto mb-4"
//             />
//             <p className="text-xl italic text-gray-600 mb-6">{`"${testimonial.quote}"`}</p>
//             <div className="flex flex-col items-center">
//               <img
//                 src={testimonial.image}
//                 alt={testimonial.name}
//                 className="w-20 h-20 rounded-full mb-4"
//               />
//               <h4 className="font-bold text-lg">{testimonial.name}</h4>
//               <p className="text-gray-500 text-sm">{testimonial.title}</p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default TestimonialsSection;


// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// const testimonials = [
//   {
//     logo: "https://via.placeholder.com/100x50?text=Webflow", // Updated to include an image URL
//     quote:
//       "Using this platform has transformed my rental experience. I can easily communicate with my tenants and stay updated on everything.",
//     image: "https://via.placeholder.com/80", // Updated to a real image URL
//     name: "John Doe",
//     title: "Landlord, Property Group",
//   },
//   {
//     logo: "https://via.placeholder.com/100x50?text=Airbnb", // Updated to include an image URL
//     quote:
//       "This service has been a game-changer for managing my rental properties. Highly recommended!",
//     image: "https://via.placeholder.com/80", // Updated to a real image URL
//     name: "Jane Smith",
//     title: "Property Manager, RentEase",
//   },
// ];

// const TestimonialsSection = () => {
//   return (
//     <div className="bg-white text-black flex flex-col items-center py-12">
//       <Swiper
//         modules={[Navigation, Pagination]}
//         navigation
//         pagination={{ clickable: true }}
//         spaceBetween={50}
//         slidesPerView={1}
//         className="w-full max-w-4xl"
//       >
//         {testimonials.map((testimonial, index) => (
//           <SwiperSlide key={index} className="text-center">
//             <img
//               src={testimonial.logo}
//               alt={testimonial.logo}
//               className="h-12 mx-auto mb-4"
//             />
//             <p className="text-xl italic text-gray-600 mb-6">{`"${testimonial.quote}"`}</p>
//             <div className="flex flex-col items-center">
//               <img
//                 src={testimonial.image}
//                 alt={testimonial.name}
//                 className="w-20 h-20 rounded-full mb-4"
//               />
//               <h4 className="font-bold text-lg">{testimonial.name}</h4>
//               <p className="text-gray-500 text-sm">{testimonial.title}</p>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default TestimonialsSection;

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    logo: "https://via.placeholder.com/100x50?text=Webflow",
    quote:
      "Using this platform has transformed my rental experience. I can easily communicate with my tenants and stay updated on everything.",
    image: "https://via.placeholder.com/80",
    name: "John Doe",
    title: "Landlord, Property Group",
  },
  {
    logo: "https://via.placeholder.com/100x50?text=Airbnb",
    quote:
      "This service has been a game-changer for managing my rental properties. Highly recommended!",
    image: "https://via.placeholder.com/80",
    name: "Jane Smith",
    title: "Property Manager, RentEase",
  },
];

const TestimonialsSection = () => {
  const settings = {
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
      <Slider {...settings} className="w-full max-w-4xl">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="text-center p-6">
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
                className="w-20 h-20 rounded-full mb-4"
              />
              <h4 className="font-bold text-lg">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialsSection;
