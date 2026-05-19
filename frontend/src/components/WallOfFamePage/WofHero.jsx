import { useEffect, useState } from 'react';
import '../../styles/WofHero.css';

const WofHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="wof-hero">
      <div className="wof-hero__bg">
        <div className="wof-hero__bg-overlay"></div>
        <img src="/images/wof_herobg.jpg" alt="Wall of Fame Hero" className="wof-hero__bg-img" />
      </div>

      <div className={`wof-hero__content ${isVisible ? 'wof-hero__content--visible' : ''}`}>
        <div className="wof-hero__header">
          <h1 className="wof-hero__title">WALL OF FAME</h1>
          <div className="wof-hero__arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.5 5L15.5 12L8.5 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="wof-hero__tagline">
          A record of those who refused to settle
        </div>
      </div>

      <div className="wof-hero__scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

    </section>
  );
};

export default WofHero;
