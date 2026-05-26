import { useState, useEffect, useRef } from 'react';
import '../styles/LocationSection.css';

const LocationSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const location = {
    city: 'HYDERABAD',
    address: 'Plot no 792, beside Rl City, opp. Bus Body Building, Mayuri Nagar, Nizampet, Miyapur, Hyderabad, Telangana 500049',
    timings: '5am to 11am & 4:30pm to 9:30pm (Mon-Sat), 6:30pm to 8:30pm (Sun)',
    phone: '07780348640',
  };

  return (
    <section className="location" ref={sectionRef}>
      {/* Background */}
      <div className="location__bg">
        <img src="/images/home_location_bg.jpg" alt="Location background" />
        <div className="location__bg-overlay"></div>
      </div>

      <div className={`location__content ${isVisible ? 'location__content--visible' : ''}`}>
        {/* Map */}
        <div className="location__map" style={{ position: 'relative' }}>
          <a 
            href="https://maps.app.goo.gl/UgpVJY7ask4PLGoK9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="location__map-open-btn"
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              backgroundColor: '#FFFFFF',
              color: '#1a73e8',
              padding: '10px 16px',
              borderRadius: '8px',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            Open in Maps
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <iframe
            src="https://maps.google.com/maps?q=17.5145335,78.3727529&t=&z=17&ie=UTF8&iwloc=B&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Gym Location"
          ></iframe>
        </div>

        {/* Info */}
        <div className="location__info">
          {/* Location Toggle */}
          <div className="location__toggle" style={{ justifyContent: 'flex-start' }}>
            <div className="location__toggle-city">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <path d="M19 3.17C13.11 3.17 8.33 7.95 8.33 13.83C8.33 21.58 19 34.83 19 34.83C19 34.83 29.67 21.58 29.67 13.83C29.67 7.95 24.89 3.17 19 3.17Z" stroke="#DD3028" strokeWidth="2"/>
                <circle cx="19" cy="14" r="4" stroke="#DD3028" strokeWidth="2"/>
              </svg>
              <span className="location__city-name">{location.city}</span>
            </div>
          </div>

          {/* Address Details */}
          <div className="location__details">
            <div className="location__detail-group">
              <h3 className="location__detail-label">ADDRESS</h3>
              <p className="location__detail-value">{location.address}</p>
            </div>
            <div className="location__detail-group">
              <h3 className="location__detail-label">TIMINGS</h3>
              <p className="location__detail-value">{location.timings}</p>
            </div>
            <div className="location__detail-group">
              <h3 className="location__detail-label">CONTACT</h3>
              <p className="location__detail-value">{location.phone}</p>
            </div>
            <div className="location__detail-group">
              <h3 className="location__detail-label">EMAIL</h3>
              <p className="location__detail-value" style={{ textTransform: 'lowercase' }}>
                nolimitscrossfitgym@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
