@echo off
echo Starting Number Crunch...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Opening download page...
    start https://nodejs.org/
    echo Please install Node.js and try again.
    pause
    exit
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

:: Start the game
echo Starting the game server...
start http://localhost:5173
npm run dev

pause 