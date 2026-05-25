import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/QuotesCardStack.css';

const quoteItems = [
  { id: 1, imageSrc: '/images/quotes/1.png', title: 'Pain Activates Your Mind And Your Body' },
  { id: 2, imageSrc: '/images/quotes/2.png', title: 'Sweat Now, Shine Later' },
  { id: 3, imageSrc: '/images/quotes/3.png', title: 'Focus On Improving Yourself, Not Proving Yourself' },
  { id: 4, imageSrc: '/images/quotes/4.png', title: 'Your Body Can Do It, Convince Your Mind' },
  { id: 5, imageSrc: '/images/quotes/5.png', title: "Excuses Don't Burn Calories" },
  { id: 6, imageSrc: '/images/quotes/6.png', title: "The Only Bad Workout Is The One That Didn't Happen" },
  { id: 7, imageSrc: '/images/quotes/7.png', title: 'Work Hard In Silence, Let Success Be The Noise' },
];

/* ---- helpers ---- */
function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i, active, len) {
  const raw = i - active;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

/* ---- config ---- */
const CARD_W = 340;
const CARD_H = 480;
const MAX_VISIBLE = 7;
const OVERLAP = 0.42;
const SPREAD_DEG = 42;
const PERSPECTIVE = 1100;
const DEPTH = 120;
const TILT_X = 10;
const ACTIVE_LIFT = 20;
const ACTIVE_SCALE = 1.04;
const INACTIVE_SCALE = 0.92;
const SPRING = { stiffness: 260, damping: 26 };

const QuotesCardStack = () => {
  const len = quoteItems.length;
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const maxOffset = Math.floor(MAX_VISIBLE / 2);
  const cardSpacing = Math.max(10, Math.round(CARD_W * (1 - OVERLAP)));
  const stepDeg = maxOffset > 0 ? SPREAD_DEG / maxOffset : 0;

  /* intersection observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* keyboard */
  const prev = useCallback(() => setActive(a => wrapIndex(a - 1, len)), [len]);
  const next = useCallback(() => setActive(a => wrapIndex(a + 1, len)), [len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  /* pointer drag (touch + mouse) on active card */
  const handlePointerDown = (e) => {
    setDragStart({ x: e.clientX, time: Date.now() });
  };

  const handlePointerUp = (e) => {
    if (!dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dt = Date.now() - dragStart.time;
    const velocity = Math.abs(dx) / (dt || 1) * 1000;
    const threshold = Math.min(140, CARD_W * 0.2);

    if (dx > threshold || velocity > 700) prev();
    else if (dx < -threshold || velocity > 700 && dx < 0) next();
    setDragStart(null);
  };

  return (
    <section className="quotes-stack" ref={sectionRef}>
      <div className={`quotes-stack__container ${isVisible ? 'quotes-stack--visible' : ''}`}>
        {/* Header */}
        <div className="quotes-stack__header">
          <span className="quotes-stack__tag">[ GYM CULTURE ]</span>
          <h2 className="quotes-stack__title">Wall Quotes That Hit Different</h2>
          <p className="quotes-stack__subtitle">
            The walls speak louder than words at No Limits CrossFit
          </p>
        </div>

        {/* Stage */}
        <div
          className="quotes-stack__stage"
          style={{ height: Math.max(460, CARD_H + 100) }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          ref={stageRef}
        >
          {/* Background glow effects */}
          <div className="quotes-stack__glow quotes-stack__glow--top" aria-hidden="true" />
          <div className="quotes-stack__glow quotes-stack__glow--bottom" aria-hidden="true" />

          <div
            className="quotes-stack__perspective-wrapper"
            style={{ perspective: `${PERSPECTIVE}px` }}
          >
            <AnimatePresence initial={false}>
              {quoteItems.map((item, i) => {
                const off = signedOffset(i, active, len);
                const abs = Math.abs(off);
                if (abs > maxOffset) return null;

                const rotateZ = off * stepDeg;
                const x = off * cardSpacing;
                const y = abs * 8;
                const z = -abs * DEPTH;
                const isActive = off === 0;
                const scale = isActive ? ACTIVE_SCALE : INACTIVE_SCALE;
                const lift = isActive ? -ACTIVE_LIFT : 0;
                const rotateX = isActive ? 0 : TILT_X;
                const zIndex = 100 - abs;
                const brightness = isActive ? 1 : 0.55;

                return (
                  <motion.div
                    key={item.id}
                    className={`quotes-stack__card ${isActive ? 'quotes-stack__card--active' : ''}`}
                    style={{
                      width: CARD_W,
                      height: CARD_H,
                      zIndex,
                      transformStyle: 'preserve-3d',
                    }}
                    initial={{
                      opacity: 0,
                      y: y + 60,
                      x,
                      rotateZ,
                      rotateX,
                      scale,
                    }}
                    animate={{
                      opacity: 1,
                      x,
                      y: y + lift,
                      rotateZ,
                      rotateX,
                      scale,
                      filter: `brightness(${brightness})`,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                    }}
                    transition={{
                      type: 'spring',
                      ...SPRING,
                    }}
                    onClick={() => {
                      if (!isActive) setActive(i);
                    }}
                    onPointerDown={isActive ? handlePointerDown : undefined}
                    onPointerUp={isActive ? handlePointerUp : undefined}
                  >
                    <div
                      className="quotes-stack__card-inner"
                      style={{
                        transform: `translateZ(${z}px)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="quotes-stack__card-img"
                        draggable={false}
                        loading="eager"
                      />
                      {/* Subtle gradient overlay */}
                      <div className="quotes-stack__card-overlay" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots & Navigation */}
        <div className="quotes-stack__nav">
          <button
            className="quotes-stack__arrow quotes-stack__arrow--prev"
            onClick={prev}
            aria-label="Previous quote"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="quotes-stack__dots">
            {quoteItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActive(idx)}
                className={`quotes-stack__dot ${idx === active ? 'quotes-stack__dot--active' : ''}`}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>

          <button
            className="quotes-stack__arrow quotes-stack__arrow--next"
            onClick={next}
            aria-label="Next quote"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuotesCardStack;
