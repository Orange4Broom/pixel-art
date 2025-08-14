# Pixel Art Editor - Multiplayer

Vaše pixel art aplikace byla rozšířena o multiplayer funkcionalitu! Nyní můžete malovat společně s ostatními uživateli v reálném čase.

## Nové funkce

### 🎨 Společné kreslení

- Více uživatelů může současně malovat na stejném plátně
- Změny se synchronizují v reálném čase
- Každý uživatel má svou unikátní barvu

### 👥 Správa uživatelů

- Zobrazení všech připojených uživatelů
- Možnost změny jména
- Automatické přiřazení barev uživatelům

### 🖱️ Live kurzory

- Vidíte kurzory ostatních uživatelů v reálném čase
- Kurzory jsou obarvené podle barvy uživatele
- Smooth animace pohybu

### 📡 Connection management

- Indikátor stavu připojení
- Možnost připojení/odpojení
- Automatická reconnection logika

## Spuštění

### 1. Instalace závislostí

```bash
# Hlavní aplikace
yarn install

# Server
cd server
npm install
```

### 2. Spuštění serveru

```bash
cd server
npm start
```

Server běží na portu 8080 (ws://localhost:8080)

### 3. Spuštění aplikace

```bash
# V root složce
yarn dev
```

Aplikace běží na http://localhost:5173

## Jak to funguje

### Architektura

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   React App 1   │◄─────────────────►│                 │
└─────────────────┘                  │   Node.js       │
                                     │   WebSocket     │
┌─────────────────┐    WebSocket     │   Server        │
│   React App 2   │◄─────────────────►│                 │
└─────────────────┘                  │   (server.js)   │
                                     │                 │
┌─────────────────┐    WebSocket     │                 │
│   React App N   │◄─────────────────►│                 │
└─────────────────┘                  └─────────────────┘
```

### Komponenty

- **MultiplayerProvider** - React context pro správu WebSocket spojení
- **MultiplayerPanel** - UI panel pro správu uživatelů a připojení
- **RemoteCursors** - Zobrazení kurzorů ostatních uživatelů
- **Canvas** - Rozšířený o multiplayer events

### Messaging protocol

```javascript
// Pixel změna
{
  type: 'pixelChange',
  x: number,
  y: number,
  color: string,
  userId: string
}

// Pohyb kurzoru
{
  type: 'cursorMove',
  x: number,
  y: number,
  userId: string
}

// Seznam uživatelů
{
  type: 'userList',
  users: User[]
}

// Změna jména
{
  type: 'userNameChange',
  name: string
}
```

## Použití

1. **Otevřete aplikaci** ve více oknech/tabulkách
2. **Klikněte na ikonu uživatelů** v pravém horním rohu
3. **Zkontrolujte připojení** - zelený indikátor = připojeno
4. **Začněte malovat** - změny se automaticky synchronizují
5. **Změňte si jméno** v multiplayer panelu

## Troubleshooting

### Server se nepřipojuje

- Zkontrolujte, že server běží na portu 8080
- Zkontrolujte firewall/antivirus
- Zkuste restartovat server

### Pomalá synchronizace

- Zkontrolujte síťové připojení
- Server optimalizován pro lokální síť
- Pro produkci doporučujeme dedikovaný server

### Změny se nezobrazují

- Zkontrolujte WebSocket připojení v dev tools
- Obnovte stránku (F5)
- Restartujte server

## Development

### Rozšíření funkcí

- **Rooms/místnosti** - různé canvasy pro různé skupiny
- **Persistent storage** - uložení obrázků do databáze
- **Authentication** - přihlašování uživatelů
- **Voice chat** - hlasová komunikace
- **Undo/Redo synchronization** - sdílené akce zpět/vpřed

### Customizace

- **Server URL** - změňte v `MultiplayerProvider` props
- **Canvas size** - upravte grid size v `Canvas` komponentě
- **User colors** - upravte paletu v `server.js`

Užijte si společné kreslení! 🎨👥

## 🚀 Deployment na Railway

Pro nasazení na Railway hosting si přečtěte [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md).

### Rychlý přehled:

1. **Push kód na GitHub**
2. **Railway**: Deploy `server/` složku
3. **Vercel/Railway**: Deploy frontend
4. **Nastavit environment variables**:
   - Backend: `FRONTEND_URL=https://your-frontend.vercel.app`
   - Frontend: `VITE_SERVER_URL=wss://your-server.railway.app`

Více detailů v deployment guide! 📖
