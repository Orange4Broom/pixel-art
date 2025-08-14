const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ 
  server,
  verifyClient: (info) => {
    // CORS check pro Railway
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL, // Railway environment variable
    ].filter(Boolean);

    const origin = info.origin;
    console.log(`Connection attempt from origin: ${origin}`);
    
    // V development módu povolíme všechno
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    // V produkci kontrolujeme origin
    return allowedOrigins.includes(origin);
  }
});

// Uložíme stav canvasu a připojené uživatele
let canvasState = Array(64).fill(null).map(() => Array(64).fill('#ffffff'));
let connectedUsers = new Map();
let userIdCounter = 0;

// Generátor náhodných barev pro uživatele
const userColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

function broadcastToAll(data, excludeWs = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastUserList() {
  const users = Array.from(connectedUsers.values());
  broadcastToAll({
    type: 'userList',
    users: users
  });
}

wss.on('connection', (ws) => {
  // Přiřadíme novému uživateli ID a barvu
  const userId = `user_${++userIdCounter}`;
  const userColor = userColors[userIdCounter % userColors.length];
  
  const user = {
    id: userId,
    name: `Uživatel ${userIdCounter}`,
    color: userColor,
    cursor: null
  };
  
  connectedUsers.set(ws, user);
  
  console.log(`Nový uživatel připojen: ${user.name} (${userId})`);
  
  // Pošleme novému uživateli aktuální stav canvasu
  ws.send(JSON.stringify({
    type: 'canvasState',
    canvas: canvasState,
    userId: userId,
    userColor: userColor
  }));
  
  // Pošleme seznam uživatelů všem
  broadcastUserList();
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'pixelChange':
          // Uložíme změnu pixelu
          const { x, y, color } = data;
          if (x >= 0 && x < 64 && y >= 0 && y < 64) {
            canvasState[y][x] = color;
            
            // Přepošleme změnu všem ostatním uživatelům
            broadcastToAll({
              type: 'pixelChange',
              x, y, color,
              userId: connectedUsers.get(ws).id
            }, ws);
          }
          break;
          
        case 'cursorMove':
          // Aktualizujeme pozici kurzoru uživatele
          const user = connectedUsers.get(ws);
          if (user) {
            user.cursor = { x: data.x, y: data.y };
            
            // Pošleme pozici kurzoru všem ostatním
            broadcastToAll({
              type: 'cursorMove',
              userId: user.id,
              cursor: user.cursor
            }, ws);
          }
          break;
          
        case 'userNameChange':
          // Změna jména uživatele
          const userData = connectedUsers.get(ws);
          if (userData) {
            userData.name = data.name;
            broadcastUserList();
          }
          break;
      }
    } catch (error) {
      console.error('Chyba při zpracování zprávy:', error);
    }
  });
  
  ws.on('close', () => {
    const user = connectedUsers.get(ws);
    if (user) {
      console.log(`Uživatel odpojen: ${user.name}`);
      connectedUsers.delete(ws);
      
      // Oznámíme ostatním, že uživatel se odpojil
      broadcastToAll({
        type: 'userDisconnected',
        userId: user.id
      });
      
      broadcastUserList();
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket chyba:', error);
  });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 WebSocket server běží na ${HOST}:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
  console.log(`🎨 Canvas size: 64x64 pixels`);
});
