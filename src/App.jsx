import ControlPanel from './components/ControlPanel';
import PuzzleBoard from './components/PuzzleBoard';
import TimerDisplay from './components/TimerDisplay';
import { usePuzzleGame } from './hooks/usePuzzleGame';

function App() {
  const { state, actions } = usePuzzleGame();

  return (
    <main className="app-shell">
      <div className="halo halo-one" />
      <div className="halo halo-two" />

      <section className="card">
        <TimerDisplay elapsedSeconds={state.elapsedSeconds} />

        <PuzzleBoard
          dimension={state.dimension}
          tiles={state.tiles}
          image={state.image}
          imageAspectRatio={state.imageAspectRatio}
          showNumbers={state.showNumbers}
          onTileClick={actions.moveTile}
        />

        <ControlPanel
          dimension={state.dimension}
          imagePrompt={state.imagePrompt}
          showNumbers={state.showNumbers}
          loading={state.loading}
          onDimensionChange={actions.setDimension}
          onPromptChange={actions.setImagePrompt}
          onGenerateImage={actions.generateImage}
          onFileSelect={actions.onFileSelect}
          onToggleNumbers={actions.setShowNumbers}
          onStartNewGame={actions.startNewGame}
        />
      </section>

      {state.loading && (
        <div className="loading-overlay" role="status" aria-live="polite" aria-label="Loading">
          <span className="loader" />
        </div>
      )}
    </main>
  );
}

export default App;
