import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isIntroActive }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    // { name: 'Services', path: '/#services-section' },   // Hidden — client request
    { name: 'Wall of Fame', path: '/wall-of-fame' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Career', path: '/career' },
    // { name: 'Gallery', path: '/#gallery-section' }     // Hidden — client request
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isIntroActive ? 'navbar--hidden' : ''}`} id="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <img src="/images/nlc_logo.png" alt="No Limits CrossFit" />
        </Link>

        <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${mobileOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => {
            const isExternal = link.path.startsWith('/#');
            return isExternal ? (
              <a
                key={link.name}
                href={link.path}
                className="navbar__link"
                onClick={handleLinkClick}
              >
                {link.name}
              </a>
            ) : (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                onClick={handleLinkClick}
                end={link.path === '/'}
              >
                {link.name}
              </NavLink>
            );
          })}
          <Link to="/get-fit" className="navbar__cta-btn" onClick={handleLinkClick}>
            Get Fit <span className="navbar__cta-arrow">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



