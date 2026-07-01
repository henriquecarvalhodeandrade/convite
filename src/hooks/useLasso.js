import { useRef, useCallback, useEffect } from 'react';

/* -------------------------------------------------------
   Constants
------------------------------------------------------- */
export const TARGET = { x: 200, y: 392 }; // belt/waist level of envelope body
const ANCHOR     = { x: 40,  y: 820 };   // off-screen lower-left (user's hand)
const HIT_RADIUS = 88;                    // generous — easier to lasso

/* -------------------------------------------------------
   useLasso
   – Handles all pointer events + SVG rope drawing.
   – Uses refs for performance: rope position is mutated
     directly in the DOM (avoids React re-renders at 60fps).
------------------------------------------------------- */
export function useLasso({ artRef, ropeRef, loopRef, phaseRef, dispatch }) {
  const draggingRef = useRef(false);
  const loopPosRef  = useRef({ x: 200, y: 540 });

  /* Convert screen coords → SVG viewBox coords */
  const svgPoint = useCallback((evt) => {
    const art = artRef.current;
    if (!art) return { x: 200, y: 400 };
    const pt  = art.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(art.getScreenCTM().inverse());
  }, [artRef]);

  /* Redraw the quadratic-bezier rope and reposition the loop */
  const drawRope = useCallback(() => {
    const pos  = loopPosRef.current;
    const midX = (ANCHOR.x + pos.x) / 2 + (pos.x - ANCHOR.x) * 0.15;
    const midY = (ANCHOR.y + pos.y) / 2;
    if (ropeRef.current) {
      ropeRef.current.setAttribute('d',
        `M${ANCHOR.x},${ANCHOR.y} Q${midX},${midY} ${pos.x},${pos.y}`);
    }
    if (loopRef.current) {
      loopRef.current.setAttribute('cx', String(pos.x));
      loopRef.current.setAttribute('cy', String(pos.y));
    }
  }, [ropeRef, loopRef]);

  /* Snap loop to target (used on hit and keyboard shortcut) */
  const snapLoopToTarget = useCallback(() => {
    loopPosRef.current = { x: TARGET.x, y: TARGET.y };
    drawRope();
  }, [drawRope]);

  /* Return loop to resting position */
  const resetRopePos = useCallback(() => {
    loopPosRef.current = { x: 200, y: 540 };
    drawRope();
  }, [drawRope]);

  /* ---- Pointer handlers ---- */

  const handlePointerDown = useCallback((evt) => {
    if (phaseRef.current !== 'idle') return;
    const p = svgPoint(evt);
    loopPosRef.current = { x: p.x, y: p.y };
    draggingRef.current = true;
    drawRope();
    dispatch({ type: 'START_AIMING' });
  }, [svgPoint, drawRope, dispatch, phaseRef]);

  const handlePointerMove = useCallback((evt) => {
    if (phaseRef.current !== 'aiming' || !draggingRef.current) return;
    const p   = svgPoint(evt);
    const pos = loopPosRef.current;
    // lerp for "swinging rope" feel
    pos.x += (p.x - pos.x) * 0.55;
    pos.y += (p.y - pos.y) * 0.55;
    drawRope();
  }, [svgPoint, drawRope, phaseRef]);

  const handlePointerUp = useCallback(() => {
    if (phaseRef.current !== 'aiming' || !draggingRef.current) return;
    draggingRef.current = false;

    const { x, y } = loopPosRef.current;
    const dx   = x - TARGET.x;
    const dy   = y - TARGET.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= HIT_RADIUS) {
      snapLoopToTarget();
      dispatch({ type: 'CATCH' });
    } else {
      // miss: rope falls down
      loopPosRef.current.y += 220;
      drawRope();
      setTimeout(() => {
        resetRopePos();
        dispatch({ type: 'MISS' });
        setTimeout(() => dispatch({ type: 'HIDE_MISS' }), 1800);
      }, 650);
    }
  }, [snapLoopToTarget, drawRope, resetRopePos, dispatch, phaseRef]);

  /* Attach window-level events so drag works outside the stage area */
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup',   handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup',   handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return { handlePointerDown, snapLoopToTarget, resetRopePos, drawRope };
}
