import { useEffect, useRef, useState } from 'react';
import '../../styles/TeamsAbout.css';

const TeamsAbout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="teams-about" ref={sectionRef}>
      <div className={`teams-about__container ${isVisible ? 'teams-about--visible' : ''}`}>
        {/* Intro Text Block */}
        <div className="teams-about__intro">
          No Limits is a specialized transformation hub engineered for those who demand more from their physical and mental performance. We have replaced the generic gym model with an elite ecosystem of data-driven protocols and expert coaching. Whether you are seeking a complete lifestyle recalibration or peak athletic refinement, we provide the infrastructure and accountability to ensure your results are a mathematical certainty. This is where the evolution begins.
        </div>

        <div className="teams-about__founder-area">
          <div className="teams-about__divider"></div>
          
          <div className="teams-about__content-grid">
            {/* Founder Card */}
            <div className="teams-about__founder-card">
              <div className="teams-about__founder-img">
                <img src="/images/nlc_logo2.png" alt="Founder" />
              </div>
              <div className="teams-about__founder-info">
                <span className="teams-about__founder-name">Abhishek Goud</span>
                <span className="teams-about__founder-title">FOUNDER / OWNER</span>
              </div>
            </div>

            {/* Quote Block */}
            <div className="teams-about__quote-block">
              <div className="teams-about__quote-icon">
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
                  <path d="M12.8333 0C5.74833 0 0 5.74833 0 12.8333V40H18.3333V12.8333H7.33333C7.33333 9.79167 9.79167 7.33333 12.8333 7.33333V0ZM38.5 0C31.415 0 25.6667 5.74833 25.6667 12.8333V40H44V12.8333H33C33 9.79167 35.4583 7.33333 38.5 7.33333V0Z" fill="url(#quote_gradient)"/>
                  <defs>
                    <linearGradient id="quote_gradient" x1="0" y1="20" x2="44" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#DD3028"/>
                      <stop offset="1" stopColor="#8F1510"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="teams-about__quote-text">
                No Limits was built to replace the broken fitness model. We don’t just provide a space; we provide the elite infrastructure for your evolution. If you bring the intent, we provide the results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamsAbout;


