import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button, useMediaQuery, Progress } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import NumberInput from './components/NumberInput';
import ServerInfo from './components/ServerInfo';

type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';
type Player = 1 | 2;

interface GuessHistory {
  guess: string;
  result: string;
  timestamp: number;
  discoveredPositions: { [position: number]: string };
}

function App() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [player1Number, setPlayer1Number] = useState<string>('');
  const [player2Number, setPlayer2Number] = useState<string>('');
  const [player1Guesses, setPlayer1Guesses] = useState<GuessHistory[]>([]);
  const [player2Guesses, setPlayer2Guesses] = useState<GuessHistory[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [gameResult, setGameResult] = useState<Player | null>(null);
  const [player1DiscoveredDigits, setPlayer1DiscoveredDigits] = useState<{ [position: number]: string }>({});
  const [player2DiscoveredDigits, setPlayer2DiscoveredDigits] = useState<{ [position: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    if (gameState === 'SETUP') {
      // Reset game state
      setPlayer1Guesses([]);
      setPlayer2Guesses([]);
      setCurrentPlayer(1);
      setGameResult(null);
      setPlayer1DiscoveredDigits({});
      setPlayer2DiscoveredDigits({});
      setTimeLeft(30);
    }
  }, [gameState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING' && !gameResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - submit default guess
            handleGuess('123456');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, currentPlayer, gameResult]);

  const handlePlayerNumberSubmit = (player: Player, number: string) => {
    if (player === 1) {
      setPlayer1Number(number);
    } else {
      setPlayer2Number(number);
      setGameState('PLAYING');
    }
  };

  const checkGuess = (guess: string, target: string): [string, { [position: number]: string }] => {
    let result = '';
    const targetDigits = target.split('');
    const guessDigits = guess.split('');
    const discoveredPositions: { [position: number]: string } = {};

    // First check for correct positions
    for (let i = 0; i < 6; i++) {
      if (guessDigits[i] === targetDigits[i]) {
        result += '+';
        discoveredPositions[i] = guessDigits[i];
      }
    }

    // Then check for correct digits in wrong positions
    for (let i = 0; i < 6; i++) {
      if (guessDigits[i] !== targetDigits[i] && targetDigits.includes(guessDigits[i])) {
        result += '-';
      }
    }

    return [result || 'No matches', discoveredPositions];
  };

  const handleGuess = (guess: string) => {
    if (gameResult) return;

    const targetNumber = currentPlayer === 1 ? player2Number : player1Number;
    const [result, discoveredPositions] = checkGuess(guess, targetNumber);
    
    const newGuess: GuessHistory = {
      guess,
      result,
      timestamp: Date.now(),
      discoveredPositions
    };

    if (currentPlayer === 1) {
      setPlayer1Guesses(prev => [...prev, newGuess]);
      setPlayer1DiscoveredDigits(prev => ({...prev, ...discoveredPositions}));
    } else {
      setPlayer2Guesses(prev => [...prev, newGuess]);
      setPlayer2DiscoveredDigits(prev => ({...prev, ...discoveredPositions}));
    }

    if (result === '++++++') {
      setGameResult(currentPlayer);
    } else {
      setCurrentPlayer(current => current === 1 ? 2 : 1);
      setTimeLeft(30);
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.100" py={8} px={4}>
        <VStack spacing={8} maxW="container.xl" mx="auto">
          <Heading color="blue.600" fontSize={isMobile ? "2xl" : "4xl"}>
            Number Crunch
          </Heading>
          
          <ServerInfo />
          
          {gameState === 'SETUP' ? (
            <>
              <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                {!player1Number ? 'First Player' : 'Second Player'}, enter your 6-digit number
              </Text>
              <NumberInput 
                onSubmit={(number) => handlePlayerNumberSubmit(!player1Number ? 1 : 2, number)} 
                isSetup={true}
              />
            </>
          ) : (
            <>
              {gameResult ? (
                <VStack spacing={4}>
                  <Heading size={isMobile ? "md" : "lg"} color="green.500">
                    Player {gameResult} Wins!
                  </Heading>
                  <Button
                    colorScheme="blue"
                    size={isMobile ? "md" : "lg"}
                    onClick={() => setGameState('SETUP')}
                  >
                    Play Again
                  </Button>
                </VStack>
              ) : (
                <>
                  <VStack spacing={2} w="100%">
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"} color="blue.600">
                      Player {currentPlayer}'s turn to guess
                    </Text>
                    <Box w="100%" maxW="400px">
                      <Progress 
                        value={timeLeft * (100/30)} 
                        colorScheme={timeLeft <= 10 ? "red" : "blue"} 
                        height="8px"
                        borderRadius="full"
                      />
                      <Text textAlign="center" fontSize="sm" color={timeLeft <= 10 ? "red.500" : "gray.600"}>
                        {timeLeft} seconds left
                      </Text>
                    </Box>
                  </VStack>
                  <GameBoard
                    currentPlayer={currentPlayer}
                    onGuess={handleGuess}
                    player1Guesses={player1Guesses}
                    player2Guesses={player2Guesses}
                    player1DiscoveredDigits={player1DiscoveredDigits}
                    player2DiscoveredDigits={player2DiscoveredDigits}
                  />
                </>
              )}
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App; 