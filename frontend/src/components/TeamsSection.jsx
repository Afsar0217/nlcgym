import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoaches, getCachedCoaches } from '../api';
import '../styles/TeamsSection.css';

const TeamsSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [trainers, setTrainers] = useState(getCachedCoaches()?.slice(0, 6) || []);
  const [loading, setLoading] = useState(!getCachedCoaches());
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await getCoaches();
        // Take the first 6 coaches for the homepage highlight
        setTrainers(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch coaches:', err);
        // Fallback to dummy data if API fails
        setTrainers([
          { name: 'Abhishek Goud', title: 'Experience Trainer', image_url: '/images/square.png' },
          { name: 'Sahil Goud', title: 'Transformation Expert', image_url: '/images/square.png' },
          { name: 'Rahul Verma', title: 'Elite Coach', image_url: '/images/square.png' },
          { name: 'Sneha Kapur', title: 'Nutritionist & Coach', image_url: '/images/square.png' },
          { name: 'Vikram Singh', title: 'Strength Coach', image_url: '/images/square.png' },
          { name: 'Ananya Rao', title: 'Yoga & Mobility', image_url: '/images/square.png' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleViewAll = () => {
    navigate('/team#coaches-list');
    // Ensure it scrolls to top of that section if already on page
    setTimeout(() => {
      const el = document.getElementById('coaches-list');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const row1 = trainers.slice(0, 3);
  const row2 = trainers.slice(3, 6);

  if (trainers.length === 0 && !loading) return null;

  return (
    <section className="teams" ref={sectionRef} id="team">
      <div className={`teams__content ${isVisible ? 'teams__content--visible' : ''}`}>
        {/* Header Area */}
        <div className="teams__header">
          <div className="teams__header-top">
            <span className="teams__badge">[ ELITE COACHING STAFF ]</span>
            <h2 className="teams__title gradient-text">
              THE ARCHITECTS OF YOUR TRANSFORMATION
            </h2>
          </div>
          
          <div className="teams__header-right">
            <p className="teams__description">
              Elite practitioners dedicated to your evolution. you never hit a ceiling. Precision coaching. Zero excuses
            </p>
            <div className="teams__view-all-wrapper">
              <button className="teams__view-all" onClick={handleViewAll}>View all →</button>
            </div>
          </div>
        </div>

        {/* Trainer Cards - Desktop View */}
        <div className="teams__cards-desktop">
          {trainers.map((trainer, index) => (
            <div className="teams__card" key={index}>
              <div className="teams__card-image">
                <img src={trainer.image_url || '/images/square.png'} alt={trainer.name} />
                <div className="teams__card-gradient-top"></div>
                <div className="teams__card-gradient-bottom"></div>
              </div>
              <div className="teams__card-text">
                <span className="teams__card-name">{trainer.name}</span>
                <span className="teams__card-role">{trainer.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trainer Cards - Mobile View (2 Rows) */}
        <div className="teams__cards-mobile">
          <div className="teams__row-wrapper">
            <div className="teams__cards-row">
              {row1.map((trainer, index) => (
                <div className="teams__card" key={index}>
                  <div className="teams__card-image">
                    <img src={trainer.image_url || '/images/square.png'} alt={trainer.name} />
                    <div className="teams__card-gradient-top"></div>
                    <div className="teams__card-gradient-bottom"></div>
                  </div>
                  <div className="teams__card-text">
                    <span className="teams__card-name">{trainer.name}</span>
                    <span className="teams__card-role">{trainer.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="teams__row-wrapper">
            <div className="teams__cards-row">
              {row2.map((trainer, index) => (
                <div className="teams__card" key={index}>
                  <div className="teams__card-image">
                    <img src={trainer.image_url || '/images/square.png'} alt={trainer.name} />
                    <div className="teams__card-gradient-top"></div>
                    <div className="teams__card-gradient-bottom"></div>
                  </div>
                  <div className="teams__card-text">
                    <span className="teams__card-name">{trainer.name}</span>
                    <span className="teams__card-role">{trainer.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply to Coach Card */}
        <div className="teams__apply" onClick={() => navigate('/career')} style={{ cursor: 'pointer' }}>
          <div className="teams__apply-arrow">↗</div>
          <h3 className="teams__apply-title">APPLY TO COACH</h3>
          <span className="teams__apply-subtitle">Scale Our Impact!</span>
        </div>

        {/* Mobile Swipe Hint */}
        <p className="teams__swipe-hint">←→ Swipe the cards</p>
      </div>
    </section>
  );
};


export default TeamsSection;
