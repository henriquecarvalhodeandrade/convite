/* -------------------------------------------------------
   PineTreeSilhouette
   Solid dark fill + thin highlight stroke for a crisp
   night-sky silhouette look.
   cx, base = bottom-center; h = height
------------------------------------------------------- */
export default function PineTreeSilhouette({ cx, base, h, firelit = false, moonlit = false }) {
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
