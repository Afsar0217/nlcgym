import { useState, useEffect } from 'react';
import '../../styles/CareerHero.css';

const CareerHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="career-hero">
      <div className="career-hero__bg">
        <img src="/images/career_herobg.jpg" alt="Gym Career Background" />
        <div className="career-hero__overlay"></div>
      </div>
      
      <div className={`career-hero__content ${isVisible ? 'visible' : ''}`}>
        <h1 className="career-hero__title">JOIN OUR TEAM</h1>
      </div>

      <div className="career-hero__scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

    </section>
  );
};

export default CareerHero;
