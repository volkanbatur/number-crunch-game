#!/bin/bash

echo "Starting Number Crunch..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Opening download page..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open https://nodejs.org/
    else
        xdg-open https://nodejs.org/
    fi
    echo "Please install Node.js and try again."
    read -p "Press Enter to exit..."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the game
echo "Starting the game server..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5173
else
    xdg-open http://localhost:5173
fi
npm run dev 