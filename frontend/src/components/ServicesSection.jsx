import { useState, useEffect, useRef } from 'react';
import '../styles/ServicesSection.css';

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: '/images/icon.png',
      name: 'Weight Loss',
      description: 'Weight loss can have causes that aren\'t due to underlying disease. Examples include dieting, exercise, malnutrition or lack of access to food.',
      bottomLeft: 'Service Name',
      bottomRight: 'Weight Loss',
    },
    {
      icon: '/images/icon.png',
      name: 'Classic Yoga',
      description: 'The term "yoga" in the Western world often denotes a modern form of Hatha yoga and a posture-based physical fitness, stress-relief.',
      bottomLeft: 'Service Name',
      bottomRight: 'Demo',
    },
    {
      icon: '/images/icon.png',
      name: 'Body Building',
      description: 'Bodybuilding is the use of progressive resistance exercise to control and develop one\'s muscles by muscle hypertrophy for aesthetic purposes.',
      bottomLeft: 'Service Name',
      bottomRight: 'Cardio',
    },
    {
      icon: '/images/icon.png',
      name: 'Musculation',
      description: 'Weight training is a common type of strength training for developing the strength, size of skeletal muscles and maintenance of strength.',
      bottomLeft: 'Service Name',
      bottomRight: 'Cardio',
    },
    {
      icon: '/images/icon.png',
      name: 'Fitness Running',
      description: 'Running is a method of terrestrial locomotion allowing humans and other animals to move rapidly on foot.',
      bottomLeft: 'Service Name',
      bottomRight: 'Cardio',
    },
  ];

  const progressWidth = ((activeIndex + 1) / services.length) * 100;

  return (
    <section className="services" ref={sectionRef} id="services">
      <div className={`services__content ${isVisible ? 'services__content--visible' : ''}`}>
        <div className="services__heading">
          <h2 className="services__title">
            <span className="services__title-white">READY FOR </span>
            <span className="services__title-gradient">SOME SWEATING</span>
          </h2>
          <p className="services__subtitle">One Hub. Infinite Disciplines. Zero Limits.</p>
        </div>

        <div className="services__cards-container">
          <div className="services__cards" ref={scrollRef}>
            {services.map((service, index) => (
              <div
                className={`services__card ${activeIndex === index ? 'services__card--active' : ''}`}
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="services__card-bg">
                  <img src="/images/rectangle.png" alt={service.name} />
                </div>
                <div className="services__card-content">
                  <div className="services__card-icon-wrapper">
                    <img src={service.icon} alt={service.name} className="services__card-icon" />
                    <h3 className="services__card-name">{service.name}</h3>
                  </div>
                  <p className="services__card-desc">{service.description}</p>
                </div>
                <div className="services__card-bottom">
                  <span className="services__card-bottom-left">{service.bottomLeft}</span>
                  <span className="services__card-bottom-right">{service.bottomRight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="services__progress">
          <div className="services__progress-line">
            <div
              className="services__progress-mark"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
