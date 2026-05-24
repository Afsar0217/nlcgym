import { useState, useEffect, useRef } from 'react';
import '../../styles/TeamPhilosophy.css';

const TeamPhilosophy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="team-philosophy" ref={sectionRef}>
      <div className={`team-philosophy__content ${isVisible ? 'team-philosophy__content--visible' : ''}`}>

        <div className="team-philosophy__header">
          <span className="team-philosophy__badge">[ OUR PHILOSOPHY ]</span>
          <h2 className="team-philosophy__title gradient-text">
            FITNESS IS A TEAM EFFORT
          </h2>
        </div>

        <div className="team-philosophy__body">
          <div className="team-philosophy__card">
            <div className="team-philosophy__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <p>
              At No Limits CrossFit, fitness is not treated as an individual process handled by one trainer alone — it is a <strong>complete team effort</strong> focused on helping the client achieve long-term sustainable results.
            </p>
          </div>

          <div className="team-philosophy__card">
            <div className="team-philosophy__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <p>
              We also guide clients on <strong>stress management, proper recovery, sleep, and rest</strong> because we believe transformation happens only when workout, diet, and recovery work together scientifically.
            </p>
          </div>

          <div className="team-philosophy__card">
            <div className="team-philosophy__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <p>
              Apart from offline training at our gym, we also provide <strong>online training programs</strong> with personalized workout plans, diet guidance, progress tracking, and continuous team support for clients who want to train remotely.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TeamPhilosophy;
