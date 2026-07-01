import { useRef, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

import { useGameState }  from './hooks/useGameState';
import { useLasso }      from './hooks/useLasso';

import Background    from './components/Background';
import IdleScreen    from './components/IdleScreen';
import CaughtScreen  from './components/CaughtScreen';
import RevealScreen  from './components/RevealScreen';
import RestartButton from './components/RestartButton';

/* -------------------------------------------------------
   App — main orchestrator
------------------------------------------------------- */
export default function App() {
  const [state, dispatch] = useGameState();

  /* Sync phase to a ref so stable callbacks can read it */
  const phaseRef = useRef(state.phase);
  useEffect(() => { phaseRef.current = state.phase; }, [state.phase]);

  /* ---- SVG element refs ---- */
  const artRef           = useRef(null);
  const envelopeGroupRef = useRef(null);
  const lassoLayerRef    = useRef(null);
  const ropeRef          = useRef(null);
  const loopRef          = useRef(null);
  const browsRef         = useRef(null);
  const burstRef         = useRef(null);

  /* ---- Lasso hook ---- */
  const { handlePointerDown, snapLoopToTarget, resetRopePos } = useLasso({
    artRef,
    ropeRef,
    loopRef,
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
    if (!lassoLayerRef.current) return;
    gsap.to(lassoLayerRef.current, {
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
    });
  }, [state.loopRx, state.loopRy]);

  /* Opening → Revealed transition */
  useEffect(() => {
    if (state.phase !== 'opening') return;

    const tl = gsap.timeline({
      onComplete: () => dispatch({ type: 'REVEALED' }),
    });

    tl.to(lassoLayerRef.current, { opacity: 0, duration: 0.5 }, 0.25)
      .to(burstRef.current,      { opacity: 1, duration: 0.5 }, 0.25)
      .to(envelopeGroupRef.current, {
          scale: 1.12,
          y: -6,
          svgOrigin: '200 330',
          duration: 0.7,
          ease: 'back.out(1.6)',
        }, 0.25)
      .to(envelopeGroupRef.current, { opacity: 0, duration: 0.6 }, 0.85)
      .to(burstRef.current,         { opacity: 0, duration: 0.3 }, 1.0);

    return () => tl.kill();
  }, [state.phase, dispatch]);

  /* ====================================================
     ACTIONS
  ==================================================== */

  const handleSqueeze = useCallback(() => {
    dispatch({ type: 'SQUEEZE' });
  }, [dispatch]);

  /* Full reset (dev) */
  const handleReset = useCallback(() => {
    gsap.killTweensOf([
      envelopeGroupRef.current,
      lassoLayerRef.current,
      burstRef.current,
      loopRef.current,
      browsRef.current,
    ]);
    gsap.set(envelopeGroupRef.current, { clearProps: 'all' });
    gsap.set(lassoLayerRef.current,    { opacity: 0 });
    gsap.set(burstRef.current,         { opacity: 0 });
    gsap.set(browsRef.current,         { opacity: 0 });
    gsap.set(loopRef.current,          { attr: { rx: 46, ry: 32 } });
    resetRopePos();
    dispatch({ type: 'RESET' });
  }, [resetRopePos, dispatch]);

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
        if (lassoLayerRef.current) gsap.set(lassoLayerRef.current, { opacity: 1 });
        dispatch({ type: 'CATCH' });
      } else if (phaseRef.current === 'caught') {
        handleSqueezeRef.current();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [dispatch, snapLoopToTarget]);

  /* ====================================================
     RENDER
  ==================================================== */
  return (
    <>
      {/* ---- Fixed background (stars + fire) ---- */}
      <Background />

      {/* ---- Stage ---- */}
      <div className="stage-wrap">
        <div
          id="stage"
          className={`stage${state.isAiming ? ' aiming' : ''}`}
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

            {/* ===== ENVELOPE CHARACTER ===== */}
            <g id="envelopeGroup" ref={envelopeGroupRef}>
              {/* Body */}
              <rect x="96" y="262" width="208" height="220" rx="20"
                    className="parchment-fill ink-line" />

              {/* Belt */}
              <line x1="96" y1="400" x2="296" y2="400" className="ink-line" />
              <line x1="96" y1="410" x2="296" y2="410" className="ink-line" opacity="0.5" />
              <rect x="182" y="390" width="36" height="28" rx="4"
                    className="parchment-shade-fill ink-line" />
              <ellipse cx="200" cy="404" rx="9" ry="6"
                       fill="none" className="ink-line" strokeWidth="3.5" />

              {/* Neckerchief → knot */}
              <path d="M138,262 Q172,300 196,318" className="ink-line" strokeWidth="4" />
              <path d="M262,262 Q228,300 204,318" className="ink-line" strokeWidth="4" />
              <g id="knotGroup">
                <ellipse cx="200" cy="322" rx="22" ry="16"
                         fill="var(--rope)" className="ink-line" strokeWidth="3.5" />
                <path d="M190,318 Q200,326 210,316"
                      className="ink-line" strokeWidth="3" opacity="0.6" />
              </g>

              {/* Worried brows (hidden until caught) */}
              <g id="brows" ref={browsRef} opacity="0">
                <path d="M168,300 Q176,292 186,297" className="ink-line" strokeWidth="3.5" />
                <path d="M214,297 Q224,292 232,300" className="ink-line" strokeWidth="3.5" />
              </g>

              {/* Cowboy hat — REDESIGNED as proper sertanejo/country hat */}
              <g id="hatGroup">
                {/* Wide brim — THE key feature of a sertanejo hat */}
                <path
                  d="M 76,172
                     Q 85,152 126,142
                     Q 163,129 200,131
                     Q 237,129 274,142
                     Q 315,152 324,172
                     Q 306,194 200,190
                     Q 94,194 76,172 Z"
                  className="parchment-fill ink-line"
                />
                {/* Brim underside — creates depth on wide brim */}
                <path
                  d="M 80,174 Q 200,192 320,174"
                  fill="none"
                  stroke="var(--parchment-shade)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                {/* Crown body — medium height, dome shaped, wider than old version */}
                <path
                  d="M 148,168
                     C 144,152 142,134 146,114
                     Q 151,95 175,89
                     Q 190,84 200,85
                     Q 210,84 225,89
                     Q 249,95 254,114
                     C 258,134 256,152 252,168
                     Q 200,162 148,168 Z"
                  className="parchment-shade-fill ink-line"
                />
                {/* Cattleman crease — left side arch to left bump */}
                <path d="M 150,120 Q 154,100 172,92" fill="none" className="ink-line" strokeWidth="2.5" />
                {/* Left bump to centre dip */}
                <path d="M 172,92 Q 186,85 200,87" fill="none" className="ink-line" strokeWidth="2.5" />
                {/* Centre dip to right bump */}
                <path d="M 200,87 Q 214,85 228,92" fill="none" className="ink-line" strokeWidth="2.5" />
                {/* Right bump down right side */}
                <path d="M 228,92 Q 246,100 250,120" fill="none" className="ink-line" strokeWidth="2.5" />
                {/* Hat band */}
                <path d="M 150,158 Q 200,153 250,158" fill="none" className="ink-line" strokeWidth="4.5" />
              </g>
            </g>

            {/* ===== OPENING BURST ===== */}
            <g id="burst" ref={burstRef} opacity="0">
              <circle cx="200" cy="340" r="10"  fill="var(--glow)" />
              <circle cx="200" cy="340" r="60"  fill="var(--glow)" opacity="0.25" />
              <circle cx="200" cy="340" r="110" fill="var(--glow)" opacity="0.12" />
            </g>

            {/* ===== LASSO LAYER ===== */}
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
              <g id="targetHint">
                <circle
                  cx="200" cy="392" r="26"
                  fill="none"
                  stroke="var(--glow)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />
              </g>
              <ellipse
                id="loop"
                ref={loopRef}
                cx="200" cy="510"
                rx="46" ry="32"
                fill="none"
                stroke="var(--rope)"
                strokeWidth="6"
              />
            </g>
          </svg>

          {/* =========== HTML OVERLAYS =========== */}
          <AnimatePresence>
            {(state.phase === 'idle') && (
              <IdleScreen key="idle" showMiss={state.showMiss} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {state.phase === 'caught' && (
              <CaughtScreen
                key="caught"
                squeezeCount={state.squeezeCount}
                onSqueeze={handleSqueeze}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {state.phase === 'revealed' && (
              <RevealScreen key="revealed" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dev-only restart */}
      <RestartButton onReset={handleReset} />
    </>
  );
}
