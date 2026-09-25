@echo off
echo Starting Midlex LLP Offline Servers...
echo Backend API: http://localhost:3001
echo Public Website & Client Portal: http://localhost:3000
echo Admin Portal: http://localhost:3002
echo Lawyer Portal: http://localhost:3003
echo CBT Portal: http://localhost:3004
echo MIP Portal (Internship): http://localhost:3005
echo.

start "Midlex Backend" cmd /k "cd backend && npm run start:dev"
start "Midlex Frontend (Public/Client)" cmd /k "cd frontend && npm run dev"
start "Midlex Admin Portal" cmd /k "cd admin && npm run dev"
start "Midlex Lawyer Portal" cmd /k "cd lawyers && npm run dev"
start "Midlex CBT Portal" cmd /k "cd cbt && npm run dev"
start "Midlex MIP Portal" cmd /k "cd mip && npm run dev"

echo All servers started in separate command windows.
pause
