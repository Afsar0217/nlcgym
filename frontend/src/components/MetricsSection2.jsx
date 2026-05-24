import { useEffect, useRef } from 'react';
import '../styles/MetricsSection2.css';

const cards = [
  {
    subtitle: 'No Limits',
    description: 'An elite community dedicated to recalibrating what you believe is possible.',
    metric: 'Elite',
    metricLabel: 'Branded Equipment',
    image: '/images/home_ms1.jpg',
    imageHeight: '369px',
  },
  {
    subtitle: 'No Limits',
    description: 'Certified coaches and world-class facilities crafted for total human transformation.',
    metric: '100%',
    metricLabel: 'Quality',
    image: '/images/home_ms2.jpeg',
    imageHeight: '306px',
  },
  {
    subtitle: 'No Limits',
    description: 'Thousands of members have walked through our doors and never looked back.',
    metric: '1.2K',
    metricLabel: 'Plus Visitors',
    image: '/images/home_ms3.jpeg',
    imageHeight: '215px',
  },
];

// Pre-load images at module level — runs once, immediately when the JS file is parsed
cards.forEach(card => {
  const img = new Image();
  img.src = card.image;
});

const MetricsSection2 = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('metrics2--visible');
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0, rootMargin: '300px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="metrics2" ref={sectionRef}>
      <div className="metrics2__content">
        <div className="metrics2__heading">
          <h2 className="metrics2__title">Reality, Recalibrated</h2>
        </div>
        <div className="metrics2__cards">
          {cards.map((card, index) => (
            <div className="metrics2__card-wrapper" key={index}>
              <div className="metrics2__card-divider"></div>
              <div className="metrics2__card">
                <div className="metrics2__card-text-stack">
                  <div className="metrics2__card-text">
                    <span className="metrics2__card-subtitle">{card.subtitle}</span>
                    <p className="metrics2__card-desc">{card.description}</p>
                  </div>
                  <div className="metrics2__card-metric">
                    <span className="metrics2__card-metric-number">{card.metric}</span>
                    <span className="metrics2__card-metric-label">{card.metricLabel}</span>
                  </div>
                </div>
                <div className="metrics2__card-image" style={{ height: card.imageHeight }}>
                  <img src={card.image} alt={card.metricLabel} loading="eager" decoding="async" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection2;
