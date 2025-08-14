import { useState, useCallback, useEffect } from "react";
import {
  getGridPosition,
  type Position,
  type CanvasConfig,
} from "../utils/geometry";
import type { PixelChange } from "../../../../contexts/MultiplayerContext";
import type { ToolType } from "../../../../types/tools";

export type PixelGrid = string[][];

interface UseDrawingProps {
  canvasConfig: CanvasConfig;
  currentColor?: string;
  currentTool?: ToolType;
  onPixelChange?: (change: PixelChange) => void;
  onCanvasUpdate?: (callback: (canvas: PixelGrid) => void) => void;
  onRemotePixelChange?: (callback: (change: PixelChange) => void) => void;
}

export const useDrawing = ({
  canvasConfig,
  currentColor = "#000000",
  currentTool = "paintbrush",
  onPixelChange,
  onCanvasUpdate,
  onRemotePixelChange,
}: UseDrawingProps) => {
  const [pixels, setPixels] = useState<PixelGrid>(() =>
    Array(canvasConfig.gridHeight)
      .fill(null)
      .map(() => Array(canvasConfig.gridWidth).fill("#ffffff"))
  );

  const [isPainting, setIsPainting] = useState(false);

  // Registruje callback pro multiplayer updates
  useEffect(() => {
    if (onCanvasUpdate) {
      onCanvasUpdate((newCanvas: PixelGrid) => {
        setPixels(newCanvas);
      });
    }
  }, [onCanvasUpdate]);

  // Registruje callback pro remote pixel changes
  useEffect(() => {
    if (onRemotePixelChange) {
      onRemotePixelChange((change: PixelChange) => {
        setPixels((prev) => {
          if (
            change.x >= 0 &&
            change.x < canvasConfig.gridWidth &&
            change.y >= 0 &&
            change.y < canvasConfig.gridHeight
          ) {
            const newPixels = [...prev];
            newPixels[change.y][change.x] = change.color;
            return newPixels;
          }
          return prev;
        });
      });
    }
  }, [onRemotePixelChange, canvasConfig]);

  /**
   * Flood fill algoritmus
   */
  const floodFill = useCallback(
    (
      pixels: PixelGrid,
      startX: number,
      startY: number,
      targetColor: string,
      replacementColor: string
    ): PixelGrid => {
      if (targetColor === replacementColor) return pixels;

      const newPixels = pixels.map((row) => [...row]);
      const stack: { x: number; y: number }[] = [{ x: startX, y: startY }];

      while (stack.length > 0) {
        const { x, y } = stack.pop()!;

        if (
          x < 0 ||
          x >= canvasConfig.gridWidth ||
          y < 0 ||
          y >= canvasConfig.gridHeight ||
          newPixels[y][x] !== targetColor
        ) {
          continue;
        }

        newPixels[y][x] = replacementColor;

        // Přidej sousední pixely
        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }

      return newPixels;
    },
    [canvasConfig]
  );

  /**
   * Aplikuje nástroj na pozici
   */
  const applyTool = useCallback(
    (
      clientX: number,
      clientY: number,
      canvasRect: DOMRect,
      offset: Position,
      zoom: number
    ) => {
      const pos = getGridPosition(
        clientX,
        clientY,
        canvasRect,
        offset,
        zoom,
        canvasConfig.initialPixelSize,
        canvasConfig.gridWidth,
        canvasConfig.gridHeight
      );

      if (pos) {
        setPixels((prev) => {
          const toolColor = currentTool === "eraser" ? "#ffffff" : currentColor;
          let newPixels = prev;

          switch (currentTool) {
            case "paintbrush":
            case "eraser":
              // Optimalizace - neměň pokud je už stejná barva
              if (prev[pos.y][pos.x] === toolColor) {
                return prev;
              }
              newPixels = [...prev];
              newPixels[pos.y][pos.x] = toolColor;

              // Odešli změnu přes multiplayer
              if (onPixelChange) {
                onPixelChange({
                  x: pos.x,
                  y: pos.y,
                  color: toolColor,
                });
              }
              break;

            case "fill":
              const targetColor = prev[pos.y][pos.x];
              newPixels = floodFill(
                prev,
                pos.x,
                pos.y,
                targetColor,
                currentColor
              );

              // Pro flood fill pošleme celou oblast změn
              if (onPixelChange && newPixels !== prev) {
                // Najdeme všechny změněné pixely a pošleme je
                for (let y = 0; y < canvasConfig.gridHeight; y++) {
                  for (let x = 0; x < canvasConfig.gridWidth; x++) {
                    if (prev[y][x] !== newPixels[y][x]) {
                      onPixelChange({
                        x,
                        y,
                        color: newPixels[y][x],
                      });
                    }
                  }
                }
              }
              break;

            default:
              return prev;
          }

          return newPixels;
        });
      }
    },
    [canvasConfig, currentColor, currentTool, floodFill, onPixelChange]
  );

  /**
   * Spustí použití nástroje
   */
  const startPainting = useCallback(
    (
      clientX: number,
      clientY: number,
      canvasRect: DOMRect,
      offset: Position,
      zoom: number
    ) => {
      // Fill tool funguje pouze na click, ne na drag
      if (currentTool === "fill") {
        applyTool(clientX, clientY, canvasRect, offset, zoom);
        return;
      }

      setIsPainting(true);
      applyTool(clientX, clientY, canvasRect, offset, zoom);
    },
    [applyTool, currentTool]
  );

  /**
   * Pokračuje v používání nástroje (drag)
   */
  const continuePainting = useCallback(
    (
      clientX: number,
      clientY: number,
      canvasRect: DOMRect,
      offset: Position,
      zoom: number
    ) => {
      // Fill tool nepodporuje drag
      if (isPainting && currentTool !== "fill") {
        applyTool(clientX, clientY, canvasRect, offset, zoom);
      }
    },
    [isPainting, applyTool, currentTool]
  );

  /**
   * Ukončí malování
   */
  const stopPainting = useCallback(() => {
    setIsPainting(false);
  }, []);

  /**
   * Vymaže všechny pixely
   */
  const clearCanvas = useCallback(() => {
    setPixels(
      Array(canvasConfig.gridHeight)
        .fill(null)
        .map(() => Array(canvasConfig.gridWidth).fill("#ffffff"))
    );
  }, [canvasConfig]);

  return {
    pixels,
    isPainting,
    startPainting,
    continuePainting,
    stopPainting,
    clearCanvas,
    setPixels,
  };
};
