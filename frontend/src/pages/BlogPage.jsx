import BlogSection from '../components/BlogPage/BlogSection';
import BlogNewsletter from '../components/BlogPage/BlogNewsletter';
import useSEO from '../hooks/useSEO';

const BlogPage = () => {
  useSEO(
    "Fitness & Nutrition Blog | No Limits CrossFit Hyderabad",
    "Read the latest fitness tips, workout routines, and nutrition advice from the expert coaches at No Limits CrossFit in Nizampet, Hyderabad."
  );

  return (
    <div className="blog-page">
      <div className="grudge-texture">
        <BlogSection />
        <BlogNewsletter />
      </div>
    </div>
  );
};


export default BlogPage;
