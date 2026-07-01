import { useReducer } from 'react';

/* -------------------------------------------------------
   Initial state
------------------------------------------------------- */
const initialState = {
  phase: 'idle',        // 'idle' | 'aiming' | 'caught' | 'opening' | 'revealed'
  squeezeCount: 0,
  shake: 'none',        // 'none' | 'big' | 'mid' | 'small'
  browsVisible: false,
  lassoVisible: false,
  loopRx: 46,
  loopRy: 32,
  isAiming: false,
  showMiss: false,
};

/* -------------------------------------------------------
   Reducer
------------------------------------------------------- */
function reducer(state, action) {
  switch (action.type) {

    case 'START_AIMING':
      return { ...state, phase: 'aiming', isAiming: true, lassoVisible: true, showMiss: false };

    case 'MISS':
      return {
        ...state,
        phase: 'idle',
        isAiming: false,
        lassoVisible: false,
        showMiss: true,
        squeezeCount: 0,
        shake: 'none',
        browsVisible: false,
        loopRx: 46,
        loopRy: 32,
      };

    case 'HIDE_MISS':
      return { ...state, showMiss: false };

    case 'CATCH':
      return {
        ...state,
        phase: 'caught',
        isAiming: false,
        lassoVisible: true,
        shake: 'big',
        browsVisible: true,
        loopRx: 118,   // wide enough to encircle the envelope body (half-width ~104)
        loopRy: 22,    // thin horizontal belt-like oval — wraps around the waist
      };

    case 'SQUEEZE': {
      const next = state.squeezeCount + 1;
      if (next === 1) return { ...state, squeezeCount: 1, shake: 'mid',   loopRx: 100, loopRy: 17 };
      if (next === 2) return { ...state, squeezeCount: 2, shake: 'small', loopRx:  84, loopRy: 13 };
      // next >= 3 → trigger opening
      return { ...state, squeezeCount: 3, phase: 'opening', shake: 'none', browsVisible: false };
    }

    case 'REVEALED':
      return { ...state, phase: 'revealed' };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

/* -------------------------------------------------------
   Hook
------------------------------------------------------- */
export function useGameState() {
  return useReducer(reducer, initialState);
}
