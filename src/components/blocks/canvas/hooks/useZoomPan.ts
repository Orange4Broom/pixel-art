import { useState, useCallback } from "react";
import {
  calculateMinZoom,
  constrainOffset,
  calculateZoomOffset,
  type Position,
  type CanvasConfig,
  type ViewportBounds,
} from "../utils/geometry";

interface UseZoomPanProps {
  canvasConfig: CanvasConfig;
  minZoomMultiplier?: number;
  maxZoom?: number;
}

export const useZoomPan = ({
  canvasConfig,
  minZoomMultiplier = 1,
  maxZoom = 10,
}: UseZoomPanProps) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<Position>({ x: 0, y: 0 });

  /**
   * Získá aktuální viewport rozměry
   */
  const getViewportBounds = useCallback(
    (canvas: HTMLCanvasElement): ViewportBounds => {
      const rect = canvas.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    },
    []
  );

  /**
   * Vypočítá minimální zoom pro pokrytí obrazovky
   */
  const getMinZoom = useCallback(
    (canvas: HTMLCanvasElement): number => {
      const viewport = getViewportBounds(canvas);
      return calculateMinZoom(canvasConfig, viewport) * minZoomMultiplier;
    },
    [canvasConfig, minZoomMultiplier, getViewportBounds]
  );

  /**
   * Omezí offset aby canvas zůstal v obrazovce
   */
  const getConstrainedOffset = useCallback(
    (
      newOffset: Position,
      currentZoom: number,
      canvas: HTMLCanvasElement
    ): Position => {
      const viewport = getViewportBounds(canvas);
      return constrainOffset(newOffset, currentZoom, canvasConfig, viewport);
    },
    [canvasConfig, getViewportBounds]
  );

  /**
   * Nastaví zoom s omezením
   */
  const setConstrainedZoom = useCallback(
    (newZoom: number, canvas: HTMLCanvasElement, mousePosition?: Position) => {
      const minZoom = getMinZoom(canvas);
      const constrainedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

      if (mousePosition) {
        // Zoom k pozici myši
        const newOffset = calculateZoomOffset(
          mousePosition,
          offset,
          zoom,
          constrainedZoom
        );
        const constrainedOffset = getConstrainedOffset(
          newOffset,
          constrainedZoom,
          canvas
        );
        setOffset(constrainedOffset);
      } else {
        // Zajistí, že offset zůstane validní
        const constrainedOffset = getConstrainedOffset(
          offset,
          constrainedZoom,
          canvas
        );
        setOffset(constrainedOffset);
      }

      setZoom(constrainedZoom);
    },
    [zoom, offset, getMinZoom, getConstrainedOffset, maxZoom]
  );

  /**
   * Zoom pomocí kolečka myši
   */
  const handleWheel = useCallback(
    (e: React.WheelEvent, canvas: HTMLCanvasElement) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = canvas.getBoundingClientRect();
      const mousePosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setConstrainedZoom(zoom * delta, canvas, mousePosition);
    },
    [zoom, setConstrainedZoom]
  );

  /**
   * Spustí drag operaci
   */
  const startDrag = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setLastMousePos({ x: clientX, y: clientY });
  }, []);

  /**
   * Pokračuje v drag operaci
   */
  const continueDrag = useCallback(
    (clientX: number, clientY: number, canvas: HTMLCanvasElement) => {
      if (!isDragging) return;

      const deltaX = clientX - lastMousePos.x;
      const deltaY = clientY - lastMousePos.y;
      const newOffset = { x: offset.x + deltaX, y: offset.y + deltaY };
      const constrainedOffset = getConstrainedOffset(newOffset, zoom, canvas);

      setOffset(constrainedOffset);
      setLastMousePos({ x: clientX, y: clientY });
    },
    [isDragging, lastMousePos, offset, zoom, getConstrainedOffset]
  );

  /**
   * Ukončí drag operaci
   */
  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  /**
   * Inicializuje zoom a pozici pro nový canvas
   */
  const initializeView = useCallback(
    (canvas: HTMLCanvasElement) => {
      const minZoom = getMinZoom(canvas);
      const constrainedOffset = getConstrainedOffset(
        { x: 0, y: 0 },
        minZoom,
        canvas
      );

      setZoom(minZoom);
      setOffset(constrainedOffset);
    },
    [getMinZoom, getConstrainedOffset]
  );

  /**
   * Aktualizuje view při změně velikosti
   */
  const handleResize = useCallback(
    (canvas: HTMLCanvasElement) => {
      const minZoom = getMinZoom(canvas);

      // Pokud je aktuální zoom menší než nový minimum, aktualizuj
      if (zoom < minZoom) {
        setZoom(minZoom);
      }

      // Vždy aktualizuj offset
      const constrainedOffset = getConstrainedOffset(offset, zoom, canvas);
      setOffset(constrainedOffset);
    },
    [zoom, offset, getMinZoom, getConstrainedOffset]
  );

  return {
    zoom,
    offset,
    isDragging,
    handleWheel,
    startDrag,
    continueDrag,
    stopDrag,
    initializeView,
    handleResize,
    setConstrainedZoom,
  };
};
