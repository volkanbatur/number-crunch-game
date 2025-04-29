# Number Crunch

A two-player number guessing game built with React, TypeScript, and Chakra UI.

![Game Preview](./screenshots/game-preview.png)

## Quick Start 🚀

### Option 1: Play Online (Easiest)

⚠️ **Note:** The online version will be available after the first successful deployment at:
[https://volkanbatur.github.io/number-crunch](https://volkanbatur.github.io/number-crunch)

To deploy the game:
1. Go to your GitHub repository
2. Click on "Settings"
3. Go to "Pages" in the sidebar
4. Under "Build and deployment", select:
   - Source: "GitHub Actions"
   - Branch: "main"
5. Click "Save"

The game will be automatically deployed when you push changes to the main branch.

### Option 2: Download and Play (No coding required)

1. Click the green "Code" button above
2. Click "Download ZIP"
3. Extract the ZIP file
4. Double-click `start-game.bat` (Windows) or `start-game.sh` (Mac/Linux)

### Option 3: Developer Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (v20.0.0 or higher)
2. Open your terminal and run:
```bash
# Clone the repository
git clone https://github.com/volkanbatur/number-crunch.git

# Go to the game directory
cd number-crunch

# Install dependencies
npm install

# Start the game
npm run dev
```
3. Open your browser and go to: `http://localhost:5173`

## Game Preview

### Setup Screen
![Setup Screen](./screenshots/setup.png)
- Choose your player icons
- Set time limits
- Enter your secret numbers

### Gameplay
![Gameplay Screen](./screenshots/gameplay.png)
- Take turns guessing numbers
- Get instant feedback
- Track your progress

### Victory Screen
![Victory Screen](./screenshots/victory.png)
- Celebrate with confetti
- See game statistics
- Play again option

## Features

- 🎮 Two-player gameplay
- ⏱️ Configurable time limits (30-120 seconds)
- 🎯 Real-time feedback on guesses
- 🎨 Player icons and customization
- 🎉 Victory animations
- 🔊 Sound effects

## How to Play

1. Each player chooses their icon and enters a 6-digit secret number
2. Players take turns guessing each other's number
3. After each guess, players receive feedback:
   - '+' indicates a correct digit in the correct position
   - '-' indicates a correct digit in the wrong position
4. The first player to correctly guess their opponent's number wins!

Example:
- Secret number: 123456
- Your guess: 456123
- Feedback: --- (three digits correct but in wrong positions)

## Detailed Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.0.0 or higher) - Only for developer installation
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Step-by-Step Installation

1. **Choose Your Installation Method**
   - For casual players: Use "Option 2: Download and Play"
   - For developers: Use "Option 3: Developer Installation"

2. **System Requirements**
   - Any modern computer (Windows, Mac, or Linux)
   - 2GB RAM minimum
   - Internet connection for initial download

3. **Start Playing**
   - Launch the game using the provided scripts or commands
   - Open in your browser
   - Start playing with a friend!

## Troubleshooting

Common Solutions:

1. **Game won't start?**
   - Make sure you have a modern web browser
   - Try a different port if 5173 is in use
   - Check your internet connection

2. **Can't see the game?**
   - Clear your browser cache
   - Try a different browser
   - Make sure JavaScript is enabled

3. **Other Issues**
   - Check our [FAQ](./wiki/FAQ.md)
   - [Create an issue](https://github.com/volkanbatur/number-crunch/issues)
   - Join our [Discussions](https://github.com/volkanbatur/number-crunch/discussions)

## Built With

- React - For the user interface
- TypeScript - For type safety
- Chakra UI - For beautiful components
- Vite - For fast development

## License

This project is licensed under the MIT License - see the LICENSE file for details. 