export enum GameState {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export type Player = '1' | '2';

export interface PlayerStats {
  guessCount: number;
  correctDigits: number;
  averageTime: number;
  lastGuessTime: number;
}

export interface GuessResult {
  guess: string;
  result: string;
  positions: boolean[];
  timestamp: number;
}

export interface PlayerState {
  name: string;
  icon: string;
  guesses: GuessResult[];
  discoveredDigits: Record<string, boolean>;
  state: GameState;
  secretNumber?: string;
}

export interface GameSettings {
  numberLength: number;
  maxGuesses: number;
  timeLimit: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  averageGuesses: number;
  bestTime: number;
  winStreak: number;
}

export interface GameBoardProps {
  currentPlayer: Player;
  onGuess: (guess: string) => void;
  player1Guesses: GuessResult[];
  player2Guesses: GuessResult[];
  player1DiscoveredDigits: Record<string, boolean>;
  player2DiscoveredDigits: Record<string, boolean>;
  timeLeft: number;
  timeLimit: number;
  player1Icon: string;
  player2Icon: string;
  player1Name: string;
  player2Name: string;
}

export interface NumberInputProps {
  onSubmit: (number: string) => void;
  isDisabled?: boolean;
  isSetup?: boolean;
  timeLeft?: number;
  timeLimit?: number;
  isCompact?: boolean;
} 