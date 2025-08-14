export interface Position {
  x: number;
  y: number;
}

export interface GridPosition extends Position {}

export interface CanvasConfig {
  gridWidth: number;
  gridHeight: number;
  initialPixelSize: number;
}

export interface ViewportBounds {
  width: number;
  height: number;
}

/**
 * Převede souřadnice myši na pozici v gridu
 */
export const getGridPosition = (
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  offset: Position,
  zoom: number,
  initialPixelSize: number,
  gridWidth: number,
  gridHeight: number
): GridPosition | null => {
  const x = (clientX - canvasRect.left - offset.x) / zoom;
  const y = (clientY - canvasRect.top - offset.y) / zoom;

  const gridX = Math.floor(x / initialPixelSize);
  const gridY = Math.floor(y / initialPixelSize);

  if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
    return { x: gridX, y: gridY };
  }
  return null;
};

/**
 * Vypočítá minimální zoom pro pokrytí celé obrazovky
 */
export const calculateMinZoom = (
  canvasConfig: CanvasConfig,
  viewport: ViewportBounds
): number => {
  const canvasWidth = canvasConfig.gridWidth * canvasConfig.initialPixelSize;
  const canvasHeight = canvasConfig.gridHeight * canvasConfig.initialPixelSize;

  const minZoomX = viewport.width / canvasWidth;
  const minZoomY = viewport.height / canvasHeight;

  return Math.max(minZoomX, minZoomY);
};

/**
 * Omezí offset aby canvas nezmizel z obrazovky
 */
export const constrainOffset = (
  newOffset: Position,
  zoom: number,
  canvasConfig: CanvasConfig,
  viewport: ViewportBounds
): Position => {
  const canvasWidth =
    canvasConfig.gridWidth * canvasConfig.initialPixelSize * zoom;
  const canvasHeight =
    canvasConfig.gridHeight * canvasConfig.initialPixelSize * zoom;

  let constrainedX = newOffset.x;
  let constrainedY = newOffset.y;

  if (canvasWidth <= viewport.width) {
    // Canvas je menší než obrazovka - centruj horizontálně
    constrainedX = (viewport.width - canvasWidth) / 2;
  } else {
    // Canvas je větší - omeź posunování
    const maxOffsetX = 0;
    const minOffsetX = viewport.width - canvasWidth;
    constrainedX = Math.max(minOffsetX, Math.min(maxOffsetX, newOffset.x));
  }

  if (canvasHeight <= viewport.height) {
    // Canvas je menší než obrazovka - centruj vertikálně
    constrainedY = (viewport.height - canvasHeight) / 2;
  } else {
    // Canvas je větší - omeź posunování
    const maxOffsetY = 0;
    const minOffsetY = viewport.height - canvasHeight;
    constrainedY = Math.max(minOffsetY, Math.min(maxOffsetY, newOffset.y));
  }

  return { x: constrainedX, y: constrainedY };
};

/**
 * Vypočítá nový offset pro zoom k pozici myši
 */
export const calculateZoomOffset = (
  mousePosition: Position,
  currentOffset: Position,
  currentZoom: number,
  newZoom: number
): Position => {
  return {
    x:
      mousePosition.x -
      (mousePosition.x - currentOffset.x) * (newZoom / currentZoom),
    y:
      mousePosition.y -
      (mousePosition.y - currentOffset.y) * (newZoom / currentZoom),
  };
};
