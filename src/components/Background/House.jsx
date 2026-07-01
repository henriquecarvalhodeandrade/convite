/* -------------------------------------------------------
   House
------------------------------------------------------- */
export default function House({ cx, groundY }) {
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
