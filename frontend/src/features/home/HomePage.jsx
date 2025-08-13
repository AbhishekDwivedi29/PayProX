// features/home/HomePage.jsx
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import HomeNav from "../../components/HomeNav";
export default function HomePage() {
  return (
    <div>
      <HomeNav/>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}