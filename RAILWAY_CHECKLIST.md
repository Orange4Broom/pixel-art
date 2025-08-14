# ✅ Railway Deployment Checklist

## Před deploymentem

- [ ] Kód je commitnut a pushnut na GitHub
- [ ] Frontend build funguje lokálně (`yarn build`)
- [ ] Server funguje lokálně (`cd server && npm start`)
- [ ] WebSocket spojení funguje lokálně
- [ ] Máte Railway účet (railway.app)

## Railway Server Setup

- [ ] Vytvořen nový Railway projekt
- [ ] GitHub repository připojen
- [ ] Root Directory nastaven na `server`
- [ ] Environment variables nastaveny:
  - [ ] `NODE_ENV=production`
  - [ ] `HOST=0.0.0.0`
  - [ ] `FRONTEND_URL=https://your-frontend-url`
- [ ] Server úspěšně deploynut
- [ ] Server URL poznamenána: `https://your-server.railway.app`

## Frontend Setup

### Možnost A: Vercel

- [ ] Vercel projekt vytvořen z GitHub repo
- [ ] Framework nastaven na "Vite"
- [ ] Environment variables:
  - [ ] `VITE_SERVER_URL=wss://your-server.railway.app`
- [ ] Frontend deploynut
- [ ] Frontend URL poznamenána

### Možnost B: Railway

- [ ] Druhý servis přidán do Railway projektu
- [ ] Root Directory nastaven na `.` (root)
- [ ] Build Command: `yarn build`
- [ ] Start Command: `yarn preview`
- [ ] Environment variables nastaveny

## Propojení a testování

- [ ] Backend `FRONTEND_URL` aktualizován s frontend URL
- [ ] Server restartován v Railway
- [ ] WebSocket spojení testováno z frontend
- [ ] Multiplayer testován ve více tabech
- [ ] Kurzory ostatních uživatelů viditelné
- [ ] Synchronizace kreslení funguje

## URL Customizace

- [ ] V `MultiplayerContext.tsx` aktualizován fallback URL (řádek 67)
- [ ] Automatická detekce URL testována

## Finální test

- [ ] Aplikace otevřena na produkční URL
- [ ] Multiplayer panel zobrazuje "Připojeno" ✅
- [ ] Kreslení synchronizováno ve více oknech
- [ ] Kurzory ostatních uživatelů fungují
- [ ] Změna jména funguje

## Dokumentace

- [ ] URLs zaznamenány pro budoucí reference:
  - Frontend: `https://your-frontend.vercel.app`
  - Server: `https://your-server.railway.app`
- [ ] Environment variables zdokumentovány
- [ ] Team informován o nové URL

## Monitoring

- [ ] Railway dashboard přidán do záložek
- [ ] Logy zkontrolovány na chyby
- [ ] Performance metriky zkontrolovány

---

**🎉 Deployment dokončen!**

Váš multiplayer pixel art editor je nyní živě na internetu!

Sdílejte URL s přáteli: `https://your-frontend.vercel.app`
