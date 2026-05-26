import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/QuotesCardStack.css';

const globImages = import.meta.glob('/public/images/quotes/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true });

const quoteItems = Object.keys(globImages).map((key, idx) => {
  const imageSrc = key.replace('/public', '');
  const filenameWithExt = key.substring(key.lastIndexOf('/') + 1);
  const filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.'));

  let title = filename
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  const defaultTitles = {
    "1": 'Pain Activates Your Mind And Your Body',
    "2": 'Sweat Now, Shine Later',
    "3": 'Focus On Improving Yourself, Not Proving Yourself',
    "4": 'Your Body Can Do It, Convince Your Mind',
    "5": "Excuses Don't Burn Calories",
    "6": "The Only Bad Workout Is The One That Didn't Happen",
    "7": 'Work Hard In Silence, Let Success Be The Noise',
  };

  if (defaultTitles[filename]) title = defaultTitles[filename];
  return { id: idx + 1, imageSrc, title };
});

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
const CARD_W        = 340;
const CARD_H        = 480;
const MAX_VISIBLE   = 7;
const OVERLAP       = 0.42;
const SPREAD_DEG    = 42;
const PERSPECTIVE   = 1100;
const DEPTH         = 120;
const TILT_X        = 10;
const ACTIVE_LIFT   = 20;
const ACTIVE_SCALE  = 1.04;
const INACTIVE_SCALE = 0.92;
const SPRING        = { stiffness: 260, damping: 26 };

/* ---- Mobile swipe thresholds ----
   SWIPE_MIN_PX  : distance must exceed this to count (filters accidental taps)
   SWIPE_MAX_MS  : gesture must complete within this window
   SWIPE_RATIO   : horizontal movement must be > vertical × this ratio
*/
const SWIPE_MIN_PX = 40;
const SWIPE_MAX_MS = 600;
const SWIPE_RATIO  = 1.5;

/* Detect touch device once at module load – avoids repeated media checks */
const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

const QuotesCardStack = () => {
  const len        = quoteItems.length;
  const [active, setActive]     = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const stageRef   = useRef(null);

  /* Lock: prevents a single touch gesture from firing more than one step */
  const swipeLock = useRef(false);

  /* Raw touch tracking stored in a ref (no re-renders needed) */
  const touchRef = useRef({ startX: 0, startY: 0, startTime: 0, tracking: false });

  const maxOffset   = Math.floor(MAX_VISIBLE / 2);
  const cardSpacing = Math.max(10, Math.round(CARD_W * (1 - OVERLAP)));
  const stepDeg     = maxOffset > 0 ? SPREAD_DEG / maxOffset : 0;

  /* ---------- intersection observer ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- navigation (always moves exactly 1 step) ---------- */
  const prev = useCallback(() => setActive(a => wrapIndex(a - 1, len)), [len]);
  const next = useCallback(() => setActive(a => wrapIndex(a + 1, len)), [len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  };

  /* ---------- Touch swipe – attached to the full stage ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    /* touchstart: record origin, reset lock */
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return; // ignore multi-touch
      swipeLock.current = false;
      touchRef.current = {
        startX:    e.touches[0].clientX,
        startY:    e.touches[0].clientY,
        startTime: Date.now(),
        tracking:  true,
      };
    };

    /* touchmove: lock vertical scroll only when clearly horizontal */
    const onTouchMove = (e) => {
      if (!touchRef.current.tracking) return;
      const dx = Math.abs(e.touches[0].clientX - touchRef.current.startX);
      const dy = Math.abs(e.touches[0].clientY - touchRef.current.startY);
      if (dx > dy && dx > 8) {          // clearly horizontal & past dead-zone
        e.preventDefault();             // stop page from scrolling
      }
    };

    /* touchend: evaluate the gesture, advance exactly one step */
    const onTouchEnd = (e) => {
      if (!touchRef.current.tracking) return;
      touchRef.current.tracking = false;

      /* If another step was already triggered this gesture, bail out */
      if (swipeLock.current) return;

      const { startX, startY, startTime } = touchRef.current;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const dt = Date.now() - startTime;

      /* Reject if: too slow, too short, or more vertical than horizontal */
      if (dt > SWIPE_MAX_MS) return;
      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;

      /* Lock so no further step fires for this gesture */
      swipeLock.current = true;

      if (dx > 0) prev();   // swipe right → previous
      else        next();   // swipe left  → next
    };

    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove',  onTouchMove,  { passive: false });
    stage.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove',  onTouchMove);
      stage.removeEventListener('touchend',   onTouchEnd);
    };
  }, [prev, next]);

  /* ---------- Mouse drag on active card (desktop only) ---------- */
  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    if (e.pointerType === 'touch') return; // touch is handled above
    dragRef.current = { x: e.clientX, time: Date.now() };
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') return;
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dt = Math.max(Date.now() - dragRef.current.time, 1);
    const vx = Math.abs(dx) / dt * 1000;
    const threshold = Math.min(140, CARD_W * 0.2);

    if      (dx >  threshold || vx > 700)            prev();
    else if (dx < -threshold || (vx > 700 && dx < 0)) next();
    dragRef.current = null;
  };

  /* ---------- render ---------- */
  return (
    <section className="quotes-stack" ref={sectionRef}>
      <div className={`quotes-stack__container ${isVisible ? 'quotes-stack--visible' : ''}`}>

        {/* Header */}
        <div className="quotes-stack__header">
          <h2 className="quotes-stack__title">Wall Quotes</h2>
          <div className="quotes-stack__header-right">
            <span className="quotes-stack__tag">[ GYM CULTURE ]</span>
            <p className="quotes-stack__header-desc">
              The walls of No Limits CrossFit speak louder than words — every quote is a reminder.
            </p>
          </div>
        </div>

        {/* Stage */}
        <div
          className="quotes-stack__stage"
          style={{ height: Math.max(460, CARD_H + 100), cursor: 'grab', touchAction: 'pan-y' }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          ref={stageRef}
        >
          <div className="quotes-stack__glow quotes-stack__glow--top"    aria-hidden="true" />
          <div className="quotes-stack__glow quotes-stack__glow--bottom" aria-hidden="true" />

          <div
            className="quotes-stack__perspective-wrapper"
            style={{ perspective: `${PERSPECTIVE}px` }}
          >
            <AnimatePresence initial={false}>
              {quoteItems.map((item, i) => {
                const off      = signedOffset(i, active, len);
                const abs      = Math.abs(off);
                if (abs > maxOffset) return null;

                const rotateZ    = off * stepDeg;
                const x          = off * cardSpacing;
                const y          = abs * 8;
                const z          = -abs * DEPTH;
                const isActive   = off === 0;
                const scale      = isActive ? ACTIVE_SCALE : INACTIVE_SCALE;
                const lift       = isActive ? -ACTIVE_LIFT : 0;
                const rotateX    = isActive ? 0 : TILT_X;
                const zIndex     = 100 - abs;
                const cardFilter = isActive
                  ? 'brightness(1) blur(0px)'
                  : `brightness(0.35) blur(${Math.min(abs * 1.5, 4)}px)`;

                return (
                  <motion.div
                    key={item.id}
                    className={`quotes-stack__card ${isActive ? 'quotes-stack__card--active' : ''}`}
                    style={{ width: CARD_W, height: CARD_H, zIndex, transformStyle: 'preserve-3d', borderWidth: 2, borderStyle: 'solid' }}
                    initial={{ opacity: 0, y: y + 60, x, rotateZ, rotateX, scale,
                      boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                      borderColor: 'rgba(255,255,255,0.04)',
                    }}
                    animate={{
                      opacity: 1, x, y: y + lift, rotateZ, rotateX, scale, filter: cardFilter,
                      boxShadow: isActive
                        ? '0 0 0 1px rgba(221,48,40,0.15), 0 0 20px rgba(221,48,40,0.2), 0 0 50px rgba(221,48,40,0.1), 0 30px 60px rgba(0,0,0,0.6)'
                        : '0 15px 40px rgba(0,0,0,0.5)',
                      borderColor: isActive
                        ? 'rgba(221,48,40,0.7)'
                        : 'rgba(255,255,255,0.04)',
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', ...SPRING }}
                    /* Desktop only: click inactive card to select it */
                    onClick={() => {
                      if (!isActive && !isTouchDevice()) setActive(i);
                    }}
                    /* Desktop only: pointer drag on active card */
                    onPointerDown={isActive ? handlePointerDown : undefined}
                    onPointerUp={isActive   ? handlePointerUp   : undefined}
                  >
                    <div
                      className="quotes-stack__card-inner"
                      style={{ transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}
                    >
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="quotes-stack__card-img"
                        draggable={false}
                        loading="eager"
                      />
                      <div className="quotes-stack__card-overlay" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots & Arrows */}
        <div className="quotes-stack__nav">
          <button className="quotes-stack__arrow" onClick={prev} aria-label="Previous quote">
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

          <button className="quotes-stack__arrow" onClick={next} aria-label="Next quote">
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
