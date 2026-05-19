import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BridgeSection.css';

const BridgeSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { 
        threshold: 0,
        rootMargin: '200px' // Start loading 200px before it hits the screen
      }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bridge" ref={sectionRef}>
      <div className={`bridge__content ${isVisible ? 'bridge__content--visible' : ''}`}>
        <h2 className="bridge__title gradient-text">
          FORGE A LIFE WITHOUT CEILINGS. THE ELITE HUB FOR TOTAL TRANSFORMATION.
        </h2>
        <p className="bridge__text">
          At No Limits CrossFit, we aren't just a gym; we are a mindset recalibration center. From customized performance protocols to age-defying results, we prove that every body is capable of the extraordinary.
        </p>

        {/* Mobile-only Transformation Button */}
        <div className="bridge__cta-wrapper mobile-only">
          <button className="cta-button bridge__cta" onClick={() => navigate('/get-fit')}>
            <span>Start Your Transformation</span>
            <div className="cta-arrow">
              <span>→</span>
            </div>
          </button>
        </div>
      </div>

    </section>
  );
};

export default BridgeSection;
