import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api';
import '../../styles/BlogPageStyles.css';

const BlogCard = ({ blog, isLarge }) => {
  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-GB')
    : blog.date || '';

  return (
    <Link to={`/blog/${blog.slug || blog.id}`} className={`blog-card ${isLarge ? 'blog-card--large' : ''}`}>
      <div className="blog-card__img">
        <img src={blog.image_url || '/images/rectangle.png'} alt={blog.title} />
      </div>
      <div className="blog-card__content">
        <div className="blog-card__meta">
          <span className="blog-card__date">{formattedDate}</span>
          <span className="blog-card__dot"></span>
          <span className="blog-card__category">{blog.category}</span>
        </div>
        <h3 className="blog-card__title">{blog.title}</h3>
        <span className="blog-card__read-more mobile-only">Read More →</span>
      </div>
    </Link>
  );
};


const BlogSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const sectionRef = useRef(null);

  const defaultFilters = ['All', 'Transformations', 'Workouts', 'Food', 'Recovery', 'Mindset'];

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs(activeFilter);
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [activeFilter]);

  // Derive unique categories from default + any new ones from API
  const filters = defaultFilters;

  const filteredBlogs = blogs;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Split blogs: featured first 2 for hero row, rest in grid
  const featuredBlogs = filteredBlogs.filter(b => b.is_featured).slice(0, 2);
  const gridBlogs = filteredBlogs.filter(b => !b.is_featured || activeFilter !== 'All');

  return (
    <section className="blog-section-page" ref={sectionRef}>
      <div className={`blog-page-container ${isVisible ? 'visible' : ''}`}>
        <div className="blog-header">
          <div className="blog-header__titles">
            <h1 className="blog-header__label">BLOGS</h1>
            <p className="blog-header__sub">
              long established fact that a reader will be distracted by
            </p>
          </div>

          <div className="blog-filters">
            {filters.map(f => (
              <button 
                key={f}
                className={`blog-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => { setActiveFilter(f); setLoading(true); }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-content-wrapper">
          <div className="blog-grid__divider"></div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
              Loading...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
              No blog posts found.
            </div>
          ) : (
            <>
              {featuredBlogs.length > 0 && (
                <>
                  <div className="blog-featured-row">
                    {featuredBlogs.map(b => (
                      <BlogCard key={b.id} blog={b} isLarge={true} />
                    ))}
                  </div>
                  {gridBlogs.length > 0 && (
                    <div className="blog-grid__divider desktop-only"></div>
                  )}
                </>
              )}

              {gridBlogs.length > 0 && (
                <div className="blog-main-grid">
                  {gridBlogs.map(b => (
                    <BlogCard key={b.id} blog={b} isLarge={false} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
