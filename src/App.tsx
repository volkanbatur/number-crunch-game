import React from 'react';
import { 
  ChakraProvider, 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  useMediaQuery, 
  Progress, 
  Select,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
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

const FRUIT_ICONS = [
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '🍇', name: 'Grapes' },
  { emoji: '🍊', name: 'Orange' },
  { emoji: '🍓', name: 'Strawberry' }
];

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
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [player1Icon, setPlayer1Icon] = useState<string>('');
  const [player2Icon, setPlayer2Icon] = useState<string>('');

  useEffect(() => {
    if (gameState === 'SETUP') {
      // Reset game state
      setPlayer1Guesses([]);
      setPlayer2Guesses([]);
      setCurrentPlayer(1);
      setGameResult(null);
      setPlayer1DiscoveredDigits({});
      setPlayer2DiscoveredDigits({});
      setTimeLeft(timeLimit);
      setPlayer1Icon('');
      setPlayer2Icon('');
    }
  }, [gameState, timeLimit]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING' && !gameResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - submit default guess
            handleGuess('123456');
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, currentPlayer, gameResult, timeLimit]);

  const handlePlayerNumberSubmit = (player: Player, number: string) => {
    if (player === 1) {
      if (!player1Icon) {
        return; // Don't allow number submission without icon selection
      }
      setPlayer1Number(number);
    } else {
      if (!player2Icon) {
        return; // Don't allow number submission without icon selection
      }
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
      setTimeLeft(timeLimit);
    }
  };

  const renderIconSelection = (player: Player) => (
    <VStack spacing={4} w="100%" maxW="400px">
      <Text textAlign="center" fontSize={isMobile ? "md" : "lg"} fontWeight="bold">
        Player {player}, Choose Your Icon
      </Text>
      <HStack spacing={2} justify="center" wrap="wrap">
        {FRUIT_ICONS.map((fruit, index) => (
          <Tooltip key={index} label={fruit.name} placement="top">
            <IconButton
              aria-label={fruit.name}
              icon={<Text fontSize="2xl">{fruit.emoji}</Text>}
              size="lg"
              variant={
                (player === 1 && player1Icon === fruit.emoji) ||
                (player === 2 && player2Icon === fruit.emoji)
                  ? "solid"
                  : "outline"
              }
              colorScheme={
                (player === 1 && player1Icon === fruit.emoji) ||
                (player === 2 && player2Icon === fruit.emoji)
                  ? "blue"
                  : "gray"
              }
              isDisabled={
                (player === 1 && player2Icon === fruit.emoji) ||
                (player === 2 && player1Icon === fruit.emoji)
              }
              onClick={() => {
                if (player === 1) {
                  setPlayer1Icon(fruit.emoji);
                } else {
                  setPlayer2Icon(fruit.emoji);
                }
              }}
            />
          </Tooltip>
        ))}
      </HStack>
    </VStack>
  );

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
              {!player1Number && (
                <VStack spacing={4} w="100%" maxW="400px">
                  <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                    Select Turn Time Limit
                  </Text>
                  <Select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    bg="white"
                    size={isMobile ? "md" : "lg"}
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>60 seconds</option>
                    <option value={90}>90 seconds</option>
                    <option value={120}>120 seconds</option>
                  </Select>
                  {renderIconSelection(1)}
                  {player1Icon && (
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      First Player, enter your 6-digit number
                    </Text>
                  )}
                </VStack>
              )}
              {player1Number && (
                <>
                  {renderIconSelection(2)}
                  {player2Icon && (
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      Second Player, enter your 6-digit number
                    </Text>
                  )}
                </>
              )}
              <NumberInput 
                onSubmit={(number) => handlePlayerNumberSubmit(!player1Number ? 1 : 2, number)} 
                isSetup={true}
                isDisabled={(!player1Number && !player1Icon) || (player1Number && !player2Icon)}
              />
            </>
          ) : (
            <>
              {gameResult ? (
                <VStack spacing={4} w="100%" maxW="600px">
                  <Heading size={isMobile ? "md" : "lg"} color="green.500">
                    Player {gameResult} {gameResult === 1 ? player1Icon : player2Icon} Wins!
                  </Heading>
                  
                  <Box w="100%" bg="white" p={6} borderRadius="lg" boxShadow="md">
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="lg" fontWeight="bold" color="blue.600" textAlign="center">
                        Game Summary
                      </Text>
                      
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <GridItem>
                          <VStack align="stretch" spacing={2}>
                            <Text fontWeight="bold" color="blue.500">
                              Player 1 {player1Icon}
                            </Text>
                            <Box p={3} bg="gray.50" borderRadius="md">
                              <Text>Secret Number: {player1Number}</Text>
                              <Text>Total Guesses: {player1Guesses.length}</Text>
                            </Box>
                          </VStack>
                        </GridItem>
                        
                        <GridItem>
                          <VStack align="stretch" spacing={2}>
                            <Text fontWeight="bold" color="green.500">
                              Player 2 {player2Icon}
                            </Text>
                            <Box p={3} bg="gray.50" borderRadius="md">
                              <Text>Secret Number: {player2Number}</Text>
                              <Text>Total Guesses: {player2Guesses.length}</Text>
                            </Box>
                          </VStack>
                        </GridItem>
                      </Grid>

                      <Box>
                        <Text fontWeight="bold" mb={2}>Winning Move:</Text>
                        <Box p={3} bg="green.50" borderRadius="md">
                          {gameResult === 1 ? (
                            <Text>
                              Player 1 {player1Icon} correctly guessed {player2Number} in {player1Guesses.length} tries
                            </Text>
                          ) : (
                            <Text>
                              Player 2 {player2Icon} correctly guessed {player1Number} in {player2Guesses.length} tries
                            </Text>
                          )}
                        </Box>
                      </Box>

                      <Box>
                        <Text fontWeight="bold" mb={2}>Game Settings:</Text>
                        <Box p={3} bg="blue.50" borderRadius="md">
                          <Text>Time Limit per Turn: {timeLimit} seconds</Text>
                          <Text>Total Game Duration: {Math.floor((Date.now() - player1Guesses[0]?.timestamp || 0) / 1000)} seconds</Text>
                        </Box>
                      </Box>
                    </VStack>
                  </Box>

                  <Button
                    colorScheme="blue"
                    size={isMobile ? "md" : "lg"}
                    onClick={() => setGameState('SETUP')}
                    mt={4}
                  >
                    Play Again
                  </Button>
                </VStack>
              ) : (
                <>
                  <VStack spacing={2} w="100%">
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"} color="blue.600">
                      Player {currentPlayer} {currentPlayer === 1 ? player1Icon : player2Icon}'s turn to guess
                    </Text>
                    <Box w="100%" maxW="400px">
                      <Progress 
                        value={(timeLeft * (100/timeLimit))} 
                        colorScheme={timeLeft <= timeLimit/3 ? "red" : "blue"} 
                        height="8px"
                        borderRadius="full"
                      />
                      <Text textAlign="center" fontSize="sm" color={timeLeft <= timeLimit/3 ? "red.500" : "gray.600"}>
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
                    timeLeft={timeLeft}
                    timeLimit={timeLimit}
                    player1Icon={player1Icon}
                    player2Icon={player2Icon}
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