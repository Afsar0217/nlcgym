import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/GallerySection.css';

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const images = [
    { 
      id: 0, 
      src: '/images/home_g1.jpg', 
      alt: 'Strength training',
      heading: 'IRON\nWILL.',
      text: 'Every rep is a brick in the foundation of your new self. Build with precision.'
    },
    { 
      id: 1, 
      src: '/images/home_g2.jpg', 
      alt: 'Main gym view',
      heading: 'FROM\nTHE\nFIRST SQUAT\nTO\nFOREVER.',
      text: 'This is an elite community dedicated to recalibrating what you believe is possible. Welcome to the transformation hub.'
    },
    { 
      id: 2, 
      src: '/images/home_g3.jpg', 
      alt: 'Yoga area',
      heading: 'FORGE\nYOUR\nCENTER.',
      text: 'Balance is not something you find, it is something you create. Forge your center.'
    },
    { 
      id: 3, 
      src: '/images/home_g4.jpg', 
      alt: 'Community space',
      heading: 'NO\nLIMITS.\nNO\nCEILINGS.',
      text: 'No one climbs alone. At No Limits, the community is the fuel for your fire.'
    },
  ];

  // Pre-load all gallery images immediately so they're ready on click
  useEffect(() => {
    images.forEach(img => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0, rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="gallery" ref={sectionRef} id="gallery">
      <div className={`gallery__carousel ${isVisible ? 'gallery__carousel--visible' : ''}`}>
        {images.map((img, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={img.id}
              className={`gallery__item ${isActive ? 'gallery__item--main' : 'gallery__item--small'} ${index === 3 ? 'desktop-only' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={img.src} alt={img.alt} loading="eager" />
              
              {/* Overlay is always in DOM — toggled via CSS opacity for smooth transition */}
              <div className={`gallery__main-overlay ${isActive ? 'gallery__main-overlay--visible' : ''}`}>
                <div className="gallery__overlay-content">
                  <h3 className="gallery__main-title" style={{ whiteSpace: 'pre-line' }}>
                    {img.heading}
                  </h3>
                </div>
                <div className="gallery__text-stack">
                  <p className="gallery__text">{img.text}</p>
                  <Link to="/get-fit" className="gallery__link">Join the movement →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GallerySection;
