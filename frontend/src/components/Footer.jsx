import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Footer.css';


const Footer = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const location = useLocation();

  // Pages where the 2 big CTA boxes should appear
  const showCtaArea = location.pathname === '/' || location.pathname === '/wall-of-fame';

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

  const footerLinks = [
    { name: 'Team', path: '/team' },
    { name: 'Wall of Fame', path: '/wall-of-fame' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Career', path: '/career' }
  ];

  const isTeamsPage = location.pathname === '/team';

  // Visibility logic for Explore Success Banner
  const isHome = location.pathname === '/';
  const isTeams = location.pathname === '/team';
  const isCareer = location.pathname === '/career';
  const isPrivacy = location.pathname === '/privacy-policy';

  const showExploreDesktop = isHome || isTeams;
  const showExploreMobile = isHome || isTeams || isCareer || isPrivacy;

  return (
    <footer className={`footer ${isTeamsPage ? 'footer--teams' : ''}`} ref={sectionRef}>

      {/* CTA Cards Area - Shown only on Home and Wall of Fame */}
      {showCtaArea && (
        <div className={`footer__cta-area ${isVisible ? 'footer__cta-area--visible' : ''}`}>
          {/* Left Card */}
          <div className="footer__cta-card-left">
            <div className="footer__cta-card-text-top">
              <h3 className="footer__cta-heading">THE NEW STANDARD.</h3>
              <span className="footer__cta-sub">The extraordinary starts here.</span>
            </div>
            <div className="footer__cta-system">
              <span className="footer__cta-label-bold">01 // THE SYSTEM</span>
              <span className="footer__cta-label-muted">ELITE COACHING AND CUSTOM PROTOCOLS</span>
            </div>
            <div className="footer__cta-system">
              <span className="footer__cta-label-bold">02 // THE RESULT</span>
              <span className="footer__cta-label-muted">DATA-DRIVEN TRANSFORMATION</span>
            </div>
            <div className="footer__cta-bullets">
              <span>→ TRAIN WITHOUT LIMITS</span>
              <span>→ RECODE YOUR MINDSET</span>
              <span>→ ACCESS THE INFRASTRUCTURE</span>
              <span>→ JOIN THE ELITE</span>
            </div>
            <p className="footer__cta-evolution">THAT'S WHY<br /><strong>EVOLUTION<br />MATTERS</strong></p>
            <button className="cta-button footer__cta-btn" onClick={() => navigate('/get-fit')}>
              <span>Start Your Transformation</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>

          {/* Right Card - Image */}
          <div className="footer__cta-card-right">
            <img src="/images/home_footer.jpg" alt="Gym atmosphere" className="footer__cta-img" />
            <div className="footer__cta-logo-overlay">
              <img src="/images/nlc_logo.png" alt="No Limits CrossFit" />
            </div>
          </div>
        </div>
      )}

      {/* Footer Content */}
      <div className="footer__main">
        {/* Logo + Links side by side on mobile */}
        <div className="footer__main-top">
          <div className="footer__logo">
            <img src="/images/nlc_logo.png" alt="No Limits CrossFit" />
          </div>
          <div className="footer__links">
            {footerLinks.map((link) => (
              <Link key={link.name} to={link.path} className="footer__link">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer__contact-info">
          <div className="footer__contact-col footer__contact-col--left">
            <div className="footer__contact-group">
              <span className="footer__contact-label">Contact Us</span>
              <span className="footer__contact-value">07780348640</span>
            </div>
            <div className="footer__contact-group">
              <span className="footer__contact-label">Location</span>
              <span className="footer__contact-value footer__contact-address">
                Plot no 792, beside Rl City, opp. Bus Body Building, Mayuri Nagar, Nizampet, Miyapur, Hyderabad, Telangana 500049
              </span>
            </div>
            <div className="footer__contact-group">
              <span className="footer__contact-label">Timings</span>
              <span className="footer__contact-value">
                5am to 11am & 4:30pm to 9:30pm (Mon-Sat)<br />
                6:30pm to 8:30pm (Sun)
              </span>
            </div>
          </div>
          <div className="footer__contact-col footer__contact-col--right">
            <div className="footer__contact-group">
              <span className="footer__contact-label">Email</span>
              <a href="mailto:nolimitscrossfitgym@gmail.com" className="footer__contact-value footer__contact-email">
                nolimitscrossfitgym@gmail.com
              </a>
            </div>
          </div>
        </div>


        {/* Bottom Section */}
        <div className="footer__bottom-section">
          <div className="footer__bottom-row">
            <div className="footer__go-top" onClick={scrollToTop}>
              <div className="footer__go-top-circle">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                  <path d="M6 13V1M6 1L1 6M6 1L11 6" stroke="#ECEEEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="footer__go-top-text">Go to top</span>
            </div>
            <div className="footer__bottom">
              <span className="footer__copyright">© 2026 — Copyright</span>
              <Link to="/privacy-policy" className="footer__privacy">Private Policy</Link>
            </div>

          </div>
        </div>
      </div>

      {/* Explore Success Banner */}
      {(showExploreDesktop || showExploreMobile) && (
        <div 
          className={`footer__explore-banner ${!showExploreDesktop ? 'footer__explore--mobile-only' : ''} ${!showExploreMobile ? 'footer__explore--desktop-only' : ''}`}
          onClick={() => navigate('/wall-of-fame')}
          style={{ cursor: 'pointer' }}
        >
          <div className="footer__explore-inner">
            <span className="footer__explore-text">Explore our success</span>
            <span className="footer__explore-arrow">↗</span>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
