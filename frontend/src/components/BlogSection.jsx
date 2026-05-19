import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBlogs } from '../api';
import '../styles/BlogSection.css';
import '../styles/Skeleton.css';

const BlogSkeleton = () => (
  <div className="blog__posts">
    <div className="blog__divider"></div>
    {[1, 2].map((id) => (
      <div key={id}>
        <div className="blog__post skeleton" style={{ height: '180px', margin: '20px 0' }}></div>
        <div className="blog__divider"></div>
      </div>
    ))}
  </div>
);

const BlogSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs('All', 2);
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs for home page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="blog" ref={sectionRef} id="blogs">
      <div className={`blog__content ${isVisible ? 'blog__content--visible' : ''}`}>
        {/* Header */}
        <div className="blog__header">
          <div className="blog__header-left">
            <h2 className="blog__title gradient-text">BLOGS</h2>
            <p className="blog__subtitle">
              Expert insights on training, nutrition, and lifestyle transformation.
            </p>
          </div>
          <div className="blog__header-right">
            <span className="blog__badge">[ ARTICLE / BLOGS ]</span>
          </div>
        </div>

        {/* Blog Posts */}
        {loading ? (
          <BlogSkeleton />
        ) : (
          <div className="blog__posts">
            <div className="blog__divider"></div>
            {blogs.map((blog, index) => (
              <div key={blog.id || index}>
                <article className="blog__post">
                  <div className="blog__post-content">
                    <div className="blog__post-image">
                      <img src={blog.image_url || '/images/rectangle.png'} alt={blog.title} />
                    </div>
                    <div className="blog__post-info">
                      <div className="blog__post-meta">
                        <span className="blog__post-date">{blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-GB') : ''}</span>
                        <span className="blog__post-tag">{blog.category}</span>
                      </div>
                      <div className="blog__post-text">
                        <h3 className="blog__post-title">{blog.title}</h3>
                        <p className="blog__post-excerpt">{blog.summary || ''}</p>
                        <Link to={`/blog/${blog.slug}`} className="blog__post-link">Read More →</Link>
                      </div>
                    </div>
                  </div>
                </article>
                <div className="blog__divider"></div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="blog__cta-wrapper">
          <button className="cta-button" onClick={() => navigate('/blogs')}>
            <span>Check out all blogs</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
