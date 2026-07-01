import { useGameState }  from './hooks/useGameState';
import Background    from './components/Background';
import Stage         from './components/Stage';

/* -------------------------------------------------------
   App — main orchestrator
------------------------------------------------------- */
export default function App() {
  const [state, dispatch] = useGameState();

  return (
    <>
      <Background />
      <Stage state={state} dispatch={dispatch} />
    </>
  );
}
