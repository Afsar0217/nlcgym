import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform, animate } from 'framer-motion';
import '../styles/MetricsSection1.css';

const Counter = ({ value, suffix = "+" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  const count = useSpring(0, {
    duration: 1500, // Faster counting
    bounce: 0,
    stiffness: 60, 
    damping: 20
  });

  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      count.set(value);
    }
  }, [inView, value, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const MetricsSection1 = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const cardWidth = scrollRef.current.children[0]?.offsetWidth || 357;
        const gap = 34;
        const index = Math.round(scrollLeft / (cardWidth + gap));
        setActiveSlide(Math.min(index, 2));
      }
    };
    const ref = scrollRef.current;
    if (ref) ref.addEventListener('scroll', handleScroll);
    return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
  }, []);

  const metrics = [
    { icon: '/images/icon.png', value: 35, suffix: '+', label: 'Certified Coaches' },
    { icon: '/images/icon.png', value: 7, suffix: '+', label: 'Registered Gyms' },
    { icon: '/images/icon.png', value: 427, suffix: '+', label: 'Members Trained' },
  ];

  return (
    <section className="metrics1" ref={sectionRef} id="metrics">
      <div className="metrics1__bg-texture"></div>
      <div className="metrics1__cards" ref={scrollRef}>
        {metrics.map((metric, index) => (
          <div
            className={`metrics1__card ${isVisible ? 'metrics1__card--visible' : ''}`}
            key={index}
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            <div className="metrics1__card-top">
              <img src={metric.icon} alt={metric.label} className="metrics1__card-icon" />
            </div>
            <div className="metrics1__card-body">
              <span className="metrics1__card-number">
                <Counter value={metric.value} suffix={metric.suffix} />
              </span>
              <span className="metrics1__card-label">{metric.label}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile dot pagination */}
      <div className="metrics1__dots">
        {metrics.map((_, index) => (
          <span
            key={index}
            className={`metrics1__dot ${activeSlide === index ? 'metrics1__dot--active' : ''}`}
            onClick={() => {
              if (scrollRef.current) {
                const cardWidth = scrollRef.current.children[0]?.offsetWidth || 357;
                scrollRef.current.scrollTo({ left: index * (cardWidth + 34), behavior: 'smooth' });
              }
            }}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default MetricsSection1;
