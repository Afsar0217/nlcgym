import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogs } from '../../api';
import '../../styles/RelatedArticles.css';

const RelatedCard = ({ article }) => {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB')
    : '';

  return (
    <Link to={`/blog/${article.slug || article.id}`} className="related-card">
      <div className="related-card__img">
        <img src={article.image_url || '/images/rectangle.png'} alt={article.title} />
      </div>
      <div className="related-card__content">
        <div className="related-card__meta">
          <span className="related-card__date">{formattedDate}</span>
          <span className="related-card__dot"></span>
          <span className="related-card__category">{article.category}</span>
        </div>
        <h3 className="related-card__title">{article.title}</h3>
      </div>
    </Link>
  );
};

const RelatedArticles = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const sectionRef = useRef(null);
  const { id: currentSlug } = useParams();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await getBlogs('All', 4);
        // Filter out the current blog post and take up to 3
        const filtered = (data.blogs || [])
          .filter(b => b.slug !== currentSlug)
          .slice(0, 3);
        setArticles(filtered);
      } catch (err) {
        console.error('Failed to load related articles:', err);
      }
    };
    fetchRelated();
  }, [currentSlug]);

  useEffect(() => {
    if (articles.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [articles]);

  if (articles.length === 0) return null;

  return (
    <section className="related-articles" ref={sectionRef}>
      <div className={`related-articles__container ${isVisible ? 'visible' : ''}`}>
        <div className="related-articles__divider"></div>
        
        <div className="related-articles__header">
          <h2 className="related-articles__title">RELATED ARTICLES</h2>
          <Link to="/blogs" className="related-see-all-btn">
            SEE ALL
          </Link>
        </div>

        <div className="related-articles__divider"></div>

        <div className="related-articles__grid">
          {articles.map((a) => (
            <RelatedCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
