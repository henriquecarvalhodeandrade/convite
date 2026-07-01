import { useCallback } from 'react';

import { useGameState }  from './hooks/useGameState';
import Background    from './components/Background';
import Stage         from './components/Stage';

/* -------------------------------------------------------
   App — main orchestrator
------------------------------------------------------- */
export default function App() {
  const [state, dispatch] = useGameState();

  const handleSqueeze = useCallback(() => {
    dispatch({ type: 'SQUEEZE' });
  }, [dispatch]);

  return (
    <>
      <Background />
      <Stage state={state} dispatch={dispatch} handleSqueeze={handleSqueeze} />
    </>
  );
}
