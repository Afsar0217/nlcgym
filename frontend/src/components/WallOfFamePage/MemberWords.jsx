import { useEffect, useRef, useState } from 'react';
import '../../styles/MemberWords.css';

const MemberCard = ({ testimonial }) => {
  return (
    <div className="member-card">
      <div className="member-card__bg">
        <img src={testimonial.image} alt="Member" className="member-card__img" />
        <div className="member-card__overlay-main"></div>
        <div className="member-card__overlay-bottom"></div>
      </div>
      
      <div className="member-card__content">
        <div className={`member-card__quote-icon ${testimonial.gradient ? 'gradient' : ''}`}>
          <svg width="29" height="26" viewBox="0 0 29 26">
            <path d="M8.47 0C3.79389 0 0 3.73642 0 8.34167V26H12.1V8.34167H4.84C4.84 6.36458 6.4625 4.76667 8.47 4.76667V0ZM25.41 0C20.7339 0 16.94 3.73642 16.94 8.34167V26H29V8.34167H21.78C21.78 6.36458 23.4025 4.76667 25.41 4.76667V0Z" fill="currentColor"/>
          </svg>
        </div>
        <p className="member-card__text">{testimonial.text}</p>
        <p className="member-card__info">{testimonial.name}. {testimonial.location}</p>
      </div>
    </div>
  );
};

const MemberWords = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  const testimonials = [
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "From my first session to my first pull-up. every milestone felt like a massive celebration.",
      gradient: false
    },
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "Transforming my body was secondary to the mental shift I experienced here. Total elite mindset.",
      gradient: true
    },
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "The protocols and infrastructure at No Limits are on another level compared to anything else.",
      gradient: false
    },
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "I didn’t just lose weight; I gained a bulletproof engine and a new community.",
      gradient: true
    },
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "The architectural shift from average to elite is real. Highly recommended.",
      gradient: false
    },
    {
      name: "Name Here",
      location: "Hyderabad, IN",
      image: "/images/rectangle.png",
      text: "The most professional environment I've ever trained in. Results are a mathematical certainty.",
      gradient: true
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(progress);
      }
    };
    const carousel = carouselRef.current;
    if (carousel) carousel.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      if (carousel) carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="member-words" ref={sectionRef}>
      <div className={`member-words__container ${isVisible ? 'member-words--visible' : ''}`}>
        <div className="member-words__header">
          <h2 className="member-words__title">Member’s Words</h2>
          <div className="member-words__header-right">
            <span className="member-words__tag">[ TESTIMONIALS ]</span>
            <p className="member-words__header-desc">
              Real stories from people who showed up, put in the work, and changed their lives.
            </p>
          </div>
        </div>

        <div className="member-words__grid-wrapper">
          <div className="member-words__grid" ref={carouselRef}>
            {testimonials.map((t, i) => (
              <MemberCard key={i} testimonial={t} />
            ))}
          </div>
        </div>

        <div className="member-words__progress-container mobile-only">
          <div className="member-words__progress-line">
            <div 
              className="member-words__progress-mark" 
              style={{ left: `${Math.min(Math.max(scrollProgress, 0), 90)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberWords;
