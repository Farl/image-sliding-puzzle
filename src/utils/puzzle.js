export const EMPTY_TILE = 0;

export function createSolvedTiles(dimension) {
  const total = dimension * dimension;
  return [...Array(total - 1).keys()].map((value) => value + 1).concat(EMPTY_TILE);
}

export function isAdjacent(indexA, indexB, dimension) {
  const rowA = Math.floor(indexA / dimension);
  const colA = indexA % dimension;
  const rowB = Math.floor(indexB / dimension);
  const colB = indexB % dimension;
  return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

export function shuffleTiles(dimension, steps = 1000) {
  const tiles = createSolvedTiles(dimension);
  let emptyIndex = tiles.indexOf(EMPTY_TILE);

  for (let i = 0; i < steps; i += 1) {
    const candidates = [];
    if (emptyIndex >= dimension) candidates.push(emptyIndex - dimension);
    if (emptyIndex < tiles.length - dimension) candidates.push(emptyIndex + dimension);
    if (emptyIndex % dimension !== 0) candidates.push(emptyIndex - 1);
    if (emptyIndex % dimension !== dimension - 1) candidates.push(emptyIndex + 1);

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    [tiles[emptyIndex], tiles[chosen]] = [tiles[chosen], tiles[emptyIndex]];
    emptyIndex = chosen;
  }

  return tiles;
}

export function isSolved(tiles) {
  for (let index = 0; index < tiles.length - 1; index += 1) {
    if (tiles[index] !== index + 1) return false;
  }
  return tiles[tiles.length - 1] === EMPTY_TILE;
}

export function getBackgroundSize(imageAspectRatio, boardSize) {
  if (!Number.isFinite(imageAspectRatio) || imageAspectRatio <= 0) {
    return { width: boardSize, height: boardSize };
  }

  if (imageAspectRatio > 1) {
    return {
      width: boardSize * imageAspectRatio,
      height: boardSize
    };
  }

  return {
    width: boardSize,
    height: boardSize / imageAspectRatio
  };
}
