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
   Google Calendar deep-link
   Event: Rodeio — Henrique & Juliano na Expo Agro
   Date : 17/07/2026 19h–00h (BRT = UTC-3)
------------------------------------------------------- */
const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Rodeio%20%E2%80%93%20Henrique%20%26%20Juliano%20na%20Expo%20Agro' +
  '&dates=20260717T220000Z%2F20260718T030000Z' +
  '&details=Convite%20especial%20%F0%9F%A4%A0%20para%20o%20show%20na%20Expo%20Agro!' +
  '&location=Estr.%20Mun.%20do%20Jardim%2C%20500%20%E2%80%93%20Jacare%C3%AD%2FSP';

async function handleShare() {
  const shareData = {
    title: 'Convite — Rodeio na Expo Agro',
    text: 'Juliane, bora pro rodeio? Henrique & Juliano na Expo Agro — 17/07 às 19h!',
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled share — no-op
    }
  } else {
    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    } catch {
      // Clipboard unavailable — silent fail
    }
  }
}

/* -------------------------------------------------------
   RevealScreen
------------------------------------------------------- */
export default function RevealScreen({ onReset }) {
  useEffect(() => {
    fireConfetti();
    return () => {
      // Cancel any still-flying confetti particles when unmounting
      confetti.reset();
    };
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
          só falta combinar a roupa de capa e chapéu
        </div>

        {/* Action buttons */}
        <motion.div
          className="ticket-actions"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
        >
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-btn ticket-btn--calendar"
            aria-label="Adicionar evento ao Google Agenda"
          >
            📅 adicionar ao calendário
          </a>
          <button
            type="button"
            className="ticket-btn ticket-btn--share"
            onClick={handleShare}
            aria-label="Compartilhar este convite"
          >
            🔗 compartilhar
          </button>
        </motion.div>
      </motion.div>

      {/* Play again */}
      <motion.button
        type="button"
        className="reveal-restart"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        aria-label="Jogar novamente"
      >
        jogar de novo
      </motion.button>
    </motion.div>
  );
}
