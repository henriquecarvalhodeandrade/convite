import { motion } from 'framer-motion';

/* Single knot marker with spring pop animation */
function KnotMark({ filled }) {
  return (
    <motion.div
      className="knot-mark"
      animate={
        filled
          ? { backgroundColor: 'var(--rope)', opacity: 1, scale: 1.25, borderColor: 'var(--rope)' }
          : { backgroundColor: 'transparent', opacity: 0.35, scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
    />
  );
}

/* -------------------------------------------------------
   CaughtScreen
------------------------------------------------------- */
export default function CaughtScreen({ squeezeCount, onSqueeze }) {
  return (
    <motion.div
      key="caught-wrap"
      className="squeeze-ui"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <p className="squeeze-msg">ih, ela tá tentando fugir… segura ela!</p>

      <motion.button
        className="squeeze-btn"
        type="button"
        onClick={onSqueeze}
        whileTap={{ scale: 0.92, y: 3 }}
        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
      >
        apertar o laço 🪢
      </motion.button>

      <div className="knots">
        {[0, 1, 2].map((i) => (
          <KnotMark key={i} filled={squeezeCount > i} />
        ))}
      </div>
    </motion.div>
  );
}
