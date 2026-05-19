import { useState, useEffect } from 'react';
import '../../styles/PrivacyHero.css';

const PrivacyHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="privacy-hero">
      <div className={`privacy-hero__content ${isVisible ? 'visible' : ''}`}>
        <h1 className="privacy-hero__title">Privacy Policy</h1>
        <div className="privacy-hero__meta">
          <p className="privacy-hero__last-updated">
            <strong>Last Updated: April 2026</strong> Your privacy is important to us. This policy explains how we handle your information when you use our website or join our hub.
          </p>
        </div>
        <div className="privacy-hero__scroll">
           <div className="privacy-hero__scroll-indicator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
        </div>

      </div>
    </section>
  );
};


export default PrivacyHero;
