export type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';

export interface GuessResult {
  guess: string;
  result: string;
  timestamp: number;
}

export interface GameBoardProps {
  currentPlayer: 1 | 2;
  targetNumber: string;
  onTurnComplete: () => void;
}

export interface NumberInputProps {
  onSubmit: (number: string) => void;
  isSetup?: boolean;
} 