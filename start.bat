@echo off
echo Starting Novito...

start "Novito Backend" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 5 /nobreak >nul

start "Novito Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Novito is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
