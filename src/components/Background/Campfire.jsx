/* -------------------------------------------------------
   Campfire
------------------------------------------------------- */
export default function Campfire({ cx, groundY }) {
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
