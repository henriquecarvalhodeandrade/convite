import { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

import { useLasso } from '../../hooks/useLasso';
import { LOOP_REST } from '../../constants';
import Character from './Character';
import LassoBack from './LassoBack';
import LassoFront from './LassoFront';

import IdleScreen    from '../IdleScreen';
import CaughtScreen  from '../CaughtScreen';
import RevealScreen  from '../RevealScreen';
import RestartButton from '../RestartButton';

export default function Stage({ state, dispatch }) {
  /* Sync phase to a ref so stable callbacks can read it */
  const phaseRef = useRef(state.phase);
  useEffect(() => { phaseRef.current = state.phase; }, [state.phase]);

  /* ---- SVG element refs ---- */
  const artRef            = useRef(null);
  const envelopeGroupRef  = useRef(null);
  const lassoLayerRef     = useRef(null);
  const lassoBackLayerRef = useRef(null);
  const ropeRef           = useRef(null);
  const loopRef           = useRef(null);
  const loopBackRef       = useRef(null);
  const loopFrontRef      = useRef(null);
  const browsRef          = useRef(null);

  /* ---- Lasso hook ---- */
  const { handlePointerDown, snapLoopToTarget, resetRopePos, drawRope } = useLasso({
    artRef,
    ropeRef,
    loopRef,
    loopBackRef,
    loopFrontRef,
    phaseRef,
    dispatch,
  });

  /* ====================================================
     GSAP EFFECTS
  ==================================================== */

  /* Shake animation (big → mid → small → none) */
  useEffect(() => {
    const el = envelopeGroupRef.current;
    if (!el) return;
    gsap.killTweensOf(el);

    if (!state.shake || state.shake === 'none') {
      gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.3, ease: 'power2.out' });
      return;
    }

    /* Respect prefers-reduced-motion — skip shake timeline */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cfgs = {
      big:   { x: 7,   rotation: 3.2, dur: 0.42 },
      mid:   { x: 4,   rotation: 1.8, dur: 0.50 },
      small: { x: 1.6, rotation: 0.6, dur: 0.60 },
    };
    const cfg = cfgs[state.shake];

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(el, { x: -cfg.x, y:  1, rotation: -cfg.rotation, duration: cfg.dur * 0.25, ease: 'sine.inOut' })
      .to(el, { x:      0, y: -2, rotation:            0, duration: cfg.dur * 0.25, ease: 'sine.inOut' })
      .to(el, { x:  cfg.x, y:  1, rotation:  cfg.rotation, duration: cfg.dur * 0.25, ease: 'sine.inOut' })
      .to(el, { x:      0, y:  0, rotation:            0, duration: cfg.dur * 0.25, ease: 'sine.inOut' });

    return () => tl.kill();
  }, [state.shake]);

  /* Worried brows fade */
  useEffect(() => {
    if (!browsRef.current) return;
    gsap.to(browsRef.current, {
      opacity: state.browsVisible ? 1 : 0,
      duration: 0.3,
    });
  }, [state.browsVisible]);

  /* Lasso layer fade in/out */
  useEffect(() => {
    if (!lassoLayerRef.current || !lassoBackLayerRef.current) return;
    gsap.to([lassoLayerRef.current, lassoBackLayerRef.current], {
      opacity: state.lassoVisible ? 1 : 0,
      duration: 0.3,
    });
  }, [state.lassoVisible]);

  /* Loop ellipse rx/ry (squeeze tightening) */
  useEffect(() => {
    if (!loopRef.current) return;
    gsap.to(loopRef.current, {
      attr: { rx: state.loopRx, ry: state.loopRy },
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        // Redraw front and back arcs based on updated rx/ry
        drawRope();
      }
    });
  }, [state.loopRx, state.loopRy, drawRope]);

  /* Opening → Revealed transition */
  useEffect(() => {
    if (state.phase !== 'opening') return;

    const tl = gsap.timeline({
      onComplete: () => dispatch({ type: 'REVEALED' }),
    });

    tl.to([lassoLayerRef.current, lassoBackLayerRef.current], { opacity: 0, duration: 0.5 }, 0.25)
      .to(envelopeGroupRef.current, {
          scale: 1.12,
          y: -6,
          svgOrigin: '200 330',
          duration: 0.7,
          ease: 'back.out(1.6)',
        }, 0.25)
      .to(envelopeGroupRef.current, { opacity: 0, duration: 0.6 }, 0.85);

    return () => tl.kill();
  }, [state.phase, dispatch]);

  /* ====================================================
     ACTIONS
  ==================================================== */

  /* Full reset */
  const handleReset = useCallback(() => {
    gsap.killTweensOf([
      envelopeGroupRef.current,
      lassoLayerRef.current,
      lassoBackLayerRef.current,
      loopRef.current,
      browsRef.current,
    ]);
    gsap.set(envelopeGroupRef.current, { clearProps: 'all' });
    gsap.set([lassoLayerRef.current, lassoBackLayerRef.current], { opacity: 0 });
    gsap.set(browsRef.current,         { opacity: 0 });
    gsap.set(loopRef.current,          { attr: { rx: LOOP_REST.rx, ry: LOOP_REST.ry } });
    resetRopePos();
    dispatch({ type: 'RESET' });
  }, [resetRopePos, dispatch]);

  /* handleSqueeze lives here — Stage owns dispatch, no need to thread it from App */
  const handleSqueeze = useCallback(() => dispatch({ type: 'SQUEEZE' }), [dispatch]);

  /* Keyboard accessibility shortcut */
  const handleSqueezeRef = useRef(handleSqueeze);
  useEffect(() => { handleSqueezeRef.current = handleSqueeze; }, [handleSqueeze]);

  useEffect(() => {
    function onKeydown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (phaseRef.current === 'idle') {
        // Skip aiming — snap to target directly
        snapLoopToTarget();
        if (lassoLayerRef.current && lassoBackLayerRef.current) {
          gsap.set([lassoLayerRef.current, lassoBackLayerRef.current], { opacity: 1 });
        }
        dispatch({ type: 'CATCH' });
      } else if (phaseRef.current === 'caught') {
        handleSqueezeRef.current();
      } else if (phaseRef.current === 'revealed') {
        // Enter/Space on the reveal screen restarts the game
        handleReset();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [dispatch, snapLoopToTarget, handleReset]);

  /* ====================================================
     RENDER
  ==================================================== */
  return (
    <>
      <div className="stage-wrap">
        <div
          id="stage"
          className={`stage${state.isAiming ? ' aiming' : ''}`}
          role="application"
          aria-label="Jogo de laço — arraste para laçar o envelope e revelar o convite"
          tabIndex={0}
          onPointerDown={handlePointerDown}
        >
          {/* =========== SVG ART =========== */}
          <svg
            id="art"
            ref={artRef}
            viewBox="0 0 400 760"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="cardGlow" cx="50%" cy="45%" r="60%">
                <stop offset="0%"   stopColor="#5a3a22" />
                <stop offset="100%" stopColor="#3a2415" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient glow behind character */}
            <ellipse cx="200" cy="330" rx="220" ry="240" fill="url(#cardGlow)" opacity="0.6" />

            {/* Subcomponents rendering layers */}
            <LassoBack lassoBackLayerRef={lassoBackLayerRef} loopBackRef={loopBackRef} />

            <Character envelopeGroupRef={envelopeGroupRef} browsRef={browsRef} />

            <LassoFront
              lassoLayerRef={lassoLayerRef}
              ropeRef={ropeRef}
              loopFrontRef={loopFrontRef}
              loopRef={loopRef}
            />
          </svg>

          {/* =========== HTML OVERLAYS =========== */}
          {/* Single AnimatePresence with mode='wait' ensures screens don't overlap during transitions */}
          <AnimatePresence mode="wait">
            {state.phase === 'idle' && (
              <IdleScreen key="idle" showMiss={state.showMiss} />
            )}
            {state.phase === 'caught' && (
              <CaughtScreen
                key={state.squeezeCount}
                squeezeCount={state.squeezeCount}
                onSqueeze={handleSqueeze}
              />
            )}
            {state.phase === 'revealed' && (
              <RevealScreen key="revealed" onReset={handleReset} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Restart button — dev only */}
      {import.meta.env.DEV && <RestartButton onReset={handleReset} />}
    </>
  );
}
