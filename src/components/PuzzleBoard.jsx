import { EMPTY_TILE, getBackgroundSize } from '../utils/puzzle';

const MOBILE_BREAKPOINT = 640;

const BOARD_PADDING = 8;
const TILE_GAP = 2;

function getTileSize(dimension) {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  // Available width: viewport minus app shell padding, card padding, board padding, and column sharing on desktop
  const columnFraction = isMobile ? 0.78 : 0.40;
  const widthBound = window.innerWidth * columnFraction - BOARD_PADDING * 2;
  // Available height: viewport minus timer (~70px), controls (~220px on mobile / ~180px desktop), gaps, paddings
  const heightReserved = isMobile ? 380 : 320;
  const heightBound = Math.max(180, window.innerHeight - heightReserved - BOARD_PADDING * 2);
  // Subtract gaps from max available space before dividing by dimension
  const gaps = TILE_GAP * (dimension - 1);
  const maxTile = Math.min(500, widthBound, heightBound);
  return Math.floor((maxTile - gaps) / dimension);
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
          gridTemplateColumns: `repeat(${dimension}, ${tileSize}px)`
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
