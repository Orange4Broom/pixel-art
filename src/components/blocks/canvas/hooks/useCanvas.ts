import { useRef, useEffect, useCallback } from "react";
import { type PixelGrid } from "./useDrawing";
import { type Position, type CanvasConfig } from "../utils/geometry";

interface UseCanvasProps {
  canvasConfig: CanvasConfig;
  pixels: PixelGrid;
  zoom: number;
  offset: Position;
}

export const useCanvas = ({
  canvasConfig,
  pixels,
  zoom,
  offset,
}: UseCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Vykreslí grid na canvas
   */
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Vyčisti canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nastav transformaci pro zoom a offset
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Vykresli pixely
    for (let y = 0; y < canvasConfig.gridHeight; y++) {
      for (let x = 0; x < canvasConfig.gridWidth; x++) {
        ctx.fillStyle = pixels[y][x];
        ctx.fillRect(
          x * canvasConfig.initialPixelSize,
          y * canvasConfig.initialPixelSize,
          canvasConfig.initialPixelSize,
          canvasConfig.initialPixelSize
        );
      }
    }

    // Vykresli grid linky
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5 / zoom;

    // Vertikální linky
    for (let x = 0; x <= canvasConfig.gridWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * canvasConfig.initialPixelSize, 0);
      ctx.lineTo(
        x * canvasConfig.initialPixelSize,
        canvasConfig.gridHeight * canvasConfig.initialPixelSize
      );
      ctx.stroke();
    }

    // Horizontální linky
    for (let y = 0; y <= canvasConfig.gridHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * canvasConfig.initialPixelSize);
      ctx.lineTo(
        canvasConfig.gridWidth * canvasConfig.initialPixelSize,
        y * canvasConfig.initialPixelSize
      );
      ctx.stroke();
    }

    ctx.restore();
  }, [pixels, zoom, offset, canvasConfig]);

  /**
   * Přizpůsobí velikost canvasu pro HiDPI displeje
   */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    drawGrid();
  }, [drawGrid]);

  /**
   * Získá DOMRect canvasu
   */
  const getCanvasRect = useCallback((): DOMRect | null => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getBoundingClientRect() : null;
  }, []);

  /**
   * Získá referenci na canvas element
   */
  const getCanvas = useCallback((): HTMLCanvasElement | null => {
    return canvasRef.current;
  }, []);

  // Effect pro překreslení gridu při změnách
  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  // Effect pro resize handling
  useEffect(() => {
    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);
    resizeCanvas();

    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  return {
    canvasRef,
    drawGrid,
    resizeCanvas,
    getCanvasRect,
    getCanvas,
  };
};
