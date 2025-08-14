#!/bin/bash

# Deployment helper scripts pro Railway

echo "🚀 Railway Deployment Helper"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funkce pro kontrolu požadavků
check_requirements() {
    echo -e "${YELLOW}Kontroluji požadavky...${NC}"
    
    # Git
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git není nainstalován${NC}"
        exit 1
    fi
    
    # Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js není nainstalován${NC}"
        exit 1
    fi
    
    # Yarn/npm
    if ! command -v yarn &> /dev/null && ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ Yarn nebo npm není nainstalován${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Všechny požadavky splněny${NC}"
}

# Funkce pro build a test
build_and_test() {
    echo -e "${YELLOW}Building a testování...${NC}"
    
    # Frontend build
    echo "📦 Building frontend..."
    if command -v yarn &> /dev/null; then
        yarn install && yarn build
    else
        npm install && npm run build
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    # Server test
    echo "🔧 Testing server..."
    cd server
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Server dependencies install failed${NC}"
        exit 1
    fi
    
    cd ..
    echo -e "${GREEN}✅ Build a test úspěšný${NC}"
}

# Funkce pro commit a push
deploy_to_git() {
    echo -e "${YELLOW}Deploying do GitHubu...${NC}"
    
    # Check if git is initialized
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Git repository není inicializován${NC}"
        echo "Spusťte: git init && git remote add origin YOUR_REPO_URL"
        exit 1
    fi
    
    # Add, commit, push
    git add .
    
    echo "Zadejte commit message (nebo stiskněte Enter pro default):"
    read commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Deploy to Railway - $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$commit_message"
    git push origin main
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Git push failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Kód úspěšně pushnut na GitHub${NC}"
}

# Funkce pro výpis environment variables
show_env_template() {
    echo -e "${YELLOW}Environment Variables Template${NC}"
    echo "=================================="
    echo ""
    echo "🔧 Railway Server Environment:"
    echo "NODE_ENV=production"
    echo "HOST=0.0.0.0"
    echo "FRONTEND_URL=https://your-frontend-domain.vercel.app"
    echo ""
    echo "🎨 Frontend Environment (Vercel/Railway):"
    echo "VITE_SERVER_URL=wss://your-server-name.railway.app"
    echo ""
    echo "Nahraďte YOUR-* skutečnými hodnotami!"
}

# Main menu
case "${1:-menu}" in
    "check")
        check_requirements
        ;;
    "build")
        check_requirements
        build_and_test
        ;;
    "deploy")
        check_requirements
        build_and_test
        deploy_to_git
        echo -e "${GREEN}🚀 Ready for Railway deployment!${NC}"
        echo "Nyní jděte na railway.app a vytvořte nový projekt z vašeho GitHub repo."
        ;;
    "env")
        show_env_template
        ;;
    "menu"|*)
        echo "Použití: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  check   - Zkontroluje požadavky"
        echo "  build   - Build a test aplikace"
        echo "  deploy  - Full deployment na Git"
        echo "  env     - Zobrazí template pro environment variables"
        echo ""
        echo "Nebo spusťte bez parametru pro toto menu."
        ;;
esac
