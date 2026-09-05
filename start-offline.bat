@echo off
echo Starting Midlex LLP Offline Servers...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.

start "Midlex Backend" cmd /k "cd backend && npm run start:dev"
start "Midlex Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started in separate command windows.
pause
