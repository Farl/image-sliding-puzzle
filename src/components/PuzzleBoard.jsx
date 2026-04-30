import { EMPTY_TILE, getBackgroundSize } from '../utils/puzzle';

const MOBILE_BREAKPOINT = 640;

function getTileSize(dimension) {
  const widthBound = window.innerWidth <= MOBILE_BREAKPOINT ? window.innerWidth * 0.8 : window.innerWidth * 0.42;
  const heightReserved = window.innerWidth <= MOBILE_BREAKPOINT ? 350 : 300;
  const heightBound = Math.max(220, window.innerHeight - heightReserved);
  const maxSize = Math.min(520, widthBound, heightBound);
  return Math.floor(maxSize / dimension);
}

function PuzzleBoard({
  dimension,
  tiles,
  image,
  imageAspectRatio,
  showNumbers,
  onTileClick
}) {
  const tileSize = getTileSize(dimension);
  const boardSize = tileSize * dimension;
  const backgroundSize = getBackgroundSize(imageAspectRatio, boardSize);
  const offsetX = (backgroundSize.width - boardSize) / 2;
  const offsetY = (backgroundSize.height - boardSize) / 2;

  return (
    <section className="board-wrap" aria-label="Puzzle Board">
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${dimension}, ${tileSize}px)`,
          width: `${boardSize}px`,
          height: `${boardSize}px`
        }}
      >
        {tiles.map((tile, index) => {
          const isEmpty = tile === EMPTY_TILE;
          const row = Math.floor((tile - 1) / dimension);
          const col = (tile - 1) % dimension;

          const imageStyle =
            !isEmpty && image
              ? {
                  backgroundImage: `url('${image}')`,
                  backgroundSize: `${backgroundSize.width}px ${backgroundSize.height}px`,
                  backgroundPosition: `${-col * tileSize - offsetX}px ${-row * tileSize - offsetY}px`
                }
              : undefined;

          return (
            <button
              key={index}
              type="button"
              className={`tile${isEmpty ? ' tile-empty' : ''}`}
              style={{ width: `${tileSize}px`, height: `${tileSize}px` }}
              onClick={() => onTileClick(index)}
              disabled={isEmpty}
              aria-label={isEmpty ? 'Empty tile' : `Tile ${tile}`}
            >
              {!isEmpty && (
                <span className="tile-face">
                  <span className="tile-image" style={imageStyle} />
                </span>
              )}
              {isEmpty && <span className="tile-slot" />}
              {!isEmpty && showNumbers && <span className="tile-number">{tile}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PuzzleBoard;
