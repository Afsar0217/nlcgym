import { useEffect, useRef } from 'react';
import '../styles/CinematicIntro.css';

const CinematicIntro = ({ onComplete }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Modern browser autoplay safety mechanism
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocked it, try playing again on user interaction
          const forcePlay = () => {
            video.play()
              .then(() => {
                document.removeEventListener('keydown', forcePlay);
                document.removeEventListener('mousedown', forcePlay);
                document.removeEventListener('touchstart', forcePlay);
              })
              .catch(err => console.log('Autoplay forced playback skipped:', err));
          };
          document.addEventListener('keydown', forcePlay);
          document.addEventListener('mousedown', forcePlay);
          document.addEventListener('touchstart', forcePlay);
        });
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fire only when intro has scrolled COMPLETELY above the viewport
        if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) {
          if (onComplete) onComplete();
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [onComplete]);

  return (
    <div className="cinematic-intro" ref={containerRef}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="cinematic-intro__video"
      >
        <source src="/images/intro-video.mp4" type="video/mp4" />
      </video>

      <div className="cinematic-intro__hint">
        <svg
          className="cinematic-intro__arrow"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        >
          <path d="M7 13L12 18L17 13M7 6L12 11L17 6" />
        </svg>
        <span>SCROLL TO ENTER</span>
      </div>
    </div>
  );
};

export default CinematicIntro;
