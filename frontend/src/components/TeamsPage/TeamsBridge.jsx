import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/TeamsBridge.css';

const TeamsBridge = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="teams-bridge" ref={sectionRef}>
      <div className={`teams-bridge__content ${isVisible ? 'teams-bridge--visible' : ''}`}>
        <div className="teams-bridge__text-area">
          <h2 className="teams-bridge__title">
            FORGE A LIFE WITHOUT CEILINGS. THE ELITE HUB FOR TOTAL TRANSFORMATION.
          </h2>
          <p className="teams-bridge__subtext">
            At No Limits CrossFit, we aren't just a gym; we are a mindset recalibration center. From customized performance protocols to age-defying results, we prove that every body is capable of the extraordinary.
          </p>
        </div>

        <button className="cta-button teams-bridge__cta" onClick={() => navigate('/get-fit')}>
          <span>Start Your Transformation</span>
          <div className="cta-arrow">
            <span>→</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default TeamsBridge;
