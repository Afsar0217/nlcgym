import { useState, useEffect, useRef } from 'react';
import '../styles/WhatsAppWidget.css';

const PHONE_NUMBER = '917780348640';
const DEFAULT_MESSAGE = 'Hi! I\'m interested in training at No Limits CrossFit. Can you share more details?';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef(null);

  // Show tooltip after 3 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    // Auto-hide tooltip after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 11000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleIconClick = () => {
    setShowTooltip(false);
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="wa-widget" ref={widgetRef}>

      {/* Tooltip Bubble */}
      {showTooltip && !isOpen && (
        <div className="wa-widget__tooltip" onClick={handleIconClick}>
          <span>Let's chat, we're human</span>
        </div>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="wa-widget__popup">
          {/* Header */}
          <div className="wa-widget__popup-header">
            <div className="wa-widget__popup-header-left">
              <img src="/images/whatsapp.png" alt="WhatsApp" className="wa-widget__popup-logo" />
              <span className="wa-widget__popup-title">WhatsApp</span>
            </div>
            <button
              className="wa-widget__popup-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="wa-widget__popup-body">
            <div className="wa-widget__popup-bubble">
              <p>Got any questions? Get in touch with our fitness team! 💪</p>
              <span className="wa-widget__popup-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="wa-widget__popup-footer">
            <button className="wa-widget__popup-cta" onClick={openChat}>
              <span>Open chat</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Icon */}
      <button
        className={`wa-widget__icon ${isOpen ? 'wa-widget__icon--open' : ''}`}
        onClick={handleIconClick}
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <img src="/images/whatsapp.png" alt="WhatsApp" className="wa-widget__icon-img" />
        )}
      </button>

    </div>
  );
};

export default WhatsAppWidget;
