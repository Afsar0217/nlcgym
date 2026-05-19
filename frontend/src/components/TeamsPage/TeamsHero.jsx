import { useEffect, useState } from 'react';
import '../../styles/TeamsHero.css';

const TeamsHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="teams-hero">
      <div className="teams-hero__bg">
        <div className="teams-hero__bg-overlay"></div>
        <img src="/images/teams_herobg.jpg" alt="Teams Hero" className="teams-hero__bg-img" />
      </div>

      <div className={`teams-hero__content ${isVisible ? 'teams-hero__content--visible' : ''}`}>
        <div className="teams-hero__about">
          <h1 className="teams-hero__title">ABOUT US</h1>
          <div className="teams-hero__arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.5 5L15.5 12L8.5 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="teams-hero__tagline">
          WE ARE THE ARCHITECTS OF THE EXTRAORDINARY
        </div>
      </div>

      <div className="teams-hero__scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};


export default TeamsHero;


