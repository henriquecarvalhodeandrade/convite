/* -------------------------------------------------------
   Game constants — single source of truth for all
   magic numbers shared across hooks and components.
------------------------------------------------------- */

/** SVG viewBox coordinates of the lasso target (envelope center) */
export const LASSO_TARGET = { x: 200, y: 365 };

/** Off-screen anchor point simulating the player's hand */
export const LASSO_ANCHOR = { x: 40, y: 820 };

/** Pixel radius (in SVG units) considered a successful catch */
export const HIT_RADIUS = 88;

/** Default resting position of the lasso loop */
export const LOOP_INITIAL_POS = { x: 200, y: 540 };

/* ---- Loop ellipse rx/ry per game phase ---- */

/** Default SVG attr size / used in hard reset */
export const LOOP_REST  = { rx: 46,  ry: 32  };

/** Aiming phase — wide open loop */
export const LOOP_IDLE  = { rx: 65,  ry: 45  };

/** Just caught — wide oval wrapping around the envelope */
export const LOOP_CATCH = { rx: 145, ry: 30  };

/** After 1st squeeze */
export const LOOP_SQ1   = { rx: 125, ry: 24  };

/** After 2nd squeeze */
export const LOOP_SQ2   = { rx: 105, ry: 18  };
