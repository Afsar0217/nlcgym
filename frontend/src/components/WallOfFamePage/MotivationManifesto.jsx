import { useState, useEffect, useRef } from 'react';
import '../../styles/MotivationManifesto.css';

const MotivationManifesto = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const quotes = [
    {
      id: 1,
      quote: "FOCUS ON IMPROVING YOURSELF NOT PROVING YOURSELF",
      subText: "The only competition is the person in the mirror.",
      theme: "obsidian-gold",
      accent: "#DD3028"
    },
    {
      id: 2,
      quote: "SWEAT NOW SHINE LATER",
      subText: "Every drop of sweat is an investment in your future self.",
      theme: "caution-yellow",
      accent: "#FFB800"
    },
    {
      id: 3,
      quote: "PAIN ACTIVATES YOUR MIND AND YOUR BODY",
      subText: "Through physical resistance, we build mental resilience.",
      theme: "concrete-split",
      accent: "#FFFFFF"
    },
    {
      id: 4,
      quote: "WORK HARD IN SILENCE LET YOUR SUCCESS BE THE NOISE",
      subText: "No talk. No excuses. Just execution.",
      theme: "golden-stencil",
      accent: "#E29E25"
    },
    {
      id: 5,
      quote: "YOUR BODY CAN DO IT IT'S TIME TO CONVINCE YOUR MIND",
      subText: "The mind breaks long before the body does. Override it.",
      theme: "steel-distress",
      accent: "#8A8F98"
    },
    {
      id: 6,
      quote: "THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN",
      subText: "Show up. Even on your worst days, execution is victory.",
      theme: "charcoal-splatter",
      accent: "#DD3028"
    }
  ];

  return (
    <section className="motivation-manifesto" ref={sectionRef}>
      <div className={`motivation-manifesto__container ${isVisible ? 'motivation-manifesto--visible' : ''}`}>
        
        {/* Section Header */}
        <div className="motivation-manifesto__header">
          <span className="motivation-manifesto__tag">[ THE MANIFESTO // GYM VALUES ]</span>
          <h2 className="motivation-manifesto__title">
            BUILD THE MIND. <br />
            <span className="gradient-text">THE BODY WILL FOLLOW.</span>
          </h2>
          <p className="motivation-manifesto__desc">
            Physical strength is just a byproduct of mental conditioning. Our walls carry our values — absorb them, embrace the grind, and break your limits.
          </p>
        </div>

        {/* 3D Cards Grid */}
        <div className="motivation-manifesto__grid">
          {quotes.map((item, index) => (
            <div 
              key={item.id} 
              className={`motivation-card motivation-card--${item.theme}`}
              style={{ '--card-delay': `${index * 0.1}s`, '--accent-color': item.accent }}
            >
              {/* Overlay elements for premium styling */}
              <div className="motivation-card__grid-overlay"></div>
              <div className="motivation-card__grain-overlay"></div>
              
              {/* Geometric Corner Accents */}
              <div className="motivation-card__corner motivation-card__corner--tl"></div>
              <div className="motivation-card__corner motivation-card__corner--br"></div>

              {/* Card Content */}
              <div className="motivation-card__content">
                
                {/* SVG Graphics / Themes */}
                {item.theme === 'caution-yellow' && (
                  <div className="motivation-card__bg-graphic">
                    <svg viewBox="0 0 100 100" fill="none" opacity="0.04" width="120" height="120">
                      <rect x="45" y="10" width="10" height="80" fill="currentColor"/>
                      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="8"/>
                      <rect x="25" y="35" width="8" height="30" fill="currentColor"/>
                      <rect x="67" y="35" width="8" height="30" fill="currentColor"/>
                    </svg>
                  </div>
                )}
                
                {item.theme === 'obsidian-gold' && (
                  <div className="motivation-card__bg-graphic">
                    <svg viewBox="0 0 100 100" fill="none" opacity="0.03" width="130" height="130">
                      <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" stroke="currentColor" strokeWidth="2"/>
                      <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                )}

                {item.theme === 'concrete-split' && (
                  <div className="motivation-card__split-line"></div>
                )}

                {/* Main Quote Title */}
                <div className="motivation-card__quote-wrapper">
                  <h3 className="motivation-card__quote-text">
                    {item.quote}
                  </h3>
                </div>

                {/* Subtext description */}
                <div className="motivation-card__footer">
                  <div className="motivation-card__accent-bar"></div>
                  <p className="motivation-card__sub-text">
                    {item.subText}
                  </p>
                </div>

              </div>
              
              {/* Premium Glow effect on Hover */}
              <div className="motivation-card__laser-glow"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MotivationManifesto;
