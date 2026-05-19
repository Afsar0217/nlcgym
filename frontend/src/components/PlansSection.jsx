import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PlansSection.css';

const PlansSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0, rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Pre-load all plan backgrounds immediately
  useEffect(() => {
    plans.forEach(plan => {
      const image = new Image();
      image.src = plan.bgImage;
    });
  }, []);

  const plans = [
    {
      name: 'Gym Membership',
      tagline: 'Full access to our world-class training floor.',
      durations: ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'],
      bgImage: '/images/plan_bg1.jpg'
    },
    {
      name: 'Personal Training',
      tagline: 'Diamond Package — One-on-one coaching with certified elite trainers.',
      durations: ['Monthly', 'Quarterly', 'Half Yearly'],
      bgImage: '/images/plan_bg2.jpg'
    },
    {
      name: 'Personal Training',
      tagline: 'Premium Package — Intensive personal sessions for maximum results.',
      durations: ['Monthly', 'Quarterly'],
      bgImage: '/images/plan_bg3.jpg'
    },
    {
      name: 'Special Population Training',
      tagline: 'Tailored programs for unique health needs & rehabilitation goals.',
      durations: ['Monthly', '2 Months', '3 Months'],
      bgImage: '/images/plan_bg4.jpg'
    },
    {
      name: 'Couple & Buddy Package',
      tagline: 'Train together, transform together. Shared goals, shared gains.',
      durations: ['Half Yearly', 'Yearly'],
      bgImage: '/images/plan_bg5.jpg'
    },
    {
      name: 'Students Package',
      tagline: 'Exclusive rates for students committed to peak performance.',
      durations: ['Quarterly', 'Half Yearly', 'Yearly'],
      bgImage: '/images/plan_bg6.jpg'
    },
    {
      name: 'Transformation Package',
      tagline: 'Our most intensive program — a full-body & mindset reset.',
      durations: ['3 + 1 Month'],
      bgImage: '/images/plan_bg7.jpg'
    },
  ];

  const navigate = (direction) => {
    setCurrentPlan((prev) => (prev + direction + plans.length) % plans.length);
  };

  const plan = plans[currentPlan];

  return (
    <section className="plans" ref={sectionRef} id="plans">
      <div className={`plans__wrapper ${isVisible ? 'plans__wrapper--visible' : ''}`}>
        {/* Background Image */}
        <div className="plans__bg">
          {plans.map((p, index) => (
            <img 
              key={index}
              src={p.bgImage} 
              alt={`Fitness background ${index + 1}`}
              loading="eager" 
              className={index === currentPlan ? 'plans__bg-img--active' : ''}
            />
          ))}
          <div className="plans__bg-overlay"></div>
        </div>

        {/* Plan Card */}
        <div className="plans__card">
          <div className="plans__card-header">
            <span className="plans__card-membership">Membership</span>
          </div>
          <div className="plans__card-body">
            <div className="plans__card-pricing">
              <h3 className="plans__card-plan-name">{plan.name}</h3>
              <p className="plans__card-tagline">{plan.tagline}</p>
            </div>
            <div className="plans__card-divider"></div>
            <div className="plans__card-features">
              {plan.durations.map((duration, i) => (
                <div className="plans__card-feature" key={i}>
                  <span className="plans__card-feature-text">{duration}</span>
                  <span className="plans__card-feature-dash">—</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#000000" strokeWidth="1.5"/>
                    <path d="M6 10L9 13L14 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
            <div className="plans__card-divider"></div>
            {/* Plan counter */}
            <div className="plans__card-counter">
              {plans.map((_, i) => (
                <span
                  key={i}
                  className={`plans__card-dot ${i === currentPlan ? 'plans__card-dot--active' : ''}`}
                  onClick={() => setCurrentPlan(i)}
                />
              ))}
            </div>
            <div className="plans__card-cta">
              <Link to="/get-fit" className="cta-button plans__card-cta-btn">
                <span>Let's Get Fit</span>
                <span className="cta-arrow">→</span>
              </Link>
              <span className="plans__card-terms">Terms and conditions apply*</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="plans__text-content">
          <h2 className="plans__title">
            Crushing your fitness &amp; health goals starts here!
          </h2>
          <div className="plans__arrows">
            <button
              className="plans__arrow plans__arrow--left"
              onClick={() => navigate(-1)}
              aria-label="Previous plan"
            >
              ←
            </button>
            <button
              className="plans__arrow plans__arrow--right"
              onClick={() => navigate(1)}
              aria-label="Next plan"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;

