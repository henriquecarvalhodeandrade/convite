import { useRef, useCallback, useEffect } from 'react';
import { LASSO_TARGET, LASSO_ANCHOR, HIT_RADIUS, LOOP_INITIAL_POS } from '../constants';

/* -------------------------------------------------------
   useLasso
   – Handles all pointer events + SVG rope drawing.
   – Uses refs for performance: rope position is mutated
     directly in the DOM (avoids React re-renders at 60fps).
------------------------------------------------------- */
export function useLasso({ artRef, ropeRef, loopRef, loopBackRef, loopFrontRef, phaseRef, dispatch }) {
  const draggingRef   = useRef(false);
  const targetPosRef  = useRef({ ...LOOP_INITIAL_POS });
  const loopPosRef    = useRef({ ...LOOP_INITIAL_POS });
  const velocityRef   = useRef({ x: 0, y: 0 });
  const rafRef        = useRef(null);
  const timeoutsRef   = useRef([]); // tracks pending timeouts for cleanup

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
    const midX = (LASSO_ANCHOR.x + pos.x) / 2 + (pos.x - LASSO_ANCHOR.x) * 0.15;
    const midY = (LASSO_ANCHOR.y + pos.y) / 2;
    if (ropeRef.current) {
      ropeRef.current.setAttribute('d',
        `M${LASSO_ANCHOR.x},${LASSO_ANCHOR.y} Q${midX},${midY} ${pos.x},${pos.y}`);
    }
    if (loopRef.current) {
      loopRef.current.setAttribute('cx', String(pos.x));
      loopRef.current.setAttribute('cy', String(pos.y));
    }
    if (loopBackRef?.current && loopFrontRef?.current && loopRef.current) {
      const rx = parseFloat(loopRef.current.getAttribute('rx') || 46);
      const ry = parseFloat(loopRef.current.getAttribute('ry') || 32);
      // Back arc (sweeps from left to right over the top)
      loopBackRef.current.setAttribute('d', `M ${pos.x - rx} ${pos.y} A ${rx} ${ry} 0 0 1 ${pos.x + rx} ${pos.y}`);
      // Front arc (sweeps from left to right under the bottom)
      loopFrontRef.current.setAttribute('d', `M ${pos.x - rx} ${pos.y} A ${rx} ${ry} 0 0 0 ${pos.x + rx} ${pos.y}`);
    }
  }, [ropeRef, loopRef, loopBackRef, loopFrontRef]);

  /* Snap loop to target (used on hit and keyboard shortcut) */
  const snapLoopToTarget = useCallback(() => {
    loopPosRef.current = { ...LASSO_TARGET };
    drawRope();
  }, [drawRope]);

  /* Return loop to resting position */
  const resetRopePos = useCallback(() => {
    loopPosRef.current = { ...LOOP_INITIAL_POS };
    drawRope();
  }, [drawRope]);

  /* Physics loop — self-referential via a named inner function to avoid the
     ESLint react-hooks/refs error that occurs when writing to ref.current outside effects. */
  const updatePhysics = useCallback(() => {
    function loop() {
      if (phaseRef.current === 'aiming' && draggingRef.current) {
        const pos    = loopPosRef.current;
        const target = targetPosRef.current;
        const vel    = velocityRef.current;

        const tension = 0.12;
        const damping = 0.70; // Softer physics

        const dx = target.x - pos.x;
        const dy = target.y - pos.y;

        vel.x += dx * tension;
        vel.y += dy * tension;

        vel.x *= damping;
        vel.y *= damping;

        pos.x += vel.x;
        pos.y += vel.y;

        drawRope();
        rafRef.current = requestAnimationFrame(loop);
      }
    }
    loop();
  }, [drawRope, phaseRef]);

  /* ---- Pointer handlers ---- */

  const handlePointerDown = useCallback((evt) => {
    if (phaseRef.current !== 'idle') return;
    const p = svgPoint(evt);
    targetPosRef.current = { x: p.x, y: p.y };
    loopPosRef.current   = { x: p.x, y: p.y }; // Snap to pointer on start
    velocityRef.current  = { x: 0, y: 0 };
    draggingRef.current  = true;
    drawRope();
    dispatch({ type: 'START_AIMING' });

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updatePhysics());
  }, [svgPoint, drawRope, dispatch, phaseRef, updatePhysics]);

  const handlePointerMove = useCallback((evt) => {
    if (phaseRef.current !== 'aiming' || !draggingRef.current) return;
    evt.preventDefault(); // prevent iOS Safari scroll during drag
    const p = svgPoint(evt);
    targetPosRef.current = { x: p.x, y: p.y }; // Physics engine will chase this target
  }, [svgPoint, phaseRef]);

  const handlePointerUp = useCallback(() => {
    if (phaseRef.current !== 'aiming' || !draggingRef.current) return;
    draggingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const { x, y } = loopPosRef.current;
    const dx   = x - LASSO_TARGET.x;
    const dy   = y - LASSO_TARGET.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= HIT_RADIUS) {
      snapLoopToTarget();
      dispatch({ type: 'CATCH' });
    } else {
      // miss: rope slides and falls down smoothly
      const fallState = { cancelled: false };
      const fallPhysics = () => {
        if (fallState.cancelled) return;
        const pos = loopPosRef.current;
        const vel = velocityRef.current;

        // Constant gravity acceleration
        vel.y += 2.5;
        // Air friction
        vel.y *= 0.92;
        vel.x *= 0.92; // horizontal momentum decays

        pos.x += vel.x;
        pos.y += vel.y;

        drawRope();
        rafRef.current = requestAnimationFrame(fallPhysics);
      };

      rafRef.current = requestAnimationFrame(fallPhysics);

      const t1 = setTimeout(() => {
        fallState.cancelled = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        resetRopePos();
        dispatch({ type: 'MISS' });
        const t2 = setTimeout(() => dispatch({ type: 'HIDE_MISS' }), 1800);
        timeoutsRef.current.push(t2);
      }, 800); // fade out after falling for 800ms
      timeoutsRef.current.push(t1);
    }
  }, [snapLoopToTarget, drawRope, resetRopePos, dispatch, phaseRef]);

  /* Attach window-level events so drag works outside the stage area.
     pointermove uses { passive: false } so preventDefault() suppresses
     iOS Safari page scroll during the lasso drag gesture. */
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup',   handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup',   handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  /* Cleanup on unmount: cancel any pending animation frames and timeouts.
     Snapshot timeoutsRef.current into a local variable to avoid the
     react-hooks/exhaustive-deps warning about ref values changing in cleanup. */
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return { handlePointerDown, snapLoopToTarget, resetRopePos, drawRope };
}
