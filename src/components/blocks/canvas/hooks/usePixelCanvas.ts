import { useEffect, useCallback, useMemo } from "react";
import { useCanvas } from "./useCanvas";
import { useDrawing, type PixelGrid } from "./useDrawing";
import type { ToolType } from "../../../../types/tools";
import { useZoomPan } from "./useZoomPan";
import { type CanvasConfig, getGridPosition } from "../utils/geometry";
import type { PixelChange } from "../../../../contexts/MultiplayerContext";

interface UsePixelCanvasProps {
  gridWidth?: number;
  gridHeight?: number;
  initialPixelSize?: number;
  currentColor?: string;
  currentTool?: ToolType;
  onPixelChange?: (change: PixelChange) => void;
  onCanvasUpdate?: (callback: (canvas: PixelGrid) => void) => void;
  onRemotePixelChange?: (callback: (change: PixelChange) => void) => void;
  onCursorMove?: (x: number, y: number) => void;
}

export const usePixelCanvas = ({
  gridWidth = 64,
  gridHeight = 64,
  initialPixelSize = 8,
  currentColor = "#000000",
  currentTool = "paintbrush",
  onPixelChange,
  onCanvasUpdate,
  onRemotePixelChange,
  onCursorMove,
}: UsePixelCanvasProps = {}) => {
  const canvasConfig: CanvasConfig = useMemo(
    () => ({
      gridWidth,
      gridHeight,
      initialPixelSize,
    }),
    [gridWidth, gridHeight, initialPixelSize]
  );

  // Inicializace hooks
  const drawing = useDrawing({
    canvasConfig,
    currentColor,
    currentTool,
    onPixelChange,
    onCanvasUpdate,
    onRemotePixelChange,
  });
  const zoomPan = useZoomPan({ canvasConfig });
  const canvas = useCanvas({
    canvasConfig,
    pixels: drawing.pixels,
    zoom: zoomPan.zoom,
    offset: zoomPan.offset,
  });

  // Inicializace view při prvním načtení
  useEffect(() => {
    const canvasElement = canvas.getCanvas();
    if (canvasElement) {
      // Timeout aby se canvas stihl vyrenderovat
      setTimeout(() => {
        zoomPan.initializeView(canvasElement);
      }, 0);
    }
  }, [canvas, zoomPan]);

  // Resize handling
  useEffect(() => {
    const handleResize = () => {
      const canvasElement = canvas.getCanvas();
      if (canvasElement) {
        canvas.resizeCanvas();
        zoomPan.handleResize(canvasElement);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvas, zoomPan]);

  /**
   * Mouse down handler
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvasElement = canvas.getCanvas();
      const canvasRect = canvas.getCanvasRect();

      if (!canvasElement || !canvasRect) return;

      if (e.button === 0) {
        // Levé tlačítko - malování
        drawing.startPainting(
          e.clientX,
          e.clientY,
          canvasRect,
          zoomPan.offset,
          zoomPan.zoom
        );
      } else if (e.button === 1) {
        // Prostřední tlačítko - posunování
        zoomPan.startDrag(e.clientX, e.clientY);
      }
    },
    [canvas, drawing, zoomPan]
  );

  /**
   * Mouse move handler
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvasElement = canvas.getCanvas();
      const canvasRect = canvas.getCanvasRect();

      if (!canvasElement || !canvasRect) return;

      // Pošli pozici kurzoru pro multiplayer
      if (onCursorMove) {
        const pos = getGridPosition(
          e.clientX,
          e.clientY,
          canvasRect,
          zoomPan.offset,
          zoomPan.zoom,
          canvasConfig.initialPixelSize,
          canvasConfig.gridWidth,
          canvasConfig.gridHeight
        );
        if (pos) {
          onCursorMove(pos.x, pos.y);
        }
      }

      if (drawing.isPainting) {
        // Pokračuj v malování
        drawing.continuePainting(
          e.clientX,
          e.clientY,
          canvasRect,
          zoomPan.offset,
          zoomPan.zoom
        );
      } else if (zoomPan.isDragging) {
        // Pokračuj v posunování
        zoomPan.continueDrag(e.clientX, e.clientY, canvasElement);
      }
    },
    [canvas, drawing, zoomPan, onCursorMove, canvasConfig]
  );

  /**
   * Mouse up handler
   */
  const handleMouseUp = useCallback(() => {
    drawing.stopPainting();
    zoomPan.stopDrag();
  }, [drawing, zoomPan]);

  /**
   * Wheel handler
   */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const canvasElement = canvas.getCanvas();
      if (!canvasElement) return;

      zoomPan.handleWheel(e, canvasElement);
    },
    [canvas, zoomPan]
  );

  /**
   * Context menu handler (vypne right-click menu)
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    // Canvas ref pro JSX
    canvasRef: canvas.canvasRef,

    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,

    // State pro external usage
    pixels: drawing.pixels,
    zoom: zoomPan.zoom,
    offset: zoomPan.offset,
    isPainting: drawing.isPainting,
    isDragging: zoomPan.isDragging,

    // Actions
    clearCanvas: drawing.clearCanvas,
    setPixels: drawing.setPixels,

    // Canvas utilities
    getCanvas: canvas.getCanvas,
    getCanvasRect: canvas.getCanvasRect,
  };
};
