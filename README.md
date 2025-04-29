# Number Crunch - Same Device Version

This is the first version of Number Crunch, a two-player number guessing game that can be played on the same device. In this version, players take turns trying to guess each other's 6-digit numbers.

## Game Rules

1. Each player chooses a secret 6-digit number with unique digits
2. Players take turns trying to guess each other's number
3. After each guess, the player receives feedback:
   - '+' for each digit in the correct position
   - '-' for each correct digit in the wrong position
4. Players have 30 seconds to make each guess
5. If time runs out, a default guess is submitted
6. The first player to correctly guess their opponent's number (getting '++++++') wins

## Features

- Clean, modern UI built with React and Chakra UI
- Timer with visual feedback
- Input validation for 6-digit unique numbers
- Color-coded feedback for discovered digits
- Responsive design for both desktop and mobile
- Auto-submit when timer runs out

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

1. First player enters their secret 6-digit number
2. Second player enters their secret 6-digit number
3. Game begins with Player 1's turn
4. Each player has 30 seconds to make a guess
5. Game continues until one player correctly guesses the opponent's number

## Future Improvements

- Add sound effects for timer and guesses
- Implement a score tracking system
- Add animation effects for correct/incorrect guesses
- Add a practice mode against AI 