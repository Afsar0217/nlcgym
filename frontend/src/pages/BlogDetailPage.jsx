import BlogDetailContent from '../components/BlogPage/BlogDetailContent';
import RelatedArticles from '../components/BlogPage/RelatedArticles';
import BlogNewsletter from '../components/BlogPage/BlogNewsletter';

const BlogDetailPage = () => {
  return (
    <div className="blog-detail-page">
      <div className="grudge-texture">
        <BlogDetailContent />
        <RelatedArticles />
        <BlogNewsletter />
      </div>
    </div>
  );
};


export default BlogDetailPage;
