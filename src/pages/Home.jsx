import Header from "../components/Header";
import Features from "../layouts/Features"; // Import Features from layouts
import Notifications from "../layouts/Notifications"; 
import RentalTerms from "../layouts/RentalTerms";
import RentalExperienceSection from "../layouts/RentalExperienceSection"; 
import TestimonialsSection from "../layouts/TestimonialsSection"
import CommunitySection from "../layouts/CommunitySection"; 


const Home = () => {
  return (
    <div>
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
