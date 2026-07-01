import { memo } from 'react';
import { LOOP_REST } from '../../constants';

// Receives only stable refs — memo prevents re-renders on every game state change
export default memo(function LassoFront({ lassoLayerRef, ropeRef, loopFrontRef, loopRef }) {
  return (
    <g id="lassoLayer" ref={lassoLayerRef} opacity="0">
      <path
        id="rope"
        ref={ropeRef}
        d=""
        className="ink-line"
        stroke="var(--rope)"
        strokeWidth="5"
        fill="none"
      />
      <path
        id="loopFront"
        ref={loopFrontRef}
        d=""
        fill="none"
        stroke="var(--rope)"
        strokeWidth="6"
      />
      {/* Hidden ellipse for GSAP to animate rx/ry attributes */}
      <ellipse
        id="loop"
        ref={loopRef}
        cx="200" cy="510"
        rx={LOOP_REST.rx} ry={LOOP_REST.ry}
        display="none"
      />
    </g>
  );
});
