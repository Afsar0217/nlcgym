import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const heroImages = [
    '/images/rectangle.png',
    '/images/home_bg2.jpg',
    '/images/home_bg4.jpg',
    '/images/home_bg5.jpg'
  ];

  const [activeImage, setActiveImage] = useState(heroImages[0]);

  return (
    <section className="hero-section" id="home">
      {/* Background Image with Gradient Overlay */}
      <div className="hero-section__bg">
        <AnimatePresence initial={false}>
          <motion.img 
            key={activeImage}
            src={activeImage} 
            alt="Gym interior" 
            className="hero-section__bg-img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </AnimatePresence>
        <div className="hero-section__bg-overlay"></div>
      </div>

      {/* Hero Content Card */}
      <div className="hero-section__content">
        <h1 className="hero-section__title">
          REWRITE THE LAWS OF YOUR LIMITS
        </h1>
        <Link to="/get-fit" className="hero-section__cta cta-button">
          <span>Start Your Transformation</span>
          <span className="cta-arrow">→</span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="hero-section__bottom">
        <p className="hero-section__tagline">
          Recalibrate Your Standard Of Strength. At No Limits, We Turn 'impossible' Into A Starting Line Through Personalized Elite Training And A Community Forged In Change.
        </p>

        <div className="hero-section__video-frames">
          {heroImages.map((img, index) => (
            <div 
              key={index}
              className={`hero-section__frame ${activeImage === img ? 'hero-section__frame--active' : ''}`}
              onClick={() => setActiveImage(img)}
              style={{ cursor: 'pointer' }}
            >
              <img src={img} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-section__scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
