import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SQUEEZE_COUNT_MAX } from '../constants';

/* Single knot marker with spring pop animation */
function KnotMark({ filled, reduceMotion }) {
  return (
    <motion.div
      className="knot-mark"
      animate={
        filled
          ? { backgroundColor: 'var(--rope)', opacity: 1, scale: reduceMotion ? 1 : 1.25, borderColor: 'var(--rope)' }
          : { backgroundColor: 'transparent', opacity: 0.35, scale: 1 }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 500, damping: 18 }
      }
    />
  );
}

/* -------------------------------------------------------
   CaughtScreen
------------------------------------------------------- */
export default function CaughtScreen({ squeezeCount, onSqueeze }) {
  const shouldReduceMotion = useReducedMotion();

  /* Prevent multiple SQUEEZE dispatches from rapid clicks.
     `busy` flips to true on click. Because squeezeCount is a prop,
     when the parent re-renders with the new count the whole component
     re-renders and React resets `busy` via the key below.
     See: <CaughtScreen key={squeezeCount} ...> in Stage. */
  const [busy, setBusy] = useState(false);

  function handleSqueeze() {
    if (busy) return;
    setBusy(true);
    onSqueeze();
  }

  return (
    <motion.div
      key="caught-wrap"
      className="squeeze-ui"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
    >
      <p className="squeeze-msg">ih, ela tá tentando fugir… segura ela!</p>

      <motion.button
        className="squeeze-btn"
        type="button"
        onClick={handleSqueeze}
        disabled={busy}
        aria-disabled={busy}
        whileTap={shouldReduceMotion ? {} : { scale: 0.92, y: 3 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 600, damping: 20 }
        }
      >
        apertar o laço
      </motion.button>

      <div className="knots">
        {Array.from({ length: SQUEEZE_COUNT_MAX }, (_, i) => (
          <KnotMark key={i} filled={squeezeCount > i} reduceMotion={shouldReduceMotion} />
        ))}
      </div>
    </motion.div>
  );
}
