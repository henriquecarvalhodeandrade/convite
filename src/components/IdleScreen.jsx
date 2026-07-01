import { motion, AnimatePresence } from 'framer-motion';

export default function IdleScreen({ showMiss }) {
  return (
    <motion.div
      key="idle-wrap"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* "toque na tela" label */}
      <div className="label label-idle">toque na tela</div>

      {/* Aim hint (always visible in idle) */}
      <div className="label label-hint" style={{ bottom: '6%' }}>
        arraste pra mirar &amp; solte pra laçar
      </div>

      {/* Miss message */}
      <AnimatePresence>
        {showMiss && (
          <motion.div
            key="miss"
            className="miss-msg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            quase! tenta de novo
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
