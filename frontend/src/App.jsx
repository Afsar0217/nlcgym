import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import WallOfFamePage from './pages/WallOfFamePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CareerPage from './pages/CareerPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RealPrivacyPolicyPage from './pages/RealPrivacyPolicyPage';
import GetFitPage from './pages/GetFitPage';
import { getCoaches, getBlogs, getTransformations, getGoogleReviews } from './api';

// Pre-fetch all critical data and images for the home page
const prefetchData = () => {
  getCoaches().catch(() => {});
  getBlogs('All', 3).catch(() => {});
  getTransformations().catch(() => {});
  getGoogleReviews().catch(() => {});

  // Pre-load critical metric images
  const imagesToPreload = [
    '/images/home_ms1.jpg',
    '/images/home_ms2.jpeg',
    '/images/home_ms3.jpeg',
    '/images/rectangle.png',
    '/images/teams_herobg.jpg',
    '/images/wof_herobg.jpg',
    '/images/career_herobg.jpg',
    '/images/getfit_herobg.jpg',
    '/images/home_location_bg.jpg'
  ];
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Disable automatic browser scroll restoration to ensure video plays on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Remove the hard-coded splash from index.html once React is ready
    const splash = document.getElementById('initial-splash');
    if (splash) {
      setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }, 100);
    }

    // Pre-fetch data while user is watching intro
    prefetchData();
  }, []);

  // When navigating away from home, mark intro as finished so navbar shows
  useEffect(() => {
    if (!isHomePage && !isIntroFinished) {
      setIsIntroFinished(true);
      setShowIntro(false);
    }
  }, [isHomePage, isIntroFinished]);

  const handleIntroComplete = () => {
    setIsIntroFinished(true);
    setShowIntro(false);
    // After intro (100vh) is removed from DOM, scroll to top so Hero is in view
    // Use requestAnimationFrame to wait for React to finish unmounting
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  // Navbar should only be hidden during the intro on the home page
  const navbarIntroActive = isHomePage && !isIntroFinished;

  return (
    <>
      <ScrollToTop />
      <div className={`app ${isIntroFinished ? 'app--ready' : 'app--intro'}`}>
        <Navbar isIntroActive={navbarIntroActive} />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  showIntro={showIntro} 
                  isIntroFinished={isIntroFinished}
                  onIntroComplete={handleIntroComplete}
                />
              } 
            />
            <Route path="/team" element={<TeamsPage />} />
            <Route path="/wall-of-fame" element={<WallOfFamePage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/terms-and-conditions" element={<PrivacyPolicyPage />} />
            <Route path="/privacy-policy" element={<RealPrivacyPolicyPage />} />
            <Route path="/get-fit" element={<GetFitPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
