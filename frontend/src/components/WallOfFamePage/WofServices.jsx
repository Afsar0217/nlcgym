import { useEffect, useRef, useState } from 'react';
import { getTransformations } from '../../api';
import '../../styles/WofServices.css';

const WofServices = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [transformations, setTransformations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  // Fetch transformations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransformations();
        setTransformations(data);
      } catch (err) {
        console.error('Failed to load transformations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading, transformations.length]);

  const goToSlide = (index) => {
    if (index >= 0 && index < transformations.length) {
      setCurrentIndex(index);
    }
  };

  const goPrev = () => goToSlide(currentIndex - 1);
  const goNext = () => goToSlide(currentIndex + 1);

  const current = transformations[currentIndex];

  if (loading) return null;
  if (transformations.length === 0) return null;

  return (
    <section className="wof-services" ref={sectionRef}>
      <div className={`wof-services__container ${isVisible ? 'wof-services--visible' : ''}`}>
        <div className="wof-services__header">
          <h2 className="wof-services__title">Real Transformations, Real Results</h2>
          <p className="wof-services__subtitle">
            This isn't about gym memberships; it's about the architectural shift from average to elite.
          </p>
          <div className="wof-services__divider"></div>
        </div>

        <div className="wof-services__card" key={current.id}>
          <div className="wof-services__card-img">
            <img src={current.image_url || '/images/rectangle.png'} alt={current.name} />
          </div>

          <div className="wof-services__card-content">
            <div className="wof-services__card-top">
              <h3 className="wof-services__athlete-name">{current.title}</h3>
              <div className="wof-services__card-line"></div>
              <div className="wof-services__stars">
                {[...Array(current.rating || 5)].map((_, i) => (
                  <svg key={i} width="22" height="22" viewBox="0 0 22 22">
                    <path d="M11 0L13.5 8H22L15.5 12.5L18 22L11 17L4 22L6.5 12.5L0 8H8.5L11 0Z" fill="url(#star_grad_wof)"/>
                  </svg>
                ))}
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="star_grad_wof" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#DD3028" />
                      <stop offset="100%" stopColor="#8F1510" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <p className="wof-services__transformation-desc">
              {current.description}
            </p>

            {current.metrics && (
              <div className="wof-services__metrics">
                <div className="wof-services__metric">
                  <span className="wof-services__metric-value">{current.metrics}</span>
                </div>
              </div>
            )}

            {current.review && (
              <div className="wof-services__quote">
                <div className="wof-services__quote-icon">
                  <svg width="29" height="26" viewBox="0 0 29 26" fill="rgba(241, 241, 241, 0.8)">
                    <path d="M8.47 0C3.79389 0 0 3.73642 0 8.34167V26H12.1V8.34167H4.84C4.84 6.36458 6.4625 4.76667 8.47 4.76667V0ZM25.41 0C20.7339 0 16.94 3.73642 16.94 8.34167V26H29V8.34167H21.78C21.78 6.36458 23.4025 4.76667 25.41 4.76667V0Z"/>
                  </svg>
                </div>
                <p className="wof-services__quote-text">
                  "{current.review}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {transformations.length > 1 && (
          <div className="wof-services__navigation">
            <button 
              className="wof-services__nav-btn wof-services__nav-btn--prev"
              onClick={goPrev}
              disabled={currentIndex === 0}
            >
              <span>←</span>
            </button>
            <div className="wof-services__pagination">
              {transformations.map((_, index) => (
                <span
                  key={index}
                  className={`wof-services__page-num ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <button 
              className="wof-services__nav-btn wof-services__nav-btn--next"
              onClick={goNext}
              disabled={currentIndex === transformations.length - 1}
            >
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WofServices;
