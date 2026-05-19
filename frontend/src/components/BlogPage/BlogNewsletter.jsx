import { useState, useEffect, useRef } from 'react';
import '../../styles/BlogNewsletter.css';

const BlogNewsletter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="blog-newsletter" ref={sectionRef}>
      <div className={`blog-newsletter__container ${isVisible ? 'visible' : ''}`}>
        <div className="blog-newsletter__main">
          <div className="blog-newsletter__content">
            <h2 className="blog-newsletter__title">
              Get the latest news into your inbox
            </h2>
            <div className="blog-newsletter__form-wrapper">
              <div className="blog-newsletter__form">
                <input 
                  type="email" 
                  placeholder="Enter your Mail ID" 
                  className="blog-newsletter__input"
                />
                <button className="blog-newsletter__submit">
                  <span className="blog-newsletter__arrow">→</span>
                  <div className="blog-newsletter__line"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="blog-newsletter__info">
            <span className="blog-newsletter__tag">[ NEWSLETTER ]</span>
            <p className="blog-newsletter__desc">
              Stay ahead of the curve with our elite protocols and mindset hacks delivered weekly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogNewsletter;
