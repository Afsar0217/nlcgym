import { useState, useEffect, useRef } from 'react';
import '../../styles/PrivacyContent.css';

const PrivacySection = ({ title, content }) => {
  return (
    <div className="privacy-section">
      <h2 className="privacy-section__title">{title}</h2>
      <div className="privacy-section__content">
        {content}
      </div>
    </div>
  );
};


const PrivacyContent = () => {
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

  const sections = [
    {
      id: "01",
      title: "Information we collect",
      content: (
        <>
          <p>We only collect the information we need to provide a professional experience. This includes:</p>
          <ul>
            <li><strong>Personal Details:</strong> Your name, email address, and phone number when you fill out a contact form or book a session.</li>
            <li><strong>Health Data:</strong> Basic fitness information or injury history you share with us to ensure your training protocols are safe.</li>
            <li><strong>Website Data:</strong> Anonymous information about how you use our site to help us improve the user experience.</li>
          </ul>
        </>
      )
    },
    {
      id: "02",
      title: "How we use your data",
      content: (
        <>
          <p>We use your information strictly for your transformation and hub management:</p>
          <ul>
            <li>To schedule your classes and manage your membership.</li>
            <li>To create customized training and nutrition plans.</li>
            <li>To send you important updates, workout insights, and gym news.</li>
            <li>To ensure we are meeting safety standards during your workouts.</li>
          </ul>
        </>
      )
    },
    {
      id: "03",
      title: "Data sharing and security",
      content: (
        <>
          <p>We do not sell, trade, or rent your personal data to any third parties. Your information stays within the No Limits ecosystem.</p>
          <p><strong>Service Providers:</strong> We only share data with trusted partners who help us run our gym (such as our booking and payment software).</p>
          <p><strong>Security:</strong> We use industry-standard security measures to protect your personal information from unauthorized access.</p>
        </>
      )
    },
    {
      id: "04",
      title: "Cookies",
      content: (
        <p>Our website uses cookies to remember your preferences and analyze our traffic. You can choose to disable cookies in your browser settings, but some parts of the site may not function perfectly if you do.</p>
      )
    },
    {
      id: "05",
      title: "Your rights",
      content: (
        <>
          <p>You are in total control of your data. At any time, you can request to:</p>
          <ul>
            <li>See what personal information we have on file.</li>
            <li>Update or correct your details.</li>
            <li>Delete your data from our system entirely.</li>
          </ul>
        </>
      )
    },
    {
      id: "06",
      title: "Changes to this policy",
      content: (
        <p>We may update this policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page with a new "Last Updated" date.</p>
      )
    },
    {
      id: "07",
      title: "Contact us",
      content: (
        <>
          <p>If you have any questions about how we handle your privacy, please reach out to us at the hub or via our contact page.</p>
          <div className="privacy-contact-box">
             <p>No Limits CrossFit [ Insert Gym Address ]</p>
             <p>[ Insert Contact Email ]</p>
          </div>
        </>
      )
    }
  ];

  return (
    <section className="privacy-content" ref={sectionRef}>
      <div className={`privacy-content__container ${isVisible ? 'visible' : ''}`}>
        {sections.map((sec, i) => (
          <PrivacySection key={i} {...sec} />
        ))}
      </div>
    </section>
  );
};

export default PrivacyContent;
