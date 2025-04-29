# Number Crunch - Version 2

This is the second version of Number Crunch, a two-player number guessing game with enhanced UI features. Players can select their fruit icons and enjoy a more compact, intuitive layout.

## Game Rules

1. Each player chooses a fruit icon and a secret 6-digit number with unique digits
2. Players take turns trying to guess each other's number
3. After each guess, the player receives feedback:
   - '+' for each digit in the correct position
   - '-' for each correct digit in the wrong position
4. Players have a customizable time limit per turn (30, 60, 90, or 120 seconds)
5. If time runs out, a default guess is submitted
6. The first player to correctly guess their opponent's number (getting '++++++') wins

## Features

- Clean, modern UI built with React and Chakra UI
- Player identification with fun fruit icons (🍎 🍌 🍇 🍊 🍓)
- Customizable timer with visual feedback
- Compact, player-specific input areas
- Input validation for 6-digit unique numbers
- Color-coded feedback for discovered digits
- Responsive design for both desktop and mobile
- Auto-submit when timer runs out
- Detailed game summary with statistics

## Technical Stack

- React 18
- TypeScript
- Chakra UI
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. First player selects their fruit icon
2. First player enters their secret 6-digit number
3. Second player selects their fruit icon (different from first player)
4. Second player enters their secret 6-digit number
5. Game begins with Player 1's turn
6. Each player has the selected time limit to make a guess
7. Game continues until one player correctly guesses the opponent's number

## Version History

### Version 2 (Current)
- Added player fruit icons for better identification
- Implemented customizable time limits (30/60/90/120 seconds)
- Redesigned input area to be more compact and player-specific
- Enhanced game summary with player icons and statistics
- Improved visual feedback for timer states

### Version 1
- Basic two-player gameplay
- Fixed 30-second timer
- Simple input validation
- Basic game summary

## Future Improvements

- Add sound effects for timer and guesses
- Implement a score tracking system
- Add animation effects for correct/incorrect guesses
- Add a practice mode against AI
- Add online multiplayer support 