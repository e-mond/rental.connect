import Header from "../layouts/Header";
import Features from "../layouts/Features";
import Notifications from "../layouts/Notifications";
import RentalTerms from "../layouts/RentalTerms";
import RentalExperienceSection from "../layouts/RentalExperienceSection";
import TestimonialsSection from "../layouts/TestimonialsSection";
import CommunitySection from "../layouts/CommunitySection";
import { useDarkMode } from "../hooks/useDarkMode";


const Home = () => {
  const { darkMode } = useDarkMode(); // Access dark mode state

  return (
    <div
      className={darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-black"}
    >
      <Header />
      <Features />
      <Notifications />
      <RentalExperienceSection />
      <RentalTerms />
      <TestimonialsSection />
      <CommunitySection />
    </div>
  );
};

export default Home;
