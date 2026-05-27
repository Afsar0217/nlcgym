import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogBySlug } from '../../api';
import useSEO from '../../hooks/useSEO';
import '../../styles/BlogDetailContent.css';

const BlogDetailContent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the slug from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useSEO(
    blog ? `${blog.title} | No Limits CrossFit` : "No Limits CrossFit Blog",
    blog ? (blog.meta_description || blog.summary || blog.content?.substring(0, 155)) : "Read expert fitness, crossfit, and weight loss insights from No Limits CrossFit in Hyderabad.",
    blog ? (blog.meta_keywords || "crossfit, gym, fitness, hyderabad, weight loss") : ""
  );

  const handleGoBack = () => {
    navigate('/blogs');
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogBySlug(id);
        setBlog(data);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <section className="blog-detail-content">
        <div className="blog-detail-container" style={{ textAlign: 'center', padding: '100px 0', color: 'rgba(255,255,255,0.4)' }}>
          Loading...
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="blog-detail-content">
        <div className="blog-detail-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2 style={{ color: 'rgba(255,255,255,0.6)' }}>Blog post not found</h2>
          <button className="blog-back-btn" onClick={handleGoBack} style={{ marginTop: '20px' }}>Go Back to Blogs</button>
        </div>
      </section>
    );
  }

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-GB')
    : '';

  return (
    <section className="blog-detail-content">
      <div className="blog-detail-container">
        {/* Responsive Header Wrapper */}
        <div className="blog-detail-header-new">
          
          {/* Top Row: Back Button (Mobile Only) */}
          <div className="blog-detail-back mobile-only">
            <button className="blog-back-btn" onClick={handleGoBack}>
              Go Back
            </button>
          </div>

          {/* Full Width Divider */}
          <div className="blog-detail-top-divider"></div>

          {/* Mobile Meta Stats Row (Mobile Only) */}
          <div className="blog-detail-stats-mobile mobile-only">
            <div className="blog-detail-stat">
              <span className="blog-detail-stat-label">Date</span>
              <span className="blog-detail-stat-value">{formattedDate}</span>
            </div>
            <div className="blog-detail-stat">
              <span className="blog-detail-stat-label">Category</span>
              <span className="blog-detail-stat-value">{blog.category}</span>
            </div>
            <div className="blog-detail-stat">
              <span className="blog-detail-stat-label">Reading Period</span>
              <span className="blog-detail-stat-value">{blog.reading_time}</span>
            </div>
          </div>

          {/* Desktop/Common Content Area */}
          <div className="blog-detail-main-content">
            {/* Desktop Left: Back Button */}
            <div className="blog-detail-back-desktop desktop-only">
              <button className="blog-back-btn" onClick={handleGoBack}>
                Go Back
              </button>
            </div>

            {/* Title & Subtitle Area */}
            <div className="blog-detail-title-area">
              <h1 className="blog-detail-title">
                {blog.title}
              </h1>
              <p className="blog-detail-subtitle">
                {blog.summary}
              </p>
              <div className="blog-detail-author-mobile mobile-only">
                Author : {blog.author_name}
              </div>
            </div>

            {/* Desktop Right: Divider + Stats */}
            <div className="blog-detail-sidebar-desktop desktop-only">
              <div className="blog-detail-vertical-divider"></div>
              <div className="blog-detail-stats">
                <div className="blog-detail-stat">
                  <span className="blog-detail-stat-label">Date</span>
                  <span className="blog-detail-stat-value">{formattedDate}</span>
                </div>
                <div className="blog-detail-stat">
                  <span className="blog-detail-stat-label">Category</span>
                  <span className="blog-detail-stat-value">{blog.category}</span>
                </div>
                <div className="blog-detail-stat">
                  <span className="blog-detail-stat-label">Reading Period</span>
                  <span className="blog-detail-stat-value">{blog.reading_time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="blog-detail-hero">
          <img src={blog.image_url || '/images/rectangle.png'} alt={blog.image_alt || blog.title} />
        </div>

        {/* Content Body */}
        <div className="blog-detail-body">
          <div className="blog-detail-article">
            <div className="blog-detail-section" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <div className="blog-detail-sidebar-right desktop-only">
             <div className="blog-detail-vertical-divider"></div>
             <div className="blog-detail-author-info">
               <span className="blog-detail-author-label">Author</span>
               <div className="blog-detail-author-box">
                 <h4 className="blog-detail-author-name">{blog.author_name}</h4>
                 <p className="blog-detail-author-bio">
                   {blog.author_bio || ''}
                 </p>
                 <span className="blog-detail-share-label">Share</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailContent;
