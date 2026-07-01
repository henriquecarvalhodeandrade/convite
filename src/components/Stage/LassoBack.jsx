export default function LassoBack({ lassoBackLayerRef, loopBackRef }) {
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
}
