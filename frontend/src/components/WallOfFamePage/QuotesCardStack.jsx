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
    "7": 'Work Hard In Silence, Let Success Be The Noise'
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
const CARD_W   = 340;
const CARD_H   = 480;
const MAX_VISIBLE  = 7;
const OVERLAP      = 0.42;
const SPREAD_DEG   = 42;
const PERSPECTIVE  = 1100;
const DEPTH        = 120;
const TILT_X       = 10;
const ACTIVE_LIFT  = 20;
const ACTIVE_SCALE = 1.04;
const INACTIVE_SCALE = 0.92;
const SPRING = { stiffness: 260, damping: 26 };

/* ---- Swipe threshold ---- */
const SWIPE_PX  = 50;   // min px distance to count as swipe
const SWIPE_VEL = 400;  // min px/s velocity to count as swipe

const QuotesCardStack = () => {
  const len = quoteItems.length;
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const stageRef   = useRef(null);

  /* Swipe state stored in a ref so gesture handlers never go stale */
  const swipeRef = useRef({ startX: 0, startY: 0, startTime: 0, active: false });

  const maxOffset    = Math.floor(MAX_VISIBLE / 2);
  const cardSpacing  = Math.max(10, Math.round(CARD_W * (1 - OVERLAP)));
  const stepDeg      = maxOffset > 0 ? SPREAD_DEG / maxOffset : 0;

  /* ---------- intersection observer ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------- navigation ---------- */
  const prev = useCallback(() => setActive(a => wrapIndex(a - 1, len)), [len]);
  const next = useCallback(() => setActive(a => wrapIndex(a + 1, len)), [len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  };

  /* ---------- Touch events on the full stage ---------- */
  /* We use passive: false on touchstart so we can call
     preventDefault if the swipe is horizontal (prevents page scroll). */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onTouchStart = (e) => {
      const t = e.touches[0];
      swipeRef.current = {
        startX:    t.clientX,
        startY:    t.clientY,
        startTime: Date.now(),
        active:    true,
      };
    };

    const onTouchMove = (e) => {
      if (!swipeRef.current.active) return;
      const dx = e.touches[0].clientX - swipeRef.current.startX;
      const dy = e.touches[0].clientY - swipeRef.current.startY;
      /* If mostly horizontal, block the vertical scroll on the stage */
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (!swipeRef.current.active) return;
      const { startX, startY, startTime } = swipeRef.current;
      swipeRef.current.active = false;

      const t  = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Math.max(Date.now() - startTime, 1);
      const vx = Math.abs(dx) / dt * 1000; // px/s

      /* Only treat as a horizontal swipe if horizontal > vertical */
      if (Math.abs(dx) <= Math.abs(dy)) return;

      if (dx > SWIPE_PX || vx > SWIPE_VEL) prev();
      else if (dx < -SWIPE_PX || (vx > SWIPE_VEL && dx < 0)) next();
    };

    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove',  onTouchMove,  { passive: false }); // needs preventDefault
    stage.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove',  onTouchMove);
      stage.removeEventListener('touchend',   onTouchEnd);
    };
  }, [prev, next]);

  /* ---------- Mouse drag (desktop) on active card ---------- */
  const dragRef = useRef(null);

  const handlePointerDown = (e) => {
    dragRef.current = { x: e.clientX, time: Date.now() };
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dt = Math.max(Date.now() - dragRef.current.time, 1);
    const vx = Math.abs(dx) / dt * 1000;
    const threshold = Math.min(140, CARD_W * 0.2);

    if      (dx > threshold || vx > 700)            prev();
    else if (dx < -threshold || (vx > 700 && dx < 0)) next();
    dragRef.current = null;
  };

  /* ---------- render ---------- */
  return (
    <section className="quotes-stack" ref={sectionRef}>
      <div className={`quotes-stack__container ${isVisible ? 'quotes-stack--visible' : ''}`}>

        {/* ── Header – matches MemberWords / WoF page style ── */}
        <div className="quotes-stack__header">
          <h2 className="quotes-stack__title">Wall Quotes</h2>
          <div className="quotes-stack__header-right">
            <span className="quotes-stack__tag">[ GYM CULTURE ]</span>
            <p className="quotes-stack__header-desc">
              The walls of No Limits CrossFit speak louder than words — every quote is a reminder.
            </p>
          </div>
        </div>

        {/* ── Stage ── */}
        <div
          className="quotes-stack__stage"
          style={{ height: Math.max(460, CARD_H + 100) }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          ref={stageRef}
          /* cursor hint on desktop */
          style={{ height: Math.max(460, CARD_H + 100), cursor: 'grab', touchAction: 'pan-y' }}
        >
          <div className="quotes-stack__glow quotes-stack__glow--top"    aria-hidden="true" />
          <div className="quotes-stack__glow quotes-stack__glow--bottom" aria-hidden="true" />

          <div
            className="quotes-stack__perspective-wrapper"
            style={{ perspective: `${PERSPECTIVE}px` }}
          >
            <AnimatePresence initial={false}>
              {quoteItems.map((item, i) => {
                const off     = signedOffset(i, active, len);
                const abs     = Math.abs(off);
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
                    style={{ width: CARD_W, height: CARD_H, zIndex, transformStyle: 'preserve-3d' }}
                    initial={{ opacity: 0, y: y + 60, x, rotateZ, rotateX, scale }}
                    animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale, filter: cardFilter }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', ...SPRING }}
                    onClick={() => { if (!isActive) setActive(i); }}
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

        {/* ── Dots & Arrows ── */}
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
