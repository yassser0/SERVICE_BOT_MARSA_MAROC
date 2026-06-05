@echo off
echo ==========================================
echo    DEMARRAGE DU SAAS BOT BUILDER
echo ==========================================

echo [1/3] Lancement de MongoDB via Docker...
docker-compose up -d mongodb

echo [2/3] Lancement du Backend (FastAPI)...
start cmd /k "cd /d %~dp0backend && set MONGO_URI=mongodb://127.0.0.1:27018&& set JWT_SECRET=marsa-maroc-super-secret-key-2024-change-in-prod&& uvicorn main:app --reload --port 8001"

echo [3/3] Lancement du Frontend (React)...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo ==========================================
echo    TOUT EST LANCE !
echo    Dashboard : http://localhost:5173
echo    API Docs  : http://localhost:8001/docs
echo ==========================================
pause
