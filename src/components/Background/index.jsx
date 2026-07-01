import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

import PineTreeSilhouette from './PineTreeSilhouette';
import House from './House';
import Campfire from './Campfire';

/* -------------------------------------------------------
   tsParticles — twinkling stars
------------------------------------------------------- */
const starsOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 120, density: { enable: true, area: 900 } },
    color: { value: ['#ffffff', '#e8f0ff', '#fff8e8', '#c8d8ff'] },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.05, max: 0.9 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: { value: { min: 0.2, max: 2.4 } },
    move: {
      enable: true, speed: 0.08, direction: 'none',
      random: true, straight: false,
      outModes: { default: 'bounce' },
    },
  },
  detectRetina: true,
};

/* -------------------------------------------------------
   Background — main export
------------------------------------------------------- */
export default function Background() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const HORIZON   = 638;
  const TREE_BASE = 648;
  const FIRE_CX   = 285;
  const FIRE_GY   = 648;

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
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#03040d" />
            <stop offset="45%"  stopColor="#070920" />
            <stop offset="78%"  stopColor="#100818" />
            <stop offset="100%" stopColor="#1c0f0c" />
          </linearGradient>
          <linearGradient id="milkyWay" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
            <stop offset="30%"  stopColor="#a0b0d0" stopOpacity="0.04" />
            <stop offset="55%"  stopColor="#c0c8e0" stopOpacity="0.07" />
            <stop offset="80%"  stopColor="#a0b0d0" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#skyGrad)" />
        <rect width="1600" height="900" fill="url(#milkyWay)" opacity={0.9} />
      </svg>

      {/* Stars (rendered between sky and foreground) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
        {init && <Particles id="tsparticles" options={starsOptions} />}
      </div>

      {/* ===== SCENE SVG (Foreground: Moon, Trees, House) ===== */}
      <svg
        className="scene-bg"
        style={{ zIndex: 0 }}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ground */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#17100c" />
            <stop offset="100%" stopColor="#090706" />
          </linearGradient>

          {/* Moon glow */}
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#e8eeff" stopOpacity="0.55" />
            <stop offset="45%"  stopColor="#c0cce8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6080b0" stopOpacity="0"    />
          </radialGradient>

          {/* Cool moonlight ambient — upper right */}
          <radialGradient id="moonAmbient" cx="82%" cy="0%" r="60%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#5068a8" stopOpacity="0.20" />
            <stop offset="55%"  stopColor="#303868" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#182030" stopOpacity="0"    />
          </radialGradient>

          {/* Campfire ambient glow — lower left */}
          <radialGradient id="fireAmbient" cx="17%" cy="92%" r="52%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#c97b30" stopOpacity="0.58" />
            <stop offset="32%"  stopColor="#b8512c" stopOpacity="0.30" />
            <stop offset="65%"  stopColor="#8f3a1f" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3a1500" stopOpacity="0"    />
          </radialGradient>

          {/* Flame gradient */}
          <linearGradient id="flameGrad1" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%"   stopColor="#c97b30"           />
            <stop offset="42%"  stopColor="#de9030"           />
            <stop offset="78%"  stopColor="#b8512c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8f3a1f" stopOpacity="0"   />
          </linearGradient>
        </defs>

        {/* Moon ambient (cool blue-white upper-right) */}
        <rect width="1600" height="900" fill="url(#moonAmbient)" />

        {/* Campfire ambient (warm amber lower-left) */}
        <rect width="1600" height="900" fill="url(#fireAmbient)" />

        {/* ===== MOON ===== */}
        {/* Outer glow halo */}
        <circle cx="1320" cy="132" r="148" fill="url(#moonGlow)" />
        {/* Moon body */}
        <circle cx="1320" cy="132" r="58" fill="#eef2fc" opacity={0.94} />
        {/* Moon craters / shading for realism */}
        <circle cx="1302" cy="122" r="18" fill="#d8dff0" opacity={0.38} />
        <circle cx="1335" cy="148" r="12" fill="#d8dff0" opacity={0.30} />
        <circle cx="1318" cy="112" r="9"  fill="#dce4f0" opacity={0.25} />
        <circle cx="1348" cy="120" r="7"  fill="#dce4f0" opacity={0.22} />

        {/* ===== DISTANT HILLS (depth layer) ===== */}
        <path
          d={`M 0,${HORIZON + 2}
              Q 120,${HORIZON - 55} 280,${HORIZON - 38}
              Q 420,${HORIZON - 62} 560,${HORIZON - 30}
              Q 680,${HORIZON - 10} 800,${HORIZON - 45}
              Q 920,${HORIZON - 72} 1060,${HORIZON - 44}
              Q 1180,${HORIZON - 20} 1320,${HORIZON - 52}
              Q 1460,${HORIZON - 80} 1600,${HORIZON - 50}
              L 1600,${HORIZON + 2} Z`}
          fill="#0b0910"
          opacity={0.85}
        />

        {/* ===== GROUND / PASTURE ===== */}
        <path
          d={`M 0,${HORIZON}
              Q 200,${HORIZON - 10} 400,${HORIZON + 8}
              Q 600,${HORIZON + 18} 800,${HORIZON + 5}
              Q 1000,${HORIZON - 6} 1200,${HORIZON + 12}
              Q 1400,${HORIZON + 22} 1600,${HORIZON + 4}
              L 1600,900 L 0,900 Z`}
          fill="url(#groundGrad)"
        />
        {/* Horizon edge — subtle */}
        <path
          d={`M 0,${HORIZON}
              Q 200,${HORIZON - 10} 400,${HORIZON + 8}
              Q 600,${HORIZON + 18} 800,${HORIZON + 5}
              Q 1000,${HORIZON - 6} 1200,${HORIZON + 12}
              Q 1400,${HORIZON + 22} 1600,${HORIZON + 4}`}
          stroke="rgba(80,50,30,0.5)"
          strokeWidth={2}
          fill="none"
        />

        {/* ===== PINE TREES — LEFT (fire-lit, warm edges) ===== */}
        <PineTreeSilhouette cx={68}  base={TREE_BASE} h={305} firelit />
        <PineTreeSilhouette cx={200} base={TREE_BASE} h={258} firelit />
        <PineTreeSilhouette cx={345} base={TREE_BASE} h={210} firelit />

        {/* ===== PINE TREES — RIGHT (moon-lit, cool edges) ===== */}
        <PineTreeSilhouette cx={1258} base={TREE_BASE} h={215} moonlit />
        <PineTreeSilhouette cx={1402} base={TREE_BASE} h={265} moonlit />
        <PineTreeSilhouette cx={1542} base={TREE_BASE} h={312} moonlit />

        {/* ===== HOUSE ===== */}
        <House cx={895} groundY={HORIZON} />

        {/* ===== CAMPFIRE ===== */}
        <Campfire cx={FIRE_CX} groundY={FIRE_GY} />
      </svg>
    </>
  );
}
