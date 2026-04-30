function ControlPanel({
  dimension,
  imagePrompt,
  showNumbers,
  loading,
  onDimensionChange,
  onPromptChange,
  onGenerateImage,
  onFileSelect,
  onToggleNumbers,
  onStartNewGame
}) {
  return (
    <section className="panel" aria-label="Game Controls">
      <label className="field-row" htmlFor="dimension">
        <span>Puzzle Size</span>
        <input
          id="dimension"
          type="number"
          min="3"
          max="8"
          value={dimension}
          onChange={(event) => onDimensionChange(Number(event.target.value))}
        />
      </label>

      <div className="field-row prompt-row">
        <label htmlFor="image-prompt">Image Prompt</label>
        <div className="prompt-actions">
          <input
            id="image-prompt"
            type="text"
            value={imagePrompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe an image"
          />
          <button type="button" className="ghost-btn" onClick={onGenerateImage} disabled={loading}>
            Generate
          </button>
        </div>
      </div>

      <div className="field-row">
        <label htmlFor="file-input" className="ghost-btn upload-btn">
          Upload Image
        </label>
        <input id="file-input" type="file" accept="image/*" onChange={onFileSelect} />
      </div>

      <label className="field-row toggle-row" htmlFor="show-numbers">
        <span>Show Numbers</span>
        <input
          id="show-numbers"
          type="checkbox"
          checked={showNumbers}
          onChange={(event) => onToggleNumbers(event.target.checked)}
        />
      </label>

      <button type="button" className="primary-btn" onClick={onStartNewGame}>
        Start New Game
      </button>
    </section>
  );
}

export default ControlPanel;
