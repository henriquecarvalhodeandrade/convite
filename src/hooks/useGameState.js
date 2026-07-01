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
  loopRx: 65,
  loopRy: 45,
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
        loopRx: 65,
        loopRy: 45,
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
        loopRx: 145,   // wide enough to encircle the new wider envelope body
        loopRy: 30,    // thin horizontal oval wrapping around
      };

    case 'SQUEEZE': {
      const next = state.squeezeCount + 1;
      if (next === 1) return { ...state, squeezeCount: 1, shake: 'mid',   loopRx: 125, loopRy: 24 };
      if (next === 2) return { ...state, squeezeCount: 2, shake: 'small', loopRx: 105, loopRy: 18 };
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
