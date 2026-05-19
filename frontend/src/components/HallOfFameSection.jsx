import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTransformations } from '../api';
import '../styles/HallOfFameSection.css';
import '../styles/Skeleton.css';

/* Pre-defined layout positions — keeps cards randomly scattered but with safe spacing */
const LAYOUT_POSITIONS = [
  { top: 8,  left: 4,  size: 140, type: 'review', pos: 'top-right' },
  { top: 18, left: 24, size: 155, type: 'badge', badge: 'heart' },
  { top: 5,  left: 50, size: 130, type: 'review', pos: 'top-right' },
  { top: 22, left: 74, size: 145, type: 'badge', badge: 'like' },
  { top: 50, left: 8,  size: 135, type: 'badge', badge: 'heart' },
  { top: 42, left: 40, size: 150, type: 'review', pos: 'top-right' },
  { top: 55, left: 62, size: 130, type: 'badge', badge: 'like' },
  { top: 48, left: 85, size: 140, type: 'review', pos: 'top-right' },
];

const MOBILE_LAYOUT = [
  { top: 5,  left: 5,  size: 100, type: 'badge', badge: 'like', badgePos: 'bottom-right' },
  { top: 12, left: 50, size: 120, type: 'review', pos: 'top-right' },
  { top: 25, left: 20, size: 130, type: 'badge', badge: 'heart', badgePos: 'bottom-left' },
  { top: 45, left: 5,  size: 140, type: 'review', pos: 'top-right' },
  { top: 55, left: 55, size: 140, type: 'review', pos: 'bottom-left' },
  { top: 75, left: 15, size: 90,  type: 'badge', badge: 'like', badgePos: 'bottom-right' },
  { top: 80, left: 65, size: 90,  type: 'badge', badge: 'heart', badgePos: 'bottom-left' },
];

/* Truncate review text to first ~5 words */
function truncateReview(text, wordCount = 5) {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '....';
}

const HallOfFameSkeleton = ({ isMobile }) => {
  const layoutCount = isMobile ? 5 : 8;
  return (
    <>
      {[...Array(layoutCount)].map((_, i) => {
        const layout = isMobile ? MOBILE_LAYOUT[i] : LAYOUT_POSITIONS[i];
        return (
          <div 
            key={i}
            className="hall-of-fame__item skeleton skeleton-circle"
            style={{
              width: `${layout.size}px`,
              height: `${layout.size}px`,
              top: `${layout.top}%`,
              left: `${layout.left}%`,
              position: 'absolute'
            }}
          ></div>
        );
      })}
    </>
  );
};

const HallOfFameSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWallOfFamePage = location.pathname === '/wall-of-fame';
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const sectionRef = useRef(null);
  const mosaicRef = useRef(null);
  const cardRefs = useRef([]);
  const offsetsRef = useRef([]);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch reviews (8 for desktop, but we'll filter in render)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getTransformations();
        setReviews(data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const displayedReviews = isMobile ? reviews.slice(0, 5) : reviews;

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [reviews.length]);

  // Initialize offsets array
  useEffect(() => {
    offsetsRef.current = reviews.map(() => ({ x: 0, y: 0 }));
  }, [reviews]);

  // Magnetic repulsion animation loop
  const animateRepulsion = useCallback(() => {
    const mosaic = mosaicRef.current;
    if (!mosaic || cardRefs.current.length === 0 || loading) return;

    const rect = mosaic.getBoundingClientRect();
    const mx = mouseRef.current.x - rect.left;
    const my = mouseRef.current.y - rect.top;

    const REPEL_RADIUS = 200;
    const REPEL_STRENGTH = 40;
    const EASE = 0.08;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cx = cardRect.left - rect.left + cardRect.width / 2;
      const cy = cardRect.top - rect.top + cardRect.height / 2;

      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = 0;
      let targetY = 0;

      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        targetX = (dx / dist) * force;
        targetY = (dy / dist) * force;
      }

      const current = offsetsRef.current[i] || { x: 0, y: 0 };
      current.x += (targetX - current.x) * EASE;
      current.y += (targetY - current.y) * EASE;
      offsetsRef.current[i] = current;

      card.style.transform = `translate(${current.x}px, ${current.y}px)`;
    });

    rafRef.current = requestAnimationFrame(animateRepulsion);
  }, [loading]);

  // Start/stop animation loop
  useEffect(() => {
    if (isVisible && reviews.length > 0 && !loading) {
      rafRef.current = requestAnimationFrame(animateRepulsion);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, reviews.length, animateRepulsion, loading]);

  // Track mouse
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return; // Disable on mobile for better performance
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <section className="hall-of-fame" ref={sectionRef} id="wall-of-fame">
      <h2 className="hall-of-fame__title gradient-text">WALL OF FAME</h2>

      <div
        className={`hall-of-fame__mosaic ${isVisible ? 'hall-of-fame__mosaic--visible' : ''}`}
        ref={mosaicRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <HallOfFameSkeleton isMobile={isMobile} />
        ) : (
          displayedReviews.map((item, index) => {
            const layout = isMobile 
              ? (MOBILE_LAYOUT[index] || MOBILE_LAYOUT[0])
              : (LAYOUT_POSITIONS[index] || LAYOUT_POSITIONS[0]);
            
            const snippet = truncateReview(item.review);

            return (
              <div
                className="hall-of-fame__item"
                key={item.id}
                ref={el => cardRefs.current[index] = el}
                style={{
                  width: `${layout.size}px`,
                  height: `${layout.size}px`,
                  top: `${layout.top}%`,
                  left: `${layout.left}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <img
                  src={item.image_url || '/images/square.png'}
                  alt={item.name}
                  className="hall-of-fame__img"
                />

                {layout.type === 'badge' && (
                  <div className={`hall-of-fame__badge hall-of-fame__badge--${layout.badge} hall-of-fame__badge--${layout.badgePos}`}>
                    {layout.badge === 'heart' ? (
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="#F64560">
                        <path d="M9 15.5s-7-4.5-7-9.5C2 3 4 1 6.5 1S9 3 9 3s0.5-2 2.5-2S16 3 16 6c0 5-7 9.5-7 9.5z"/>
                      </svg>
                    ) : (
                      <svg width="15" height="14" viewBox="0 0 15 14" fill="#003964">
                        <path d="M4.5 14H1.5C0.67 14 0 13.33 0 12.5V7C0 6.17 0.67 5.5 1.5 5.5H4.5V14ZM4.5 5.5L7.5 0.5C8.33 0.5 9.5 1 9.5 2.5V4.5H13C13.83 4.5 14.5 5.17 14.5 6V7.5L12.5 13C12.3 13.6 11.7 14 11 14H4.5V5.5Z"/>
                      </svg>
                    )}
                  </div>
                )}

                {layout.type === 'review' && snippet && (
                  <div className={`hall-of-fame__review hall-of-fame__review--${layout.pos}`}>
                    <div className="hall-of-fame__stars">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="url(#starGrad)">
                          <defs>
                            <linearGradient id="starGrad" x1="0" y1="0" x2="13" y2="0">
                              <stop offset="0%" stopColor="#DD3028"/>
                              <stop offset="100%" stopColor="#8F1510"/>
                            </linearGradient>
                          </defs>
                          <path d="M6.5 0L8 4.5H13L9 7.5L10.5 12L6.5 9L2.5 12L4 7.5L0 4.5H5L6.5 0Z"/>
                        </svg>
                      ))}
                    </div>
                    <p className="hall-of-fame__review-text">{snippet}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="hall-of-fame__body">
        Proof that the only limit is the one you accept. From 65-year-old milestones to elite physical resets, these are the high-performance journeys that define the No Limits mindset. Real transformations. Real results.
      </p>

      {!isWallOfFamePage && (
        <div className="hall-of-fame__cta-wrapper">
          <button className="cta-button" onClick={() => navigate('/wall-of-fame')}>
            <span>View all</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default HallOfFameSection;
