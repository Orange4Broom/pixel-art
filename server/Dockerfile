FROM node:18-alpine

WORKDIR /app

# Kopírujeme package.json a package-lock.json (pokud existuje)
COPY package*.json ./

# Instalujeme dependencies
RUN npm ci --only=production

# Kopírujeme zdrojový kód
COPY . .

# Exponujeme port
EXPOSE 8080

# Nastavíme environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Startujeme aplikaci
CMD ["npm", "start"]
