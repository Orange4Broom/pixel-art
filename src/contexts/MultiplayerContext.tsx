import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { PixelGrid } from '../components/blocks/canvas/hooks/useDrawing';

export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number } | null;
}

export interface PixelChange {
  x: number;
  y: number;
  color: string;
  userId?: string;
}

interface MultiplayerContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;

  // User management
  currentUserId: string | null;
  currentUserColor: string | null;
  connectedUsers: User[];

  // Canvas synchronization
  onPixelChange: (change: PixelChange) => void;
  onCanvasUpdate: (callback: (canvas: PixelGrid) => void) => void;
  onRemotePixelChange: (callback: (change: PixelChange) => void) => void;
  onCursorMove: (x: number, y: number) => void;

  // Actions
  connect: () => void;
  disconnect: () => void;
  changeUserName: (name: string) => void;

  // Remote cursors
  remoteCursors: Map<string, { x: number; y: number; color: string }>;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

interface MultiplayerProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

// Automatická detekce server URL podle prostředí
const getDefaultServerUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    // Pro localhost používej development server
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'ws://localhost:8080';
    }

    // Pro produkci - Railway automaticky poskytne VITE_SERVER_URL
    if (import.meta.env.VITE_SERVER_URL) {
      return import.meta.env.VITE_SERVER_URL;
    }

    // Fallback pro Railway - použijeme skutečnou URL
    return `${protocol}//pixel-art-production.up.railway.app`;
  }
  return 'ws://localhost:8080';
};

export const MultiplayerProvider = ({
  children,
  serverUrl = getDefaultServerUrl()
}: MultiplayerProviderProps) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserColor, setCurrentUserColor] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Map<string, { x: number; y: number; color: string }>>(new Map());

  // Callbacks for canvas updates
  const [canvasUpdateCallback, setCanvasUpdateCallback] = useState<((canvas: PixelGrid) => void) | null>(null);
  const [pixelChangeCallback, setPixelChangeCallback] = useState<((change: PixelChange) => void) | null>(null);

  const onCanvasUpdate = useCallback((callback: (canvas: PixelGrid) => void) => {
    setCanvasUpdateCallback(() => callback);
  }, []);

  const onRemotePixelChange = useCallback((callback: (change: PixelChange) => void) => {
    setPixelChangeCallback(() => callback);
  }, []);

  const connect = useCallback(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      return; // Už jsme připojeni
    }

    setIsConnecting(true);

    const websocket = new WebSocket(serverUrl);

    websocket.onopen = () => {
      console.log('Připojeno k WebSocket serveru');
      setIsConnected(true);
      setIsConnecting(false);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'canvasState':
            // Dostali jsme aktuální stav canvasu
            if (canvasUpdateCallback) {
              canvasUpdateCallback(data.canvas);
            }
            setCurrentUserId(data.userId);
            setCurrentUserColor(data.userColor);
            break;

          case 'pixelChange':
            // Jiný uživatel změnil pixel
            if (pixelChangeCallback && data.userId !== currentUserId) {
              pixelChangeCallback({
                x: data.x,
                y: data.y,
                color: data.color,
                userId: data.userId
              });
            }
            break;

          case 'userList':
            setConnectedUsers(data.users);
            break;

          case 'cursorMove':
            if (data.userId !== currentUserId) {
              const user = connectedUsers.find(u => u.id === data.userId);
              if (user && data.cursor) {
                setRemoteCursors(prev => new Map(prev).set(data.userId, {
                  x: data.cursor.x,
                  y: data.cursor.y,
                  color: user.color
                }));
              }
            }
            break;

          case 'userDisconnected':
            setRemoteCursors(prev => {
              const newMap = new Map(prev);
              newMap.delete(data.userId);
              return newMap;
            });
            break;
        }
      } catch (error) {
        console.error('Chyba při zpracování WebSocket zprávy:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket spojení ukončeno');
      setIsConnected(false);
      setIsConnecting(false);
      setWs(null);
      setCurrentUserId(null);
      setCurrentUserColor(null);
      setConnectedUsers([]);
      setRemoteCursors(new Map());
    };

    websocket.onerror = (error) => {
      console.error('WebSocket chyba:', error);
      setIsConnecting(false);
    };

  }, [serverUrl, canvasUpdateCallback, currentUserId, connectedUsers]);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
    }
  }, [ws]);

  const onPixelChange = useCallback((change: PixelChange) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'pixelChange',
        x: change.x,
        y: change.y,
        color: change.color
      }));
    }
  }, [ws]);

  const onCursorMove = useCallback((x: number, y: number) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'cursorMove',
        x, y
      }));
    }
  }, [ws]);

  const changeUserName = useCallback((name: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'userNameChange',
        name
      }));
    }
  }, [ws]);

  // Automatické připojení při mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const value: MultiplayerContextType = {
    isConnected,
    isConnecting,
    currentUserId,
    currentUserColor,
    connectedUsers,
    onPixelChange,
    onCanvasUpdate,
    onRemotePixelChange,
    onCursorMove,
    connect,
    disconnect,
    changeUserName,
    remoteCursors
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (context === undefined) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};
