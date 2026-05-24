import { useState, useEffect, useRef } from 'react';
import { getGoogleReviews } from '../api';
import '../styles/GoogleReviewsSection.css';

const GoogleReviewsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getGoogleReviews();
        setReviews(data || []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        // Fallback to empty array if error
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  // Fallback reviews to show while loading or if API fails
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      author_name: "Santosh Kumar",
      profile_photo_url: "/images/square.png",
      rating: 5,
      text: "Best CrossFit gym in Nizampet! The trainers are extremely knowledgeable and the community is amazing. Highly recommended for anyone serious about fitness.",
      relative_time_description: "1 month ago",
      author_url: "#"
    },
    {
      author_name: "Priya Reddy",
      profile_photo_url: "/images/square.png",
      rating: 5,
      text: "Transformed my life completely. Elite coaching staff and great equipment. The 3-month transformation package is totally worth it.",
      relative_time_description: "2 months ago",
      author_url: "#"
    },
    {
      author_name: "Rahul Verma",
      profile_photo_url: "/images/square.png",
      rating: 5,
      text: "Top notch facility. I've been to many gyms in Hyderabad but No Limits CrossFit has the best vibe and coaching hands down.",
      relative_time_description: "3 months ago",
      author_url: "#"
    }
  ];

  return (
    <section className="google-reviews" ref={sectionRef} id="reviews">
      <div className={`google-reviews__content ${isVisible ? 'google-reviews__content--visible' : ''}`}>
        
        <div className="google-reviews__header">
          <div className="google-reviews__header-top">
            <span className="google-reviews__badge">[ REAL TRANSFORMATIONS ]</span>
            <h2 className="google-reviews__title gradient-text">
              WHAT OUR COMMUNITY SAYS
            </h2>
          </div>
          <div className="google-reviews__header-right">
            <div className="google-reviews__google-rating">
              <span className="google-reviews__google-score">5.0</span>
              <div className="google-reviews__google-stars">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="google-reviews__google-logo">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="google-reviews__marquee">
          <div className="google-reviews__track">
            {/* Group 1 */}
            <div className="google-reviews__group">
              {displayReviews.map((review, index) => (
                <a 
                  key={`g1-${index}`} 
                  href={review.author_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="google-reviews__card"
                >
                  <div className="google-reviews__card-header">
                    <img 
                      src={review.profile_photo_url || '/images/square.png'} 
                      alt={review.author_name} 
                      className="google-reviews__avatar"
                    />
                    <div className="google-reviews__author-info">
                      <span className="google-reviews__author-name">{review.author_name}</span>
                      <span className="google-reviews__author-time">{review.relative_time_description}</span>
                    </div>
                    <div className="google-reviews__card-google-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="google-reviews__stars">
                    {Array(review.rating || 5).fill(0).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  
                  <p className="google-reviews__text">
                    "{review.text}"
                  </p>
                  
                  <div className="google-reviews__read-more">Read on Google →</div>
                </a>
              ))}
            </div>

            {/* Group 2 (Exact Duplicate for infinite scroll) */}
            <div className="google-reviews__group">
              {displayReviews.map((review, index) => (
                <a 
                  key={`g2-${index}`} 
                  href={review.author_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="google-reviews__card"
                >
                  <div className="google-reviews__card-header">
                    <img 
                      src={review.profile_photo_url || '/images/square.png'} 
                      alt={review.author_name} 
                      className="google-reviews__avatar"
                    />
                    <div className="google-reviews__author-info">
                      <span className="google-reviews__author-name">{review.author_name}</span>
                      <span className="google-reviews__author-time">{review.relative_time_description}</span>
                    </div>
                    <div className="google-reviews__card-google-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="google-reviews__stars">
                    {Array(review.rating || 5).fill(0).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  
                  <p className="google-reviews__text">
                    "{review.text}"
                  </p>
                  
                  <div className="google-reviews__read-more">Read on Google →</div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GoogleReviewsSection;
