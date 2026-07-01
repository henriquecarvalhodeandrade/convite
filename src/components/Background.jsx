import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

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
   PineTreeSilhouette
   Solid dark fill + thin highlight stroke for a crisp
   night-sky silhouette look.
   cx, base = bottom-center; h = height
------------------------------------------------------- */
function PineTreeSilhouette({ cx, base, h, firelit = false, moonlit = false }) {
  const s   = h / 260;
  const mw  = 82 * s;            // max half-width
  const top = base - h;

  // Tiers: [relY from top, relHalfWidth]
  const tiers = [
    [0.08, 0.14],
    [0.20, 0.29],
    [0.34, 0.46],
    [0.49, 0.63],
    [0.65, 0.80],
    [0.82, 0.94],
    [0.94, 1.00],
  ];

  // Build right side: apex → each tier tip → step-in → next tier
  const rPts = [`${cx},${top}`];
  tiers.forEach(([ry, rw], i) => {
    const y    = top + h * ry;
    const x    = cx + mw * rw;
    const drp  = mw * rw * 0.13;           // tip droop
    const tipY = y + drp;

    rPts.push(`${x},${tipY}`);

    if (i < tiers.length - 1) {
      // Step-in point before next tier
      const stepRw = tiers[i + 1][1] * 0.55;
      rPts.push(`${cx + mw * stepRw},${tipY}`);
    }
  });

  // Trunk right → trunk left → mirror left side
  const trunkHW = Math.max(5 * s, 3.5);
  rPts.push(`${cx + trunkHW},${base}`);

  const lPts = [`${cx - trunkHW},${base}`];
  tiers.slice().reverse().forEach(([ry, rw], i) => {
    const revIdx = tiers.length - 1 - i;
    const y      = top + h * ry;
    const x      = cx - mw * rw;
    const drp    = mw * rw * 0.13;
    const tipY   = y + drp;

    if (revIdx > 0) {
      const stepRw = tiers[revIdx - 1][1] * 0.55;
      lPts.push(`${cx - mw * stepRw},${tipY}`);
    }
    lPts.push(`${x},${tipY}`);
  });

  const d = `M ${rPts.join(' L ')} L ${lPts.join(' L ')} Z`;

  // Fire-lit trees (left) get warm amber edge; moon-lit (right) get cool blue-white edge
  const hlColor = firelit
    ? 'rgba(200,130,60,0.55)'
    : moonlit
      ? 'rgba(180,200,240,0.55)'
      : 'rgba(255,255,255,0.35)';

  return (
    <g>
      <path d={d} fill="#070608" />
      <path d={d} fill="none" stroke={hlColor} strokeWidth="1.6" strokeLinejoin="round" />
    </g>
  );
}

/* -------------------------------------------------------
   House
------------------------------------------------------- */
function House({ cx, groundY }) {
  const w = 78;
  const h = 50;
  const s = 'rgba(180,200,230,0.6)';    // moon-lit edges — cool blue-white

  return (
    <g opacity={0.8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Body */}
      <rect x={cx - w/2} y={groundY - h} width={w} height={h}
            fill="#0b0a10" stroke={s} strokeWidth={1.5} />
      {/* Roof */}
      <polygon
        points={`${cx - w/2 - 9},${groundY - h}  ${cx + w/2 + 9},${groundY - h}  ${cx},${groundY - h - 36}`}
        fill="#090810" stroke={s} strokeWidth={1.5}
      />
      {/* Chimney */}
      <rect x={cx + 18} y={groundY - h - 46} width={11} height={30}
            fill="#090810" stroke={s} strokeWidth={1.5} />
      {/* Smoke */}
      <path className="smoke smoke-1"
            d={`M${cx+23},${groundY-h-47} Q${cx+17},${groundY-h-61} ${cx+25},${groundY-h-74}`}
            stroke="rgba(200,210,230,0.25)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path className="smoke smoke-2"
            d={`M${cx+25},${groundY-h-48} Q${cx+31},${groundY-h-64} ${cx+21},${groundY-h-78}`}
            stroke="rgba(200,210,230,0.15)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Left window — dark */}
      <rect x={cx - w/2 + 10} y={groundY - h + 11} width={18} height={14}
            fill="#12101a" stroke={s} strokeWidth={1} />
      {/* Right window — warm glow (light inside!) */}
      <rect x={cx + w/2 - 28} y={groundY - h + 11} width={18} height={14}
            fill="#7a4b20" stroke={s} strokeWidth={1} />
      <rect x={cx + w/2 - 28} y={groundY - h + 11} width={18} height={14}
            fill="#f4c873" opacity={0.28} />
      {/* Door */}
      <rect x={cx - 9} y={groundY - 28} width={18} height={28}
            fill="#090810" stroke={s} strokeWidth={1} rx={1} />
    </g>
  );
}

/* -------------------------------------------------------
   Campfire
------------------------------------------------------- */
function Campfire({ cx, groundY }) {
  const ly = groundY;
  return (
    <g>
      {/* Multi-ring glow */}
      <ellipse cx={cx} cy={ly + 10} rx={140} ry={34} fill="#b8512c" opacity={0.10} />
      <ellipse cx={cx} cy={ly + 8}  rx={88}  ry={22} fill="#c97b30" opacity={0.16} />
      <ellipse cx={cx} cy={ly + 5}  rx={48}  ry={12} fill="#f4c873" opacity={0.14} />

      {/* Logs (crossed X) */}
      <line x1={cx-68} y1={ly+3}   x2={cx+75} y2={ly-22}
            stroke="#2e1a09" strokeWidth={13} strokeLinecap="round" />
      <line x1={cx-62} y1={ly-22}  x2={cx+70} y2={ly+3}
            stroke="#2e1a09" strokeWidth={13} strokeLinecap="round" />
      <line x1={cx-62} y1={ly+3}   x2={cx+74} y2={ly-22}
            stroke="#3a2010" strokeWidth={9} strokeLinecap="round" />
      <line x1={cx-56} y1={ly-22}  x2={cx+65} y2={ly+3}
            stroke="#3a2010" strokeWidth={9} strokeLinecap="round" />
      {/* Log highlight */}
      <line x1={cx-48} y1={ly-8}   x2={cx+52} y2={ly-14}
            stroke="#7a4b27" strokeWidth={4} strokeLinecap="round" opacity={0.45} />
      {/* Ember bed */}
      <ellipse cx={cx+4} cy={ly-12} rx={30} ry={9} fill="#c97b30" opacity={0.5} />
      <ellipse cx={cx+3} cy={ly-13} rx={15} ry={5} fill="#f4c873" opacity={0.4} />

      {/* Outer flame (wide amber) */}
      <path className="flame flame-outer"
            d={`M${cx-42},${ly-8}
                C${cx-30},${ly-58} ${cx-12},${ly-75} ${cx},${ly-106}
                C${cx+12},${ly-75} ${cx+30},${ly-58} ${cx+42},${ly-8}`}
            fill="url(#flameGrad1)" opacity={0.84} />

      {/* Left lean */}
      <path className="flame flame-left"
            d={`M${cx-28},${ly-10}
                C${cx-38},${ly-48} ${cx-24},${ly-72} ${cx-10},${ly-94}
                C${cx-4},${ly-66} ${cx-14},${ly-44} ${cx-20},${ly-10}`}
            fill="#d08030" opacity={0.80} />

      {/* Right lean */}
      <path className="flame flame-right"
            d={`M${cx+28},${ly-10}
                C${cx+38},${ly-48} ${cx+24},${ly-74} ${cx+12},${ly-96}
                C${cx+6},${ly-66} ${cx+16},${ly-44} ${cx+22},${ly-10}`}
            fill="#d08030" opacity={0.80} />

      {/* Bright core */}
      <path className="flame flame-core"
            d={`M${cx-16},${ly-12}
                C${cx-9},${ly-52} ${cx},${ly-80} ${cx},${ly-98}
                C${cx},${ly-80} ${cx+9},${ly-52} ${cx+16},${ly-12}`}
            fill="#f4c873" opacity={0.94} />

      {/* White hot tip */}
      <path className="flame flame-tip"
            d={`M${cx-6},${ly-16} C${cx-2},${ly-58} ${cx+2},${ly-80} ${cx},${ly-96}
                C${cx-2},${ly-80} ${cx-4},${ly-58} ${cx+6},${ly-16}`}
            fill="#fffde0" opacity={0.60} />

      {/* Rising SVG embers */}
      {[
        { ox: -20, oy: -22, cls: 'ember-svg e1' },
        { ox:   8, oy: -18, cls: 'ember-svg e2' },
        { ox:  26, oy: -14, cls: 'ember-svg e3' },
        { ox:  -4, oy: -16, cls: 'ember-svg e4' },
        { ox:  18, oy: -20, cls: 'ember-svg e1' },
      ].map((e, i) => (
        <circle key={i} cx={cx + e.ox} cy={ly + e.oy}
                r={2.4} fill="#f4c873" className={e.cls} opacity={0} />
      ))}
    </g>
  );
}

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
      {/* Stars */}
      {init && <Particles id="tsparticles" options={starsOptions} />}

      {/* ===== SCENE SVG ===== */}
      <svg
        className="scene-bg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Night sky — deep blue-black, no longer brown */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#03040d" />
            <stop offset="45%"  stopColor="#070920" />
            <stop offset="78%"  stopColor="#100818" />
            <stop offset="100%" stopColor="#1c0f0c" />
          </linearGradient>

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

          {/* Milky way hint (very subtle horizontal band) */}
          <linearGradient id="milkyWay" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0"    />
            <stop offset="30%"  stopColor="#a0b0d0" stopOpacity="0.04" />
            <stop offset="55%"  stopColor="#c0c8e0" stopOpacity="0.07" />
            <stop offset="80%"  stopColor="#a0b0d0" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Sky base */}
        <rect width="1600" height="900" fill="url(#skyGrad)" />

        {/* Milky way subtle band */}
        <rect width="1600" height="900" fill="url(#milkyWay)" opacity={0.9} />

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
