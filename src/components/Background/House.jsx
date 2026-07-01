/* -------------------------------------------------------
   House  — v2
   A detailed ranch/farmhouse silhouette with:
     • Pitched roof with ridge cap and rake boards
     • Porch awning
     • Multiple windows with warm interior glow
     • Moon-lit rim shading on right-facing surfaces
     • Chimney with animated smoke
   Props: cx (centre-x), groundY
------------------------------------------------------- */
export default function House({ cx, groundY }) {
  const uid = `house-${cx}`;

  /* ---- Dimensions ---- */
  const bw = 130;   // body half-width
  const bh = 82;    // body height
  const by = groundY - bh;   // body top-y

  // Roof
  const rw  = bw + 14;  // roof overhang half-width
  const rh  = 52;       // roof height (apex above body top)
  const ry  = by - rh;  // apex y

  // Moon rim colour
  const rim   = 'rgba(180,205,240,0.65)';
  const rimTh = 1.6;

  return (
    <g opacity={0.9}>
      <defs>
        {/* Window warm glow */}
        <radialGradient id={`winGlow-${uid}`} cx="50%" cy="60%" r="55%">
          <stop offset="0%"   stopColor="#f5b84a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c97b30" stopOpacity="0"   />
        </radialGradient>
        {/* Body depth shading — darker left, lighter right (moonlit) */}
        <linearGradient id={`bodyShade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#06060e" />
          <stop offset="100%" stopColor="#0c0b16" />
        </linearGradient>
        {/* Roof depth */}
        <linearGradient id={`roofShade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#060509" />
          <stop offset="100%" stopColor="#0a0912" />
        </linearGradient>
      </defs>

      {/* ---- PORCH / AWNING ---- */}
      {/* Porch floor */}
      <rect
        x={cx - bw + 10} y={groundY - 6}
        width={bw * 0.7} height={6}
        fill="#0e0b08"
        stroke={rim} strokeWidth={1}
      />
      {/* Porch awning */}
      <path
        d={`M ${cx - bw + 8},${by + 28} L ${cx - bw * 0.22},${by + 28} L ${cx - bw * 0.22},${by + 22} L ${cx - bw + 8},${by + 18} Z`}
        fill="#09080d"
        stroke={rim} strokeWidth={rimTh * 0.8}
      />
      {/* Porch post */}
      <rect x={cx - bw + 10} y={by + 18} width={4} height={groundY - by - 18}
            fill="#0e0b08" stroke={rim} strokeWidth={0.8} />

      {/* ---- CHIMNEY (Behind House) ---- */}
      <rect
        x={cx + 28} y={ry - 20}
        width={16} height={by - ry + 20}
        fill="#080710"
        stroke={rim} strokeWidth={rimTh}
        rx={1}
      />
      {/* Chimney cap */}
      <rect x={cx + 25} y={ry - 22} width={22} height={5}
            fill="#09080d" stroke={rim} strokeWidth={1} rx={1} />

      {/* Smoke 1 */}
      <path className="smoke smoke-1"
            d={`M${cx+36},${ry-23} Q${cx+28},${ry-48} ${cx+38},${ry-66}`}
            stroke="rgba(200,210,235,0.22)" strokeWidth={4}
            fill="none" strokeLinecap="round" />
      {/* Smoke 2 */}
      <path className="smoke smoke-2"
            d={`M${cx+38},${ry-22} Q${cx+46},${ry-50} ${cx+34},${ry-70}`}
            stroke="rgba(200,210,235,0.14)" strokeWidth={3}
            fill="none" strokeLinecap="round" />

      {/* ---- BODY ---- */}
      <rect
        x={cx - bw} y={by}
        width={bw * 2} height={bh}
        fill={`url(#bodyShade-${uid})`}
        stroke={rim} strokeWidth={rimTh}
        strokeLinejoin="round"
      />

      {/* ---- ROOF ---- */}
      {/* Main roof planes */}
      <polygon
        points={`${cx - rw},${by}  ${cx + rw},${by}  ${cx},${ry}`}
        fill={`url(#roofShade-${uid})`}
        stroke={rim} strokeWidth={rimTh}
        strokeLinejoin="round"
      />
      {/* Ridge cap */}
      <line
        x1={cx - 6} y1={ry + 1} x2={cx + 6} y2={ry + 1}
        stroke={rim} strokeWidth={2.5} strokeLinecap="round"
      />
      {/* Rake boards (roof trim lines) */}
      <line x1={cx - rw} y1={by} x2={cx} y2={ry}
            stroke={rim} strokeWidth={1.2} opacity={0.6} />
      <line x1={cx + rw} y1={by} x2={cx} y2={ry}
            stroke={rim} strokeWidth={2.2} opacity={0.9} />



      {/* ---- WINDOWS ---- */}
      {/* Left window — dark (nobody home that side) */}
      <rect x={cx - bw + 22} y={by + 14} width={24} height={18}
            fill="#0a091a" stroke={rim} strokeWidth={1} rx={1} />
      {/* Window cross */}
      <line x1={cx - bw + 34} y1={by + 14} x2={cx - bw + 34} y2={by + 32}
            stroke={rim} strokeWidth={0.8} opacity={0.5} />
      <line x1={cx - bw + 22} y1={by + 23} x2={cx - bw + 46} y2={by + 23}
            stroke={rim} strokeWidth={0.8} opacity={0.5} />

      {/* Centre window — warm glow */}
      <rect x={cx - 12} y={by + 14} width={24} height={18}
            fill="#6a3a14" stroke={rim} strokeWidth={1} rx={1} />
      <rect x={cx - 12} y={by + 14} width={24} height={18}
            fill={`url(#winGlow-${uid})`} rx={1} />
      <ellipse cx={cx} cy={by + 32} rx={40} ry={12}
               fill="#f4c873" opacity={0.06} />
      {/* Window cross */}
      <line x1={cx} y1={by + 14} x2={cx} y2={by + 32}
            stroke="rgba(200,140,60,0.4)" strokeWidth={0.8} />
      <line x1={cx - 12} y1={by + 23} x2={cx + 12} y2={by + 23}
            stroke="rgba(200,140,60,0.4)" strokeWidth={0.8} />

      {/* Right window — bright warm glow (main room) */}
      <rect x={cx + bw - 46} y={by + 14} width={24} height={18}
            fill="#7a4b1a" stroke={rim} strokeWidth={1} rx={1} />
      <rect x={cx + bw - 46} y={by + 14} width={24} height={18}
            fill={`url(#winGlow-${uid})`} rx={1} />
      <ellipse cx={cx + bw - 34} cy={by + 32} rx={40} ry={12}
               fill="#f4c873" opacity={0.08} />
      {/* Window cross */}
      <line x1={cx + bw - 34} y1={by + 14} x2={cx + bw - 34} y2={by + 32}
            stroke="rgba(200,140,60,0.4)" strokeWidth={0.8} />
      <line x1={cx + bw - 46} y1={by + 23} x2={cx + bw - 22} y2={by + 23}
            stroke="rgba(200,140,60,0.4)" strokeWidth={0.8} />

      {/* ---- DOOR ---- */}
      <rect x={cx - 14} y={groundY - 38} width={28} height={38}
            fill="#090810" stroke={rim} strokeWidth={1} rx={2} />
      {/* Door arch */}
      <path d={`M ${cx - 14},${groundY - 20} A 14 20 0 0 1 ${cx + 14},${groundY - 20}`}
            fill="#0c0b16" stroke={rim} strokeWidth={0.8} />
      {/* Door knob */}
      <circle cx={cx + 9} cy={groundY - 18} r={2} fill={rim} opacity={0.5} />

      {/* ---- GROUND SHADOW ---- */}
      <ellipse cx={cx} cy={groundY + 4} rx={bw * 0.85} ry={6}
               fill="#000000" opacity={0.25} />
    </g>
  );
}