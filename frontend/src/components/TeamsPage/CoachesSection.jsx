import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoaches, getCachedCoaches } from '../../api';
import '../../styles/CoachesSection.css';
import '../../styles/Skeleton.css';

/* ─── Coach Detail Popup ─────────────────────────────── */
const CoachPopup = ({ coach, onClose }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const startFormatted = formatDate(coach.start_date);
  const endFormatted = formatDate(coach.end_date) || 'Present';
  const tenureText = startFormatted ? `${startFormatted} — ${endFormatted}` : null;

  return (
    <div className="coach-popup-overlay" onClick={onClose}>
      <div className="coach-popup" onClick={e => e.stopPropagation()}>
        <button className="coach-popup__close" onClick={onClose}>×</button>
        
        <div className="coach-popup__layout">
          {/* Left: Image */}
          <div className="coach-popup__image-section">
            <img 
              src={coach.image_url || '/images/square.png'} 
              alt={coach.name} 
              className="coach-popup__image" 
            />
          </div>

          {/* Right: Details */}
          <div className="coach-popup__details">
            <div className="coach-popup__header">
              <h2 className="coach-popup__name">{coach.name}</h2>
              <p className="coach-popup__title">{coach.title}</p>
              {tenureText && (
                <span className="coach-popup__tenure">{tenureText}</span>
              )}
            </div>

            <div className="coach-popup__divider"></div>

            {/* Metrics Row */}
            <div className="coach-popup__metrics">
              {coach.specialty && (
                <div className="coach-popup__metric-item">
                  <span className="coach-popup__metric-label">Specialty</span>
                  <span className="coach-popup__metric-value">{coach.specialty}</span>
                </div>
              )}
              {coach.transformations && (
                <div className="coach-popup__metric-item">
                  <span className="coach-popup__metric-label">Transformations</span>
                  <span className="coach-popup__metric-value">{coach.transformations}</span>
                </div>
              )}
              {coach.hours && (
                <div className="coach-popup__metric-item">
                  <span className="coach-popup__metric-label">Hours</span>
                  <span className="coach-popup__metric-value">{coach.hours}</span>
                </div>
              )}
            </div>

            <div className="coach-popup__divider"></div>

            {/* Bio */}
            <div className="coach-popup__bio-section">
              <h4 className="coach-popup__bio-heading">About</h4>
              <p className="coach-popup__bio-text">
                {coach.bio || coach.description || 'No additional information available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Trainer Card ────────────────────────────────────── */
const TrainerCard = ({ trainer, onViewProfile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMoreClick = (e) => {
    e.stopPropagation();
    onViewProfile(trainer);
  };

  return (
    <div 
      className={`trainer-card ${isFlipped ? 'trainer-card--flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className="trainer-card__inner">
        {/* Front Side */}
        <div className="trainer-card__front">
          <div className="trainer-card__img-container">
            <img src={trainer.image_url || '/images/square.png'} alt={trainer.name} className="trainer-card__img" />
            <div className="trainer-card__overlay-top"></div>
            <div className="trainer-card__overlay-bottom"></div>
          </div>
          <div className="trainer-card__info-front">
            <h3 className="trainer-card__name">{trainer.name}</h3>
            <p className="trainer-card__title">{trainer.title}</p>
          </div>
        </div>

        {/* Back Side */}
        <div className="trainer-card__back">
          <div className="trainer-card__back-content">
            <div className="trainer-card__back-header">
              <h3 className="trainer-card__back-name">{trainer.name}</h3>
              <div className="trainer-card__back-divider"></div>
            </div>

            <div className="trainer-card__metrics">
              <div className="trainer-card__metric">
                <span className="trainer-card__metric-value">{trainer.transformations}</span>
                <span className="trainer-card__metric-label">Transformations</span>
              </div>
              <div className="trainer-card__metric">
                <span className="trainer-card__metric-value">{trainer.hours}</span>
                <span className="trainer-card__metric-label">Hours</span>
              </div>
            </div>

            <div className="trainer-card__experience">
              <div className="trainer-card__exp-header">
                <span className="trainer-card__exp-title">Experience - {trainer.specialty}</span>
                <div className="trainer-card__exp-divider"></div>
              </div>
              <p className="trainer-card__exp-desc">{trainer.description}</p>
            </div>

            {/* More Button */}
            <button className="trainer-card__more-btn" onClick={handleMoreClick}>
              View Profile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Coaches Skeleton ────────────────────────────────── */
const CoachesSkeleton = () => {
  return (
    <div className="coaches__grid">
      {[1, 2, 3, 4].map((id) => (
        <div key={id} className="trainer-card skeleton" style={{ height: '400px', minWidth: '300px' }}></div>
      ))}
    </div>
  );
};

/* ─── Coaches Section ─────────────────────────────────── */
const CoachesSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [coaches, setCoaches] = useState(getCachedCoaches() || []);
  const [loading, setLoading] = useState(!getCachedCoaches());
  const [selectedCoach, setSelectedCoach] = useState(null);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  // Fetch coaches from API
  useEffect(() => {
    if (!getCachedCoaches()) {
      const fetchCoaches = async () => {
        try {
          const data = await getCoaches();
          setCoaches(data);
        } catch (err) {
          console.error('Failed to load coaches:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchCoaches();
    }
  }, []);

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
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
    }

    return () => {
      observer.disconnect();
      if (carousel) carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <section className="coaches-section" ref={sectionRef} id="coaches-list">
        <div className={`coaches-container ${isVisible ? 'coaches--visible' : ''}`}>
          <div className="coaches__header">
            <h2 className="coaches__title">Meet The Coaches</h2>
          </div>

          <div className="coaches__swipe-hint mobile-only">
            <span>←&gt; Swipe the cards</span>
          </div>

          <div className="coaches__carousel-wrapper">
            {loading ? (
              <CoachesSkeleton />
            ) : (
              <div className="coaches__grid" ref={carouselRef}>
                {coaches.map((coach, index) => (
                  <TrainerCard 
                    key={index} 
                    trainer={coach} 
                    onViewProfile={setSelectedCoach}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="coaches__progress-container mobile-only">
            <div className="coaches__progress-line">
              <div 
                className="coaches__progress-mark" 
                style={{ left: `${Math.min(Math.max(scrollProgress, 0), 90)}%` }}
              ></div>
            </div>
          </div>

          <div className="coaches__apply-section">
            <div className="coaches__apply" onClick={() => navigate('/career')} style={{ cursor: 'pointer' }}>
              <div className="coaches__apply-arrow">↗</div>
              <h3 className="coaches__apply-title">APPLY TO COACH</h3>
              <span className="coaches__apply-subtitle">Scale Our Impact!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Detail Popup */}
      {selectedCoach && (
        <CoachPopup 
          coach={selectedCoach} 
          onClose={() => setSelectedCoach(null)} 
        />
      )}
    </>
  );
};

export default CoachesSection;
