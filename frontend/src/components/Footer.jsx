import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('miyapur');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Branch data
  const branches = {
    miyapur: {
      name: 'Miyapur Center (Head Office)',
      address: 'Plot no 792, beside Rl City, opp. Bus Body Building, Mayuri Nagar, Nizampet, Miyapur, Hyderabad, Telangana 500049',
      phone: '+91 77803 48640',
      email: 'nolimitscrossfitgym@gmail.com',
      mapUrl: 'https://maps.google.com/maps?q=Plot+no+792,+Mayuri+Nagar,+Nizampet,+Miyapur,+Hyderabad,+Telangana&t=&z=16&ie=UTF8&iwloc=B&output=embed',
      directLink: 'https://maps.app.goo.gl/UgpVJY7ask4PLGoK9'
    },
    gachibowli: {
      name: 'Gachibowli Center (Coming Soon)',
      address: 'Financial District, Gachibowli, Hyderabad, Telangana (Location mapping in progress)',
      phone: '+91 77803 48640',
      email: 'nolimitscrossfitgym@gmail.com',
      mapUrl: '', // Show custom visual card
      directLink: ''
    }
  };

  const currentBranch = branches[selectedBranch];

  return (
    <footer className="footer" ref={sectionRef}>
      <div className={`footer__container ${isVisible ? 'footer--visible' : ''}`}>
        
        {/* ================= LOCATE US CARD SECTION ================= */}
        <div className="footer__locate-card">
          <div className="footer__locate-layout">
            
            {/* Map Area */}
            <div className="footer__map-col">
              {currentBranch.mapUrl ? (
                <div className="footer__map-wrapper">
                  <iframe
                    src={currentBranch.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={currentBranch.name}
                    className="footer__map-iframe"
                  ></iframe>
                  <a 
                    href={currentBranch.directLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer__map-btn"
                  >
                    Open in Google Maps
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
              ) : (
                <div className="footer__map-placeholder">
                  <div className="footer__placeholder-glow"></div>
                  <div className="footer__placeholder-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DD3028" strokeWidth="1.5">
                      <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <h3>Gachibowli Launching Soon</h3>
                    <p>Pre-registrations and center designs are currently in progress. Stay tuned for Hyderabad's ultimate training upgrade.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Locate Us Info */}
            <div className="footer__locate-info">
              <h2 className="footer__locate-title">Locate Us</h2>
              
              {/* Branch Selector Dropdown */}
              <div className="footer__selector-wrapper">
                <select 
                  className="footer__branch-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="miyapur">Miyapur (Head Office)</option>
                  <option value="gachibowli">Gachibowli (Coming Soon)</option>
                </select>
                <div className="footer__select-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Branch Details */}
              <div className="footer__branch-details">
                {/* Address */}
                <div className="footer__detail-item">
                  <div className="footer__detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DD3028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="footer__detail-texts">
                    <h4>{selectedBranch === 'miyapur' ? 'Head Office' : 'Gachibowli Branch'}</h4>
                    <p>{currentBranch.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="footer__detail-item">
                  <div className="footer__detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DD3028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="footer__detail-texts">
                    <h4>Phone Number</h4>
                    <p>{currentBranch.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="footer__detail-item">
                  <div className="footer__detail-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DD3028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="footer__detail-texts">
                    <h4>Email</h4>
                    <p style={{ textTransform: 'lowercase' }}>{currentBranch.email}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= MAIN FOOTER SECTION ================= */}
        <div className="footer__main-grid">
          
          {/* Col 1: Branding & Social */}
          <div className="footer__brand-col">
            <div className="footer__logo-box" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
              <img src="/images/nlc_logo.png" alt="No Limits CrossFit Logo" className="footer__brand-logo" />
            </div>
            <div className="footer__brand-contacts">
              <a href="tel:+917780348640" className="footer__brand-link">+91 77803 48640</a>
              <a href="mailto:nolimitscrossfitgym@gmail.com" className="footer__brand-link" style={{ textTransform: 'lowercase' }}>
                nolimitscrossfitgym@gmail.com
              </a>
            </div>
            
            {/* Social Icons */}
            <div className="footer__socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="footer__social-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="footer__social-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="footer__social-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer__social-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links 1 */}
          <div className="footer__links-col">
            <h4 className="footer__links-header">Who We Are</h4>
            <div className="footer__links-list">
              <Link to="/team" className="footer__links-item">Our Team</Link>
              <Link to="/wall-of-fame" className="footer__links-item">Success Stories</Link>
              <Link to="/career" className="footer__links-item">Join Our Team</Link>
              <Link to="/terms-and-conditions" className="footer__links-item">Terms & Conditions</Link>
            </div>
          </div>

          {/* Col 3: Navigation Links 2 */}
          <div className="footer__links-col">
            <h4 className="footer__links-header">Ecosystem</h4>
            <div className="footer__links-list">
              <Link to="/get-fit" className="footer__links-item">Start Transformation</Link>
              <Link to="/blogs" className="footer__links-item">Read Blogs</Link>
              <Link to="/" className="footer__links-item" onClick={() => {
                setTimeout(() => {
                  const element = document.getElementById('faq');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}>Help & FAQ's</Link>
              <Link to="/get-fit" className="footer__links-item">Contact Us</Link>
            </div>
          </div>

          {/* Col 4: Blog Newsletter Subscription */}
          <div className="footer__subscribe-col">
            <h4 className="footer__links-header">Subscribe to our BLOG</h4>
            <p className="footer__subscribe-desc">Stay updated with the latest in performance science, metabolic training, and nutritional protocols.</p>
            
            <form onSubmit={handleSubscribe} className="footer__subscribe-form">
              <div className="footer__input-wrapper">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer__subscribe-input"
                  required
                />
                <button type="submit" className="footer__subscribe-btn">
                  <span>Send</span>
                </button>
              </div>
            </form>
            
            {subscribed && (
              <span className="footer__subscribe-success">
                ✓ Thank you! You've been subscribed.
              </span>
            )}
          </div>

        </div>

        {/* ================= COPYRIGHT SECTION ================= */}
        <div className="footer__copyright-bar">
          <span className="footer__copyright-text">
            © {new Date().getFullYear()} No Limits CrossFit. All rights reserved.
          </span>
          
          <div className="footer__go-top-circle" onClick={scrollToTop} title="Scroll to top">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
              <path d="M6 13V1M6 1L1 6M6 1L11 6" stroke="#ECEEEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
