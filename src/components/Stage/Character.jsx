import { memo } from 'react';

// Receives only stable refs — memo prevents re-renders on every game state change
export default memo(function Character({ envelopeGroupRef, browsRef }) {
  return (
    <g id="envelopeGroup" ref={envelopeGroupRef}>
      {/* Envelope Body */}
      <rect x="70" y="262" width="260" height="170" rx="12" className="parchment-fill ink-line" />

      {/* Envelope Bottom Flap */}
      <path d="M70,432 L200,335 L330,432" className="ink-line parchment-shade-fill" />

      {/* Envelope Top Flap */}
      <path d="M70,262 L200,347 L330,262" className="ink-line parchment-fill" />

      {/* Heart Seal */}
      <g transform="translate(200, 347) scale(1.15, 0.8) translate(-200, -335)">
        <path d="M200,355 C200,355 185,340 185,325 C185,310 200,310 200,325 C200,310 215,310 215,325 C215,340 200,355 200,355 Z" className="ink-line" style={{ fill: 'var(--ember)' }} />
      </g>

      {/* Worried brows (hidden until caught) */}
      <g id="brows" ref={browsRef} opacity="0">
        <path d="M168,295 Q176,287 186,292" className="ink-line" strokeWidth="3.5" />
        <path d="M214,292 Q224,287 232,295" className="ink-line" strokeWidth="3.5" />
      </g>

      {/* Cowboy Hat - Authentic Silhouette */}
      <g id="hatGroup" transform="translate(0, 48)">
        {/* Back Brim / Underside */}
        <path d="M 60,140 Q 200,165 340,140 Q 200,190 60,140 Z" className="parchment-shade-fill ink-line" />

        {/* Crown */}
        <path d="M 130,165 C 130,100 150,80 170,80 Q 200,95 230,80 C 250,80 270,100 270,165" className="parchment-shade-fill ink-line" />

        {/* Crown Crease Details */}
        <path d="M 160,100 Q 200,115 240,100" fill="none" className="ink-line" />
        <path d="M 180,85 Q 200,100 220,85" fill="none" className="ink-line" />

        {/* Hat Band */}
        <path d="M 132,150 Q 200,165 268,150 L 270,165 Q 200,180 130,165 Z" fill="var(--leather)" className="ink-line" />

        {/* Front Brim */}
        <path d="M 60,140 C 60,210 130,180 200,180 C 270,180 340,210 340,140 C 340,170 310,195 200,195 C 90,195 60,170 60,140 Z" className="parchment-fill ink-line" />
      </g>
    </g>
  );
});
