# 🚀 Deployment na Railway

Tento návod vás provede nasazením multiplayer pixel art editoru na Railway.

## Předpoklady

1. **GitHub účet** - váš kód musí být na GitHubu
2. **Railway účet** - registrujte se na [railway.app](https://railway.app)

## 📦 Příprava kódu

### 1. Commit změn do Gitu

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Ověření struktury projektu

Ujistěte se, že máte:

```
pixel/
├── server/                    # Backend (WebSocket server)
│   ├── server.js             # Hlavní server soubor
│   ├── package.json          # Server dependencies
│   ├── railway.toml          # Railway konfigurace
│   └── Dockerfile            # Docker konfigurace
├── src/                      # Frontend
└── package.json             # Frontend dependencies
```

## 🚄 Railway Deployment

### Krok 1: Nasazení Backend Serveru

1. **Přihlaste se na Railway**

   - Jděte na [railway.app](https://railway.app)
   - Přihlaste se pomocí GitHub účtu

2. **Vytvořte nový projekt**

   - Klikněte na "New Project"
   - Vyberte "Deploy from GitHub repo"
   - Vyberte váš repository

3. **Konfigurace serveru**

   - Railway automaticky detekuje `server/` složku
   - Nastavte **Root Directory** na `server`
   - Zkontrolujte, že **Start Command** je `npm start`

4. **Environment Variables**

   ```
   NODE_ENV=production
   HOST=0.0.0.0
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **Deploy**
   - Klikněte "Deploy"
   - Čekejte na dokončení buildu (~2-3 minuty)
   - Poznamenejte si URL: `https://your-server-name.railway.app`

### Krok 2: Nasazení Frontend

Máte 2 možnosti pro frontend:

#### Možnost A: Vercel (doporučeno)

1. **Připojte GitHub repo na Vercel**

   - Jděte na [vercel.com](https://vercel.com)
   - Import váš GitHub repository
   - Framework: **Vite**
   - Root Directory: `.` (root)

2. **Environment Variables na Vercel**

   ```
   VITE_SERVER_URL=wss://your-server-name.railway.app
   ```

3. **Deploy a získejte URL**

#### Možnost B: Railway (stejný projekt)

1. **Přidejte druhý servis**

   - V Railway projektu klikněte "New Service"
   - Vyberte stejný GitHub repo
   - Root Directory: `.` (root)
   - Build Command: `yarn build`
   - Start Command: `yarn preview`

2. **Environment Variables**
   ```
   VITE_SERVER_URL=wss://your-server-name.railway.app
   ```

### Krok 3: Propojení Backend a Frontend

1. **Aktualizujte FRONTEND_URL v Railway serveru**

   ```
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

2. **Restart serveru**
   - V Railway dashboard klikněte na server servis
   - Klikněte "Restart"

## 🔧 Customizace URL

Upravte automatickou detekci URL v kódu:

```javascript
// src/contexts/MultiplayerContext.tsx - řádek 67
return `${protocol}//your-actual-server-name.railway.app`;
```

## 🧪 Testing

### 1. Otestujte server

```bash
# Test WebSocket připojení
wscat -c wss://your-server-name.railway.app
```

### 2. Otestujte frontend

- Otevřete frontend URL
- Zkontrolujte multiplayer panel (ikona uživatelů)
- Měli byste vidět "Připojeno" ✅

### 3. Otestujte multiplayer

- Otevřete aplikaci ve více tabiech
- Zkuste malovat - změny by se měly synchronizovat

## 🐛 Troubleshooting

### Server se nepřipojuje

1. **Zkontrolujte logy Railway**

   ```
   Railway Dashboard → Váš server → Deployments → View Logs
   ```

2. **Zkontrolujte environment variables**

   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

3. **Zkontrolujte CORS**
   - Server loguje pokusy o připojení
   - Hledejte "Connection attempt from origin"

### Frontend se nepřipojuje

1. **Dev Tools Console**

   - Otevřete F12 → Console
   - Hledejte WebSocket chyby

2. **Ověřte environment variables**

   ```bash
   # V Vercel dashboard
   VITE_SERVER_URL=wss://your-server-name.railway.app
   ```

3. **Zkontrolujte síť**
   - F12 → Network → WS tab
   - Měli byste vidět WebSocket spojení

### Build chyby

**Railway server:**

```bash
# Zkontrolujte package.json
npm install  # Lokálně
```

**Vercel frontend:**

```bash
# Zkontrolujte build lokálně
yarn build
yarn preview
```

## 📈 Monitoring a Logs

### Railway Dashboard

- **Metrics** - CPU, RAM, síťový provoz
- **Logs** - real-time logy aplikace
- **Deployments** - historie deploymentů

### Vercel Dashboard

- **Functions** - frontend performance
- **Analytics** - návštěvnost
- **Logs** - build a runtime logy

## 💰 Ceny

### Railway (Hobby Plan)

- **$5/měsíc** po trial periodu
- **500 hodin runtime**
- Ideální pro personal projekty

### Vercel (Hobby Plan)

- **Zdarma** pro personal projekty
- Bandwidth a function limits

## 🔐 Security Best Practices

1. **Environment Variables**

   - Nikdy necommitujte .env soubory
   - Používejte Railway/Vercel dashboard

2. **CORS**

   - Server kontroluje allowed origins
   - Aktualizujte FRONTEND_URL

3. **HTTPS**
   - Railway automaticky poskytuje HTTPS
   - Používejte WSS (ne WS) v produkci

## 🚀 Go Live!

1. ✅ Server na Railway
2. ✅ Frontend na Vercel/Railway
3. ✅ Environment variables nastaveny
4. ✅ CORS konfigurace
5. ✅ Testing dokončen

**Váš multiplayer pixel art editor je nyní živě! 🎨**

Sdílejte URL s přáteli a užijte si společné kreslení!

---

## 📞 Support

Pokud máte problémy:

1. **Zkontrolujte logy** v Railway/Vercel dashboardu
2. **Otestujte lokálně** - `yarn dev` + `npm start` v server/
3. **Ověřte síť** - F12 DevTools
4. **Restart services** v Railway/Vercel

Happy coding! 🚀
