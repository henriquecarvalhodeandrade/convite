import { useReducer } from 'react';
import { LOOP_IDLE, LOOP_CATCH, LOOP_SQ1, LOOP_SQ2 } from '../constants';

/* -------------------------------------------------------
   Initial state
------------------------------------------------------- */
const initialState = {
  phase: 'idle',        // 'idle' | 'aiming' | 'caught' | 'opening' | 'revealed'
  squeezeCount: 0,
  shake: 'none',        // 'none' | 'big' | 'mid' | 'small'
  browsVisible: false,
  lassoVisible: false,
  loopRx: LOOP_IDLE.rx,
  loopRy: LOOP_IDLE.ry,
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
        loopRx: LOOP_IDLE.rx,
        loopRy: LOOP_IDLE.ry,
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
        loopRx: LOOP_CATCH.rx,  // wide enough to encircle the new wider envelope body
        loopRy: LOOP_CATCH.ry,  // thin horizontal oval wrapping around
      };

    case 'SQUEEZE': {
      const next = state.squeezeCount + 1;
      if (next === 1) return { ...state, squeezeCount: 1, shake: 'mid',   loopRx: LOOP_SQ1.rx, loopRy: LOOP_SQ1.ry };
      if (next === 2) return { ...state, squeezeCount: 2, shake: 'small', loopRx: LOOP_SQ2.rx, loopRy: LOOP_SQ2.ry };
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
