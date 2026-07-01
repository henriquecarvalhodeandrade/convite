import { memo } from 'react';

// Receives only stable refs — memo prevents re-renders on every game state change
export default memo(function LassoBack({ lassoBackLayerRef, loopBackRef }) {
  return (
    <g id="lassoBackLayer" ref={lassoBackLayerRef} opacity="0">
      <path
        id="loopBack"
        ref={loopBackRef}
        d=""
        fill="none"
        stroke="var(--rope)"
        strokeWidth="6"
      />
    </g>
  );
});
