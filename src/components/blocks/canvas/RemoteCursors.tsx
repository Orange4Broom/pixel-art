import { useMultiplayer } from '../../../contexts/MultiplayerContext';
import './remote-cursors.scss';

interface RemoteCursorsProps {
  gridWidth?: number;
  gridHeight?: number;
  pixelSize?: number;
  zoom?: number;
  offset?: { x: number; y: number };
}

export const RemoteCursors = ({
  gridWidth = 64,
  gridHeight = 64,
  pixelSize = 8,
  zoom = 1,
  offset = { x: 0, y: 0 }
}: RemoteCursorsProps) => {
  const { remoteCursors } = useMultiplayer();

  return (
    <div className="remote-cursors">
      {Array.from(remoteCursors.entries()).map(([userId, cursor]) => {
        // Vypočítáme pozici kurzoru na obrazovce
        const x = (cursor.x * pixelSize * zoom) + offset.x;
        const y = (cursor.y * pixelSize * zoom) + offset.y;

        // Ověříme, že kurzor je v zobrazitelné oblasti
        if (
          cursor.x < 0 || cursor.x >= gridWidth ||
          cursor.y < 0 || cursor.y >= gridHeight
        ) {
          return null;
        }

        return (
          <div
            key={userId}
            className="remote-cursor"
            style={{
              left: x,
              top: y,
              borderColor: cursor.color,
              width: pixelSize * zoom,
              height: pixelSize * zoom,
            }}
          >
            <div
              className="cursor-indicator"
              style={{ backgroundColor: cursor.color }}
            />
          </div>
        );
      })}
    </div>
  );
};
