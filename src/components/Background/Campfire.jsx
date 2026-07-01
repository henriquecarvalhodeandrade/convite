/* -------------------------------------------------------
   Campfire  — v2
   Richer campfire with:
     • Perspective logs (3 logs, not just crossed X)
     • Layered ground glow rings
     • Stone ring around base
     • More flame layers with better gradients
     • Brighter, more animated embers
   Props: cx, groundY
------------------------------------------------------- */
export default function Campfire({ cx, groundY }) {
  const ly = groundY;
  const uid = `fire-${cx}`;

  /* Stones in a rough circle around the fire */
  const stones = [
    { ox: -36, oy: 4,  rx: 10, ry: 6,  rot: -15 },
    { ox: -24, oy: 10, rx: 9,  ry: 5,  rot: 8   },
    { ox:  -8, oy: 13, rx: 10, ry: 5,  rot: 0   },
    { ox:  10, oy: 13, rx: 10, ry: 5,  rot: 5   },
    { ox:  26, oy: 10, rx: 9,  ry: 6,  rot: -8  },
    { ox:  40, oy: 4,  rx: 10, ry: 6,  rot: 14  },
    { ox: -46, oy: -5, rx: 8,  ry: 5,  rot: -20 },
    { ox:  48, oy: -5, rx: 8,  ry: 5,  rot: 20  },
  ];

  /* Rising embers */
  const embers = [
    { ox: -22, oy: -28, cls: 'ember-svg e1' },
    { ox:   6, oy: -20, cls: 'ember-svg e2' },
    { ox:  30, oy: -16, cls: 'ember-svg e3' },
    { ox:  -6, oy: -18, cls: 'ember-svg e4' },
    { ox:  18, oy: -24, cls: 'ember-svg e1' },
    { ox: -14, oy: -12, cls: 'ember-svg e2' },
  ];

  return (
    <g>
      <defs>
        {/* Main flame gradient — cool at tip, hot at base */}
        <linearGradient id={`fgMain-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#c97b30" />
          <stop offset="30%"  stopColor="#e8951e" />
          <stop offset="65%"  stopColor="#c84c20" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8f2a10" stopOpacity="0"   />
        </linearGradient>
        {/* Inner bright core gradient */}
        <linearGradient id={`fgCore-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#f4c040" />
          <stop offset="50%"  stopColor="#f8d060" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff"  stopOpacity="0"  />
        </linearGradient>
      </defs>

      {/* ===== GROUND GLOW HALOS ===== */}
      <ellipse cx={cx} cy={ly + 8}  rx={160} ry={38} fill="#8f3a1f" opacity={0.08} />
      <ellipse cx={cx} cy={ly + 6}  rx={110} ry={26} fill="#b8512c" opacity={0.12} />
      <ellipse cx={cx} cy={ly + 4}  rx={70}  ry={18} fill="#c97b30" opacity={0.18} />
      <ellipse cx={cx} cy={ly + 2}  rx={42}  ry={11} fill="#e09030" opacity={0.20} />
      <ellipse cx={cx} cy={ly}      rx={22}  ry={7}  fill="#f4c873" opacity={0.22} />

      {/* ===== STONE RING ===== */}
      {stones.map((st, i) => (
        <ellipse
          key={i}
          cx={cx + st.ox} cy={ly + st.oy}
          rx={st.rx} ry={st.ry}
          transform={`rotate(${st.rot}, ${cx + st.ox}, ${ly + st.oy})`}
          fill="#1c1208"
          stroke="rgba(120,80,40,0.4)"
          strokeWidth={1}
        />
      ))}
      {/* Stone highlight (fire glow on top-facing surfaces) */}
      {stones.map((st, i) => (
        <ellipse
          key={`h${i}`}
          cx={cx + st.ox} cy={ly + st.oy - st.ry * 0.4}
          rx={st.rx * 0.7} ry={st.ry * 0.35}
          transform={`rotate(${st.rot}, ${cx + st.ox}, ${ly + st.oy})`}
          fill="#c97b30"
          opacity={0.14}
        />
      ))}

      {/* ===== LOGS (3 logs in perspective, radiating from centre) ===== */}
      {/* Log A — leaning left-forward */}
      <line x1={cx - 52} y1={ly + 8}  x2={cx + 12} y2={ly - 18}
            stroke="#221408" strokeWidth={14} strokeLinecap="round" />
      <line x1={cx - 52} y1={ly + 8}  x2={cx + 12} y2={ly - 18}
            stroke="#3a2010" strokeWidth={9}  strokeLinecap="round" />
      {/* Log A highlight */}
      <line x1={cx - 46} y1={ly + 3}  x2={cx + 8}  y2={ly - 14}
            stroke="#7a5030" strokeWidth={3}  strokeLinecap="round" opacity={0.5} />

      {/* Log B — leaning right-forward */}
      <line x1={cx + 55} y1={ly + 8}  x2={cx - 10} y2={ly - 18}
            stroke="#221408" strokeWidth={14} strokeLinecap="round" />
      <line x1={cx + 55} y1={ly + 8}  x2={cx - 10} y2={ly - 18}
            stroke="#3a2010" strokeWidth={9}  strokeLinecap="round" />
      {/* Log B highlight — right side catches more fire light */}
      <line x1={cx + 49} y1={ly + 4}  x2={cx - 4}  y2={ly - 14}
            stroke="#c97b30" strokeWidth={3}  strokeLinecap="round" opacity={0.35} />

      {/* Log C — going straight back into fire */}
      <line x1={cx - 16} y1={ly + 10} x2={cx + 18} y2={ly - 24}
            stroke="#1a1006" strokeWidth={12} strokeLinecap="round" />
      <line x1={cx - 16} y1={ly + 10} x2={cx + 18} y2={ly - 24}
            stroke="#2e1a0c" strokeWidth={7}  strokeLinecap="round" />

      {/* ===== EMBER BED ===== */}
      <ellipse cx={cx + 2} cy={ly - 10} rx={28} ry={9}  fill="#d07010" opacity={0.55} />
      <ellipse cx={cx}     cy={ly - 12} rx={16} ry={6}  fill="#f4c040" opacity={0.50} />
      <ellipse cx={cx - 2} cy={ly - 13} rx={8}  ry={3}  fill="#ffffff"  opacity={0.18} />

      {/* ===== FLAMES ===== */}
      {/* Outer flame — wide amber base */}
      <path className="flame flame-outer"
            d={`M${cx-46},${ly-6}
                C${cx-32},${ly-60} ${cx-14},${ly-80} ${cx},${ly-112}
                C${cx+14},${ly-80} ${cx+32},${ly-60} ${cx+46},${ly-6}`}
            fill={`url(#fgMain-${uid})`} opacity={0.88} />

      {/* Left lean flame */}
      <path className="flame flame-left"
            d={`M${cx-30},${ly-10}
                C${cx-44},${ly-52} ${cx-28},${ly-80} ${cx-12},${ly-100}
                C${cx-5},${ly-72} ${cx-16},${ly-48} ${cx-22},${ly-10}`}
            fill="#d07828" opacity={0.82} />

      {/* Right lean flame */}
      <path className="flame flame-right"
            d={`M${cx+30},${ly-10}
                C${cx+44},${ly-52} ${cx+28},${ly-82} ${cx+14},${ly-102}
                C${cx+8},${ly-72} ${cx+18},${ly-48} ${cx+24},${ly-10}`}
            fill="#d07828" opacity={0.82} />

      {/* Bright core */}
      <path className="flame flame-core"
            d={`M${cx-18},${ly-12}
                C${cx-10},${ly-56} ${cx},${ly-84} ${cx},${ly-104}
                C${cx},${ly-84} ${cx+10},${ly-56} ${cx+18},${ly-12}`}
            fill={`url(#fgCore-${uid})`} opacity={0.96} />

      {/* White-hot tip */}
      <path className="flame flame-tip"
            d={`M${cx-7},${ly-18} C${cx-2},${ly-62} ${cx+3},${ly-84} ${cx},${ly-102}
                C${cx-2},${ly-84} ${cx-5},${ly-62} ${cx+7},${ly-18}`}
            fill="#fffef0" opacity={0.65} />

      {/* ===== RISING EMBERS ===== */}
      {embers.map((e, i) => (
        <circle key={i}
                cx={cx + e.ox} cy={ly + e.oy}
                r={2.8} fill="#f8c040"
                className={e.cls} opacity={0} />
      ))}
    </g>
  );
}
