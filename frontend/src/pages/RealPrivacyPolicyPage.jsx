import { useState, useEffect, useRef } from 'react';
import useSEO from '../hooks/useSEO';
import '../styles/PrivacyHero.css';
import '../styles/PrivacyContent.css';

const RealPrivacyHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="privacy-hero">
      <div className={`privacy-hero__content ${isVisible ? 'visible' : ''}`}>
        <h1 className="privacy-hero__title">Privacy Policy</h1>
        <div className="privacy-hero__meta">
          <p className="privacy-hero__last-updated">
            <strong>NO LIMITS CROSSFIT</strong> How we collect, use, and protect your information.
          </p>
        </div>
        <div className="privacy-hero__scroll">
           <div className="privacy-hero__scroll-indicator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 8.5L12 15.5L19 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
           </div>
        </div>
      </div>
    </section>
  );
};

const RealPrivacyContent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const privacyPoints = [
    { id: 1, text: 'We respect your privacy and are committed to protecting the personal information you share with us.', bold: true },
    { id: 2, text: 'Information Collection:', boldPhrase: 'Information Collection:', detail: 'We collect information such as your name, contact details (phone, email), and health/fitness data when you register or use our services.' },
    { id: 3, text: 'Use of Information:', boldPhrase: 'Use of Information:', detail: 'The information collected is used solely to provide gym services, communicate updates, process payments, and improve your fitness experience.' },
    { id: 4, text: 'Data Protection:', boldPhrase: 'Data Protection:', detail: 'We implement strict security measures to ensure your personal and payment information is kept safe and confidential.' },
    { id: 5, text: 'Third-Party Disclosure:', boldPhrase: 'Third-Party Disclosure:', detail: 'We do not sell, trade, or transfer your personal information to outside parties. This does not include trusted partners assisting in operating our website or business, as long as they agree to keep this information confidential.' },
    { id: 6, text: 'Consent:', boldPhrase: 'Consent:', detail: 'By using our facilities or website, you consent to our privacy policy.' },
    { id: 7, text: 'Changes to Policy:', boldPhrase: 'Changes to Policy:', detail: 'Management reserves the right to update or modify this privacy policy at any time. Members will be notified of significant changes.' },
  ];

  const renderTermText = (term) => {
    if (term.bold) {
      return <strong>{term.text}</strong>;
    }
    if (term.boldPhrase && term.detail) {
      return (
        <>
          <strong>{term.boldPhrase}</strong> {term.detail}
        </>
      );
    }
    return term.text;
  };

  return (
    <section className="privacy-content" ref={sectionRef}>
      <div className={`privacy-content__container ${isVisible ? 'visible' : ''}`}>
        <div className="privacy-section">
          <h2 className="privacy-section__title">Our Privacy Commitment</h2>
          <div className="privacy-section__content">
            <ol className="terms-list">
              {privacyPoints.map((term) => (
                <li key={term.id} className="terms-list__item">
                  <span className="terms-list__number">{String(term.id).padStart(2, '0')}</span>
                  <p className="terms-list__text">{renderTermText(term)}</p>
                </li>
              ))}
            </ol>
          </div>
          
          <div className="privacy-contact-box" style={{ marginTop: '40px' }}>
             <h2 className="privacy-section__title" style={{ marginBottom: '16px' }}>Contact Us</h2>
             <p>If you have any questions regarding this privacy policy, you may contact us using the information below:</p>
             <p><strong>Email:</strong> nolimitscrossfitgym@gmail.com</p>
             <p><strong>Phone:</strong> +91 77803 48640</p>
             <p><strong>Address:</strong> Plot No 792, beside RL City, opp. Bus Body Building, Mayuri Nagar, Nizampet, Miyapur, Hyderabad, Telangana 500049</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const RealPrivacyPolicyPage = () => {
  useSEO(
    "Privacy Policy | No Limits CrossFit",
    "Read the privacy policy for No Limits CrossFit gym in Hyderabad. Learn how we collect, use, and protect your personal information."
  );

  return (
    <div className="privacy-policy-page">
      <RealPrivacyHero />
      <div className="grudge-texture">
        <RealPrivacyContent />
      </div>
    </div>
  );
};

export default RealPrivacyPolicyPage;
