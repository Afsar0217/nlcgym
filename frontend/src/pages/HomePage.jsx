import { useEffect, useState } from 'react';
import CinematicIntro from '../components/CinematicIntro';
import HeroSection from '../components/HeroSection';
import MetricsSection1 from '../components/MetricsSection1';
import MetricsSection2 from '../components/MetricsSection2';
// import ServicesSection from '../components/ServicesSection';   // Hidden — client request
import BridgeSection from '../components/BridgeSection';
import GallerySection from '../components/GallerySection';
import TeamsSection from '../components/TeamsSection';
// import PlansSection from '../components/PlansSection';
import GoogleReviewsSection from '../components/GoogleReviewsSection';
import LocationSection from '../components/LocationSection';
import HallOfFameSection from '../components/HallOfFameSection';
import BlogSection from '../components/BlogSection';
import FAQSection from '../components/FAQSection';
import useSEO from '../hooks/useSEO';

const HomePage = ({ showIntro, isIntroFinished, onIntroComplete }) => {
  useSEO(
    "No Limits CrossFit | Best Gym & Fitness Center in Nizampet, Hyderabad",
    "Join No Limits CrossFit, the best gym and fitness center in Nizampet, Miyapur, Hyderabad. Expert coaching, personalized training, weight loss, and elite fitness programs."
  );

  return (
    <>
      {/* The Cinematic Curtain */}
      {showIntro && (
        <CinematicIntro 
          onComplete={onIntroComplete} 
        />
      )}

      <div className={`app-content-wrapper ${isIntroFinished ? 'app-content--active' : ''}`}>
        <HeroSection />
        <div className="grudge-texture">
          <MetricsSection1 />
          <MetricsSection2 />
          {/* <ServicesSection /> Hidden — client request */}
          <BridgeSection />
          <GallerySection />
          <TeamsSection />
          {/* <PlansSection /> Hidden as per client request, replaced by Google Reviews */}
          <GoogleReviewsSection />
          <LocationSection />
          <HallOfFameSection />
          <BlogSection />
          <FAQSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
