import { useEffect, useRef, useState, memo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

import PineTreeSilhouette from './PineTreeSilhouette';
import House from './House';
import Campfire from './Campfire';

let engineInitPromise = null;

/* -------------------------------------------------------
   tsParticles — twinkling stars
------------------------------------------------------- */
const starsOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 280, density: { enable: true, area: 900 } },
    color: { value: ['#ffffff', '#e8f0ff', '#fff8e8', '#c8d8ff', '#ffe8c8'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.04, max: 0.95 },
      animation: { enable: true, speed: 0.4, sync: false },
    },
    size: { value: { min: 0.2, max: 2.8 } },
    move: {
      enable: true,
      speed: 0.15,
      direction: 'right',
      random: true,
      straight: false,
      outModes: { default: 'out' },
    },
  },
  detectRetina: true,
};

/* -------------------------------------------------------
   Background — main export
------------------------------------------------------- */
// Background's output never changes after tsParticles initialises — memo avoids needless reconciliation
export default memo(function Background() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    if (!engineInitPromise) {
      engineInitPromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
    }

    engineInitPromise.then(() => {
      if (isMounted) setInit(true);
    });

    return () => { isMounted = false; };
  }, []);

  /* ---- Scene layout constants (viewBox 1600×900) ---- */
  const HORIZON   = 632;   // horizon y
  const TREE_BASE = 675;   // tree base y — well below the lowest ground undulation (~654)

  // Campfire: moved down and to the right
  const FIRE_CX = 550;
  const FIRE_GY = 735;

  // House: right of centre, near the moon
  const HOUSE_CX  = 1020;
  const HOUSE_GY  = HORIZON;

  // Moon position
  const MOON_CX = 1340;
  const MOON_CY = 108;

  return (
    <>
      {/* ===== SKY BASE (behind stars) ===== */}
      <svg
        className="scene-bg"
        style={{ zIndex: -2 }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep night sky — slightly warmer at bottom (fire glow) */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#02030c" />
            <stop offset="38%"  stopColor="#060818" />
            <stop offset="70%"  stopColor="#0d0716" />
            <stop offset="88%"  stopColor="#160a12" />
            <stop offset="100%" stopColor="#221008" />
          </linearGradient>
          {/* Milky Way diagonal band */}
          <linearGradient id="milkyWay" x1="0" y1="0.1" x2="1" y2="0.6">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
            <stop offset="25%"  stopColor="#a0b0d0" stopOpacity="0.03" />
            <stop offset="50%"  stopColor="#c8d0e8" stopOpacity="0.06" />
            <stop offset="75%"  stopColor="#a0b0d0" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#skyGrad)" />
        <rect width="1600" height="900" fill="url(#milkyWay)" opacity={0.95} />
      </svg>

      {/* Stars — z-index controlled by CSS (#tsparticles { position:fixed; z-index:0 }).
          The opacity wrapper provides the fade-in transition; zIndex is intentionally
          omitted here because tsparticles uses position:fixed and exits any parent
          stacking context regardless. */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: init ? 1 : 0,
          transition: 'opacity 1.2s ease-in',
        }}
      >
        {init && <Particles id="tsparticles" options={starsOptions} />}
      </div>

      {/* ===== SCENE SVG (Foreground: Moon, Trees, House, Campfire) ===== */}
      <svg
        className="scene-bg"
        style={{ zIndex: 0 }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ground — warm earth */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1a1009" />
            <stop offset="60%"  stopColor="#0e0906" />
            <stop offset="100%" stopColor="#080604" />
          </linearGradient>

          {/* Fire ground scatter — warm amber pool on left ground */}
          <radialGradient id="fireGround" cx={`${FIRE_CX / 16}%`} cy="100%" r="42%"
                          gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#e08020" stopOpacity="0.42" />
            <stop offset="35%"  stopColor="#a04818" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3a1500" stopOpacity="0"    />
          </radialGradient>

          {/* Moon glow halo */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#eaf0ff" stopOpacity="0.60" />
            <stop offset="40%"  stopColor="#c0ccec" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5070b0" stopOpacity="0"    />
          </radialGradient>

          {/* Moon surface shading */}
          <radialGradient id="moonSurface" cx="42%" cy="38%" r="52%">
            <stop offset="0%"   stopColor="#f0f4ff" />
            <stop offset="100%" stopColor="#c8d4ee" />
          </radialGradient>

          {/* Cool moonlight ambient — upper right */}
          <radialGradient id="moonAmbient" cx="84%" cy="0%" r="58%"
                          gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#4860a8" stopOpacity="0.22" />
            <stop offset="50%"  stopColor="#2c3468" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#101828" stopOpacity="0"    />
          </radialGradient>

          {/* Campfire ambient — warm bloom lower-left */}
          <radialGradient id="fireAmbient" cx={`${FIRE_CX / 16}%`} cy="90%" r="55%"
                          gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#d08020" stopOpacity="0.50" />
            <stop offset="28%"  stopColor="#b04820" stopOpacity="0.26" />
            <stop offset="60%"  stopColor="#8a3018" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#3a1500" stopOpacity="0"    />
          </radialGradient>

        </defs>

        {/* Moon ambient wash — cool blue right side */}
        <rect width="1600" height="900" fill="url(#moonAmbient)" />

        {/* Fire ambient wash — warm amber left side */}
        <rect width="1600" height="900" fill="url(#fireAmbient)" />

        {/* ===== MOON ===== */}
        {/* Outer glow halo */}
        <circle cx={MOON_CX} cy={MOON_CY} r={165} fill="url(#moonGlow)" />
        {/* Secondary softer halo */}
        <circle cx={MOON_CX} cy={MOON_CY} r={96}
                fill="none" stroke="#b8cce8" strokeWidth={24} opacity={0.08} />
        {/* Moon body */}
        <circle cx={MOON_CX} cy={MOON_CY} r={62} fill="url(#moonSurface)" opacity={0.95} />
        {/* Craters */}
        <circle cx={MOON_CX - 20} cy={MOON_CY - 10} r={18} fill="#c8d4ec" opacity={0.32} />
        <circle cx={MOON_CX + 18} cy={MOON_CY + 18} r={12} fill="#c8d4ec" opacity={0.24} />
        <circle cx={MOON_CX - 5}  cy={MOON_CY - 22} r={8}  fill="#d0dcf0" opacity={0.20} />
        <circle cx={MOON_CX + 28} cy={MOON_CY - 8}  r={7}  fill="#d0dcf0" opacity={0.18} />
        <circle cx={MOON_CX + 8}  cy={MOON_CY + 6}  r={4}  fill="#c8d4ec" opacity={0.15} />
        {/* Limb darkening (shadowed right-bottom edge) */}
        <circle cx={MOON_CX + 18} cy={MOON_CY + 18} r={58}
                fill="none" stroke="#a0b0d0" strokeWidth={8} opacity={0.08} />

        {/* ===== DISTANT HILLS — two layers for depth ===== */}
        {/* Far hills — darkest, tallest */}
        <path
          d={`M 0,${HORIZON + 4}
              Q 100,${HORIZON - 72} 260,${HORIZON - 48}
              Q 430,${HORIZON - 78} 600,${HORIZON - 38}
              Q 750,${HORIZON - 18} 900,${HORIZON - 56}
              Q 1060,${HORIZON - 88} 1220,${HORIZON - 52}
              Q 1380,${HORIZON - 24} 1600,${HORIZON - 60}
              L 1600,${HORIZON + 4} Z`}
          fill="#08060d"
          opacity={0.90}
        />
        {/* Mid hills — slightly lighter */}
        <path
          d={`M 0,${HORIZON + 2}
              Q 180,${HORIZON - 34} 380,${HORIZON - 18}
              Q 540,${HORIZON - 46} 720,${HORIZON - 22}
              Q 880,${HORIZON - 10} 1050,${HORIZON - 36}
              Q 1230,${HORIZON - 58} 1420,${HORIZON - 28}
              Q 1530,${HORIZON - 16} 1600,${HORIZON - 32}
              L 1600,${HORIZON + 2} Z`}
          fill="#0a0810"
          opacity={0.80}
        />

        {/* ===== GROUND / PASTURE ===== */}
        <path
          d={`M 0,${HORIZON}
              Q 200,${HORIZON - 8} 420,${HORIZON + 10}
              Q 640,${HORIZON + 22} 850,${HORIZON + 6}
              Q 1060,${HORIZON - 8} 1280,${HORIZON + 14}
              Q 1460,${HORIZON + 26} 1600,${HORIZON + 6}
              L 1600,900 L 0,900 Z`}
          fill="url(#groundGrad)"
        />
        {/* Fire glow pool ON TOP of ground — warm amber around campfire */}
        <path
          d={`M 0,${HORIZON}
              Q 200,${HORIZON - 8} 420,${HORIZON + 10}
              Q 640,${HORIZON + 22} 850,${HORIZON + 6}
              Q 1060,${HORIZON - 8} 1280,${HORIZON + 14}
              Q 1460,${HORIZON + 26} 1600,${HORIZON + 6}
              L 1600,900 L 0,900 Z`}
          fill="url(#fireGround)"
        />
        {/* Horizon edge line */}
        <path
          d={`M 0,${HORIZON}
              Q 200,${HORIZON - 8} 420,${HORIZON + 10}
              Q 640,${HORIZON + 22} 850,${HORIZON + 6}
              Q 1060,${HORIZON - 8} 1280,${HORIZON + 14}
              Q 1460,${HORIZON + 26} 1600,${HORIZON + 6}`}
          stroke="rgba(70,40,20,0.55)"
          strokeWidth={2.5}
          fill="none"
        />

        {/* ===== PINE TREES — LEFT GROUP (fire-lit, 4 trees) ===== */}
        {/* Furthest back — smallest, most faded */}
        <PineTreeSilhouette cx={430} base={TREE_BASE} h={188} firelit />
        {/* Mid back */}
        <PineTreeSilhouette cx={220} base={TREE_BASE} h={248} firelit />
        {/* Mid front */}
        <PineTreeSilhouette cx={90}  base={TREE_BASE} h={298} firelit />
        {/* Closest — tallest, extends out of frame on far left */}
        <PineTreeSilhouette cx={-22} base={TREE_BASE} h={340} firelit />

        {/* ===== HOUSE ===== */}
        <House cx={HOUSE_CX} groundY={HOUSE_GY} />

        {/* ===== PINE TREES — RIGHT GROUP (moon-lit, 4 trees) ===== */}
        {/* Furthest back */}
        <PineTreeSilhouette cx={1160} base={TREE_BASE} h={192} moonlit />
        {/* Mid back */}
        <PineTreeSilhouette cx={1310} base={TREE_BASE} h={245} moonlit />
        {/* Mid front */}
        <PineTreeSilhouette cx={1470} base={TREE_BASE} h={295} moonlit />
        {/* Closest — tallest, bleeds off right edge */}
        <PineTreeSilhouette cx={1616} base={TREE_BASE} h={335} moonlit />

        {/* ===== CAMPFIRE ===== */}
        <Campfire cx={FIRE_CX} groundY={FIRE_GY} />
      </svg>
    </>
  );
});