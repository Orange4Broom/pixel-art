import { usePixelCanvas } from './hooks/usePixelCanvas'
import { useColor } from '../../../contexts/ColorContext'
import { useTool } from '../../../hooks/useTool'
import { useMultiplayer } from '../../../contexts/MultiplayerContext'
import { RemoteCursors } from './RemoteCursors'
import './canvas.scss'

interface CanvasProps {
  gridWidth?: number
  gridHeight?: number
  initialPixelSize?: number
}

export const Canvas = ({
  gridWidth = 64,
  gridHeight = 64,
  initialPixelSize = 8,
}: CanvasProps) => {
  const { selectedColor } = useColor()
  const { selectedTool } = useTool()
  const { onPixelChange, onCanvasUpdate, onRemotePixelChange, onCursorMove } = useMultiplayer()

  const {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleContextMenu,
    zoom,
    offset
  } = usePixelCanvas({
    gridWidth,
    gridHeight,
    initialPixelSize,
    currentColor: selectedColor,
    currentTool: selectedTool,
    onPixelChange,
    onCanvasUpdate,
    onRemotePixelChange,
    onCursorMove
  })

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className={`canvas canvas-${selectedTool}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      />
      <RemoteCursors
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        pixelSize={initialPixelSize}
        zoom={zoom}
        offset={offset}
      />
    </div>
  )
}