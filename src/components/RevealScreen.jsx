import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

/* -------------------------------------------------------
   Confetti burst — themed with palette colors
------------------------------------------------------- */
function fireConfetti() {
  const colors = ['#f4c873', '#c97b30', '#b8512c', '#ecd9b6', '#8f3a1f', '#ffffff'];

  // Central burst
  confetti({
    particleCount: 90,
    spread: 65,
    origin: { x: 0.5, y: 0.45 },
    colors,
    scalar: 1.1,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 50,
      origin: { x: 0.05, y: 0.55 },
      colors,
    });
  }, 250);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 50,
      origin: { x: 0.95, y: 0.55 },
      colors,
    });
  }, 250);
}

/* -------------------------------------------------------
   RevealScreen
------------------------------------------------------- */
export default function RevealScreen() {
  useEffect(() => {
    fireConfetti();
  }, []);

  return (
    <motion.div
      key="reveal-wrap"
      className="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="ticket"
        initial={{ scale: 0.82, y: 18, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
      >
        <div className="ticket-eyebrow">um convite pra você</div>

        <p className="ticket-name">
          Juliane,<br />bora pro rodeio?
        </p>

        <hr className="ticket-divider" />

        <div className="ticket-row">
          <b>Dupla</b>
          <span>Henrique &amp; Juliano</span>
        </div>
        <div className="ticket-row">
          <b>Show</b>
          <span>Expo Agro</span>
        </div>
        <div className="ticket-row">
          <b>Data</b>
          <span>17/07 · 19h até a madrugada</span>
        </div>
        <div className="ticket-row">
          <b>Local</b>
          <span>Estr. Mun. do Jardim, 500 — Jacareí/SP</span>
        </div>

        <hr className="ticket-divider" />

        <div className="ticket-footer">
          os ingressos já estão garantidos.<br />
          só falta combinar a roupa de capa e chapéu 🤠
        </div>
      </motion.div>
    </motion.div>
  );
}
