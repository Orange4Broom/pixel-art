# 🎨 Pixel Art Editor - Multiplayer

A real-time collaborative pixel art editor built with React and WebSockets. Create pixel art together with friends in real-time, see each other's cursors, and watch your masterpiece come to life as you draw simultaneously.

![Pixel Art Editor Demo](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)

## ✨ Features

### 🎮 Drawing Tools

- **Paintbrush** - Draw individual pixels with your selected color
- **Eraser** - Remove pixels and make transparent areas
- **Fill Tool** - Flood fill areas with color (bucket fill)

### 🎨 Color System

- **Color Palette** - 10 predefined colors including black, white, red, green, blue, orange, purple, gray, cyan, and yellow
- **Color Picker** - Visual color selection with hover interactions
- **Active Color Display** - See your currently selected color at a glance

### 👥 Multiplayer Features

- **Real-time Collaboration** - Multiple users can draw on the same canvas simultaneously
- **Live Cursors** - See other users' mouse cursors in real-time with unique colors
- **User Management** - View all connected users and change your display name
- **Connection Status** - Visual indicator showing connection state
- **Instant Synchronization** - All drawing actions sync immediately across all connected clients

### 🖼️ Canvas Features

- **64x64 Pixel Grid** - High-resolution canvas for detailed pixel art
- **Zoom & Pan** - Mouse wheel zoom and drag to navigate large artworks
- **Responsive Design** - Works on different screen sizes

## 🛠️ Technologies Used

### Frontend

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full type coverage
- **Vite** - Fast build tool and development server
- **SCSS** - Enhanced CSS with variables and mixins
- **FontAwesome** - Professional icon library for UI elements

### Backend

- **Node.js** - JavaScript runtime for the server
- **WebSocket (ws)** - Real-time bidirectional communication
- **Express-style WebSocket Server** - Custom WebSocket server for multiplayer functionality

### Development Tools

- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Yarn** - Package management
- **Railway** - Cloud deployment platform

### Architecture

- **Context API** - React state management for colors, tools, and multiplayer
- **Custom Hooks** - Reusable logic for canvas, drawing, and tool management
- **Component-based Architecture** - Modular, reusable UI components
- **WebSocket Protocol** - Custom messaging protocol for real-time features

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pixel
   ```

2. **Install frontend dependencies**

   ```bash
   yarn install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

### Running the Application

1. **Start the WebSocket server**

   ```bash
   cd server
   npm start
   ```

   Server runs on `ws://localhost:8080`

2. **Start the frontend development server**

   ```bash
   # In the root directory
   yarn dev
   ```

   Application runs on `http://localhost:5173`

3. **Test multiplayer functionality**
   - Open the application in multiple browser tabs
   - Click the users icon in the top-right corner
   - Start drawing and see real-time synchronization

## 🎯 How It Works

### Drawing System

The application uses HTML5 Canvas for rendering pixel art. Each pixel is drawn as a small square on the canvas, and the drawing system tracks mouse events to determine which pixels to modify.

### Multiplayer Architecture

```
┌─────────────────┐    WebSocket     ┌─────────────────┐
│   React App 1   │◄─────────────────►│   Node.js       │
└─────────────────┘                  │   WebSocket     │
                                     │   Server        │
┌─────────────────┐    WebSocket     │   (port 8080)   │
│   React App 2   │◄─────────────────►│                 │
└─────────────────┘                  └─────────────────┘
```

### WebSocket Protocol

The application uses a custom WebSocket protocol for real-time communication:

- **Pixel Changes** - Broadcast drawing actions to all connected users
- **Cursor Movement** - Share mouse position for live cursor display
- **User Management** - Handle user connections, disconnections, and name changes
- **Canvas State** - Synchronize the complete canvas state for new users

### State Management

- **ColorContext** - Manages selected color and available color palette
- **ToolContext** - Handles tool selection (paintbrush, eraser, fill)
- **MultiplayerContext** - Manages WebSocket connection and real-time features

## 📁 Project Structure

```
pixel/
├── src/
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── canvas/          # Main drawing canvas and related hooks
│   │   │   ├── tools/           # Drawing tools interface
│   │   │   ├── pallete/         # Color selection interface
│   │   │   └── multiplayer/     # Multiplayer user management
│   │   └── elements/
│   │       └── icon/            # Reusable icon component
│   ├── contexts/                # React context providers
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript type definitions
├── server/
│   ├── server.js               # WebSocket server implementation
│   ├── package.json            # Server dependencies
│   └── railway.toml            # Railway deployment configuration
└── package.json               # Frontend dependencies
```

## 🌐 Deployment

The application is configured for deployment on Railway. See `RAILWAY_DEPLOYMENT.md` for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
