import { memo } from 'react';

/* -------------------------------------------------------
   PineTreeSilhouette — v2
   Organic silhouette with curved boughs, layered fills,
   and directional rim-lighting (fire-warm or moon-cool).
   Props: cx, base (bottom-centre), h (height),
          firelit (left side, warm amber rim),
          moonlit  (right side, cool blue rim)
------------------------------------------------------- */
// Props never change after mount — memo avoids re-running path calculations on game state updates
export default memo(function PineTreeSilhouette({ cx, base, h, firelit = false, moonlit = false }) {
  const s   = h / 280;        // scale factor
  const top = base - h;

  /* ---- unique IDs so multiple trees don't share gradient IDs ---- */
  const uid = `${cx}-${base}`;

  /* ---- Rim colour per lighting ---- */
  const rimColor   = firelit  ? '#e09040'
                   : moonlit  ? '#c8dcf0'
                   :            '#ffffff';
  const rimOpacity = firelit || moonlit ? 0.72 : 0.30;

  /* ---- Trunk ---- */
  const tw = Math.max(6 * s, 4);   // trunk half-width
  const th = Math.max(28 * s, 16); // trunk height

  /* ---- Bough tiers definition ----
     Each tier: [ relY-from-top, half-width-rel, droop-factor ]
     We generate curved paths for each tier (left & right bough)
     using cubic beziers for a natural drooping look.           */
  const tiers = [
    [0.06, 0.12, 0.06],
    [0.17, 0.26, 0.10],
    [0.30, 0.42, 0.14],
    [0.43, 0.57, 0.18],
    [0.57, 0.72, 0.22],
    [0.71, 0.86, 0.26],
    [0.85, 0.97, 0.28],
    [0.96, 1.00, 0.28],
  ];

  const mw = 96 * s; // max half-width

  /* ---- Build the main silhouette as a poly-bezier ----
     Strategy: top → right boughs (each a 3-pt cubic) →
               trunk-right → trunk-left → left boughs (mirror) → close
  */
  const buildSilhouette = () => {
    let d = `M ${cx} ${top}`;

    /* Right side — top to bottom */
    tiers.forEach(([ry, rw, df], i) => {
      const y     = top + h * ry;
      const tipX  = cx + mw * rw;
      const tipY  = y + mw * rw * df;       // drooping tip
      const prevY = i === 0 ? top : top + h * tiers[i - 1][0];
      const midY  = (prevY + y) / 2;

      // Cubic bezier: leave apex vertically, arrive at tip from above-right
      d += ` C ${cx + mw * rw * 0.3},${midY}  ${tipX},${y}  ${tipX},${tipY}`;

      // Step back toward trunk before next tier
      if (i < tiers.length - 1) {
        const nextRw  = tiers[i + 1][1];
        const stepX   = cx + mw * nextRw * 0.48;
        d += ` L ${stepX},${tipY}`;
      }
    });

    /* Trunk */
    d += ` L ${cx + tw},${base - th} L ${cx + tw},${base}`;
    d += ` L ${cx - tw},${base} L ${cx - tw},${base - th}`;

    /* Left side — bottom to top (mirror) */
    tiers.slice().reverse().forEach(([ry, rw, df], i) => {
      const revIdx = tiers.length - 1 - i;
      const y     = top + h * ry;
      const tipX  = cx - mw * rw;
      const tipY  = y + mw * rw * df;
      const nextY = revIdx > 0
        ? top + h * tiers[revIdx - 1][0]
        : top;
      const midY  = (tipY + nextY) / 2;

      if (revIdx > 0) {
        const prevRw = tiers[revIdx - 1][1];
        const stepX  = cx - mw * prevRw * 0.48;
        d += ` L ${stepX},${tipY}`;
      }
      d += ` C ${tipX},${tipY}  ${cx - mw * rw * 0.3},${midY}  ${cx},${nextY === top ? top : nextY}`;
    });

    d += ' Z';
    return d;
  };

  /* ---- Bough highlight paths ----
     Draw the upper surface of each bough on the lit face:
     – firelit: LEFT boughs catch the fire glow (sign = -1)
     – moonlit: RIGHT boughs catch the moon glow  (sign = +1)  */
  const buildRimLines = () => {
    // fire is to the LEFT of the left trees  → illuminate LEFT  boughs (sign -1)
    // moon is to the RIGHT of the right trees → illuminate RIGHT boughs (sign +1)
    const sign = firelit ? -1 : 1;

    return tiers.map(([ry, rw, df], i) => {
      const y     = top + h * ry;
      const tipX  = cx + sign * mw * rw;
      const tipY  = y + mw * rw * df;
      const prevY = i === 0 ? top : top + h * tiers[i - 1][0];
      const midY  = (prevY + y) / 2;

      const d = `M ${cx} ${i === 0 ? top : top + h * tiers[i - 1][0]}`
              + ` C ${cx + sign * mw * rw * 0.3},${midY} ${tipX},${y} ${tipX},${tipY}`;
      return d;
    });
  };

  const silhouette = buildSilhouette();
  const rimLines   = (firelit || moonlit) ? buildRimLines() : [];

  return (
    <g>
      {/* ---- Gradient definitions ---- */}
      <defs>
        {/* Subtle depth fill: warm tint on firelit side, cool on moonlit */}
        <linearGradient
          id={`treeGrad-${uid}`}
          x1={firelit ? '0%' : moonlit ? '100%' : '50%'} y1="0%"
          x2={firelit ? '100%' : moonlit ? '0%' : '50%'} y2="0%"
        >
          {/* firelit: warm left edge; moonlit: cool right edge */}
          <stop offset="0%"   stopColor={firelit ? '#1c1008' : moonlit ? '#060811' : '#060408'} />
          <stop offset="100%" stopColor="#050407" />
        </linearGradient>

        {/* Rim light fade:
            firelit → glow on the LEFT  face (x1=0% bright → x2=100% transparent)
            moonlit → glow on the RIGHT face (x1=100% bright → x2=0% transparent) */}
        <linearGradient
          id={`rimFade-${uid}`}
          x1={firelit ? '0%' : '100%'} y1="0%"
          x2={firelit ? '100%' : '0%'} y2="0%"
        >
          <stop offset="0%"   stopColor={rimColor} stopOpacity={rimOpacity} />
          <stop offset="45%"  stopColor={rimColor} stopOpacity={rimOpacity * 0.35} />
          <stop offset="100%" stopColor={rimColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ---- Main dark silhouette ---- */}
      <path d={silhouette} fill={`url(#treeGrad-${uid})`} />

      {/* ---- Rim stroke on the lit side only ---- */}
      {(firelit || moonlit) && rimLines.map((rd, i) => (
        <path
          key={i}
          d={rd}
          fill="none"
          stroke={`url(#rimFade-${uid})`}
          strokeWidth={Math.max(1.8 * s, 1.2)}
          strokeLinecap="round"
          opacity={0.85 - i * 0.06}     // fade slightly toward base
        />
      ))}

      {/* ---- Whole-silhouette rim glow (thin outer edge) ---- */}
      <path
        d={silhouette}
        fill="none"
        stroke={`url(#rimFade-${uid})`}
        strokeWidth={Math.max(2.2 * s, 1.4)}
        strokeLinejoin="round"
      />

      {/* ---- Trunk ---- */}
      <rect
        x={cx - tw} y={base - th}
        width={tw * 2} height={th}
        rx={tw * 0.4}
        fill="#150e07"
      />
    </g>
  );
});
