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
        <div className="teams-about__layout">
          
          {/* Left Column - Logo/Visual Branding */}
          <div className="teams-about__left-col">
            <div className="teams-about__sticky-wrapper">
              <div className="teams-about__logo-container">
                <img src="/images/nlc_logo2.png" alt="No Limits CrossFit Logo" className="teams-about__logo-img" />
              </div>
              <div className="teams-about__branding">
                <span className="teams-about__brand-title">NO LIMITS CROSSFIT</span>
                <span className="teams-about__brand-subtitle">ESTD 2025 | HYDERABAD</span>
              </div>
            </div>
          </div>

          {/* Right Column - Rich Content Area */}
          <div className="teams-about__right-col">
            <span className="teams-about__badge">[ ABOUT US ]</span>
            <h2 className="teams-about__heading gradient-text">WE TRAIN BEYOND AVERAGE</h2>
            
            <div className="teams-about__body-content">
              <p className="teams-about__lead-paragraph">
                At No Limits CrossFit, we are not a commercial gym focused only on memberships and machines. We are a results-driven functional training and transformation center in Mayurinagar, Miyapur, Hyderabad, built around personal attention, scientific training, and real human coaching.
              </p>

              <p>
                We believe fitness is not just about lifting weights — it is about learning the right posture, proper form, correct techniques, recovery, nutrition, and consistency. Unlike many gyms that depend completely on AI-generated workout plans and automated diets, we believe in the power of human response, real coaching, and personalized guidance.
              </p>

              <p>
                Every client at <strong>No Limits CrossFit</strong> is treated with individual attention. Even our general training members receive proper guidance for workouts, posture correction, exercise techniques, and scientific diet counselling from our team without compromising on quality.
              </p>

              {/* Assessment Sub-section */}
              <div className="teams-about__sub-section">
                <h3 className="teams-about__sub-heading">Scientific Physical Assessment</h3>
                <p>Before starting any program, we conduct a complete <strong>physical assessment</strong> including:</p>
                
                <ul className="teams-about__list">
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">01</span>
                    <div>
                      <strong>Strength Testing:</strong>
                      <span className="teams-about__list-desc">Measuring core and structural power capacities.</span>
                    </div>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">02</span>
                    <div>
                      <strong>Endurance Analysis:</strong>
                      <span className="teams-about__list-desc">Testing metabolic conditioning levels and aerobic ceilings.</span>
                    </div>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">03</span>
                    <div>
                      <strong>Flexibility Assessment:</strong>
                      <span className="teams-about__list-desc">Mapping joint range-of-motion to identify structural imbalances.</span>
                    </div>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">04</span>
                    <div>
                      <strong>Body Composition Analysis:</strong>
                      <span className="teams-about__list-desc">Evaluating muscle mass, fat distribution, and physical baseline.</span>
                    </div>
                  </li>
                </ul>

                <p className="teams-about__sub-note">
                  Based on the client’s goals, lifestyle, body condition, and daily routine, customized workout and diet plans are prepared. Our diet plans are practical, sustainable, and designed according to the client’s regular food habits without disturbing their daily activities.
                </p>
              </div>

              {/* Personal Training Sub-section */}
              <div className="teams-about__sub-section">
                <h3 className="teams-about__sub-heading">PT Accountability & Team Support</h3>
                <p>
                  For our personal training clients, we provide complete team-based follow-up and accountability. Dedicated WhatsApp groups are created for every personal training client where trainers, programmers, and diet consultants work together as a team to monitor:
                </p>

                <ul className="teams-about__list teams-about__list--two-col">
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">✓</span>
                    <span>Daily workouts are monitored</span>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">✓</span>
                    <span>Diet meal images are reviewed</span>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">✓</span>
                    <span>Progress is tracked regularly</span>
                  </li>
                  <li className="teams-about__list-item">
                    <span className="teams-about__list-bullet">✓</span>
                    <span>Doubts are cleared instantly</span>
                  </li>
                </ul>
              </div>

              <div className="teams-about__philosophy-box">
                <p>
                  At No Limits CrossFit, fitness is not treated as an individual process handled by one trainer alone — it is a complete team effort focused on helping the client achieve long-term sustainable results.
                </p>
                <p>
                  We also guide clients on stress management, proper recovery, sleep, and rest because we believe transformation happens only when workout, diet, and recovery work together scientifically.
                </p>
              </div>

              <div className="teams-about__footer-tagline">
                <p className="teams-about__built-for">No Limits CrossFit is built for you.</p>
                
                <div className="teams-about__quote-callout">
                  <p className="teams-about__quote-callout-text">
                    “We believe there are No Limits, so we train beyond average.”
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TeamsAbout;
