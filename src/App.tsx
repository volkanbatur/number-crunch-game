import React, { useState, useEffect } from 'react';
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
  Tooltip,
  useToast,
  Input
} from '@chakra-ui/react';
import GameBoard from './components/GameBoard';
import NumberInput from './components/NumberInput';
import ServerInfo from './components/ServerInfo';
import { GameStats } from './components/GameStats';
import { WinnerConfetti } from './components/WinnerConfetti';

type GameState = 'SETUP' | 'PLAYING' | 'FINISHED';
type Player = 1 | 2;

interface GuessData {
  guess: string;
  result: string;
  positions: boolean[];
  timestamp: number;
}

interface PlayerState {
  secretNumber: string;
  guesses: GuessData[];
  discoveredDigits: string[];
  icon: string;
  name: string;
  stats: {
    guessCount: number;
    correctDigits: number;
    averageTime: number;
    lastGuessTime: number;
  };
}

const FRUIT_ICONS = ['🍎', '🍌', '🍇', '🍊', '🍓'];
const TIME_LIMITS = [30, 60, 90, 120];

function App() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [player1Number, setPlayer1Number] = useState<string>('');
  const [player2Number, setPlayer2Number] = useState<string>('');
  const [player1Name, setPlayer1Name] = useState<string>(localStorage.getItem('player1Name') || '');
  const [player2Name, setPlayer2Name] = useState<string>(localStorage.getItem('player2Name') || '');
  const [player1Guesses, setPlayer1Guesses] = useState<GuessData[]>([]);
  const [player2Guesses, setPlayer2Guesses] = useState<GuessData[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [gameResult, setGameResult] = useState<Player | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [player1Icon, setPlayer1Icon] = useState<string>('');
  const [player2Icon, setPlayer2Icon] = useState<string>('');
  const [player1, setPlayer1] = useState<PlayerState>({
    secretNumber: '',
    guesses: [],
    discoveredDigits: [],
    icon: '',
    name: localStorage.getItem('player1Name') || '',
    stats: {
      guessCount: 0,
      correctDigits: 0,
      averageTime: 0,
      lastGuessTime: 0,
    },
  });
  const [player2, setPlayer2] = useState<PlayerState>({
    secretNumber: '',
    guesses: [],
    discoveredDigits: [],
    icon: '',
    name: localStorage.getItem('player2Name') || '',
    stats: {
      guessCount: 0,
      correctDigits: 0,
      averageTime: 0,
      lastGuessTime: 0,
    },
  });
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);
  const toast = useToast();
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    if (gameState === 'SETUP') {
      // Reset game state
      setPlayer1Guesses([]);
      setPlayer2Guesses([]);
      setCurrentPlayer(1);
      setGameResult(null);
      setTimeLeft(timeLimit);
      setPlayer1Icon('');
      setPlayer2Icon('');
      setPlayer1({
        secretNumber: '',
        guesses: [],
        discoveredDigits: [],
        icon: '',
        name: localStorage.getItem('player1Name') || '',
        stats: {
          guessCount: 0,
          correctDigits: 0,
          averageTime: 0,
          lastGuessTime: 0,
        },
      });
      setPlayer2({
        secretNumber: '',
        guesses: [],
        discoveredDigits: [],
        icon: '',
        name: localStorage.getItem('player2Name') || '',
        stats: {
          guessCount: 0,
          correctDigits: 0,
          averageTime: 0,
          lastGuessTime: 0,
        },
      });
    }
  }, [gameState, timeLimit]);

  useEffect(() => {
    if (gamePhase === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(timer);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [gamePhase, currentPlayer]);

  const handleTimeUp = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    handleGuess('000000'); // Default guess when time is up
  };

  const handleGuess = (guess: string) => {
    const currentPlayerState = currentPlayer === 1 ? player1 : player2;
    const targetNumber = currentPlayer === 1 ? player2.secretNumber : player1.secretNumber;
    
    // Arrays to track which digits are used
    const targetDigits = targetNumber.split('');
    const guessDigits = guess.split('');
    const positions = new Array(6).fill(false);
    const usedTargetIndices = new Array(6).fill(false);
    const usedGuessIndices = new Array(6).fill(false);
    let result = '';

    // First pass: Check for exact matches (same digit in same position)
    for (let i = 0; i < 6; i++) {
      if (guessDigits[i] === targetDigits[i]) {
        positions[i] = true;
        usedTargetIndices[i] = true;
        usedGuessIndices[i] = true;
        result += '+';
      }
    }

    // Second pass: Check for correct digits in wrong positions
    for (let i = 0; i < 6; i++) {
      if (!usedGuessIndices[i]) { // If this guess digit hasn't been used
        for (let j = 0; j < 6; j++) {
          if (!usedTargetIndices[j] && guessDigits[i] === targetDigits[j]) {
            usedTargetIndices[j] = true;
            usedGuessIndices[i] = true;
            result += '-';
            break;
          }
        }
      }
    }

    // Create the new guess object
    const newGuess: GuessData = {
      guess,
      result,
      positions,
      timestamp: Date.now()
    };

    // Update player state
    const updatedPlayer = updatePlayerStats(currentPlayerState, guess, result);
    const newDiscoveredDigits = [...currentPlayerState.discoveredDigits];

    // Update discovered digits (only for exact matches)
    for (let i = 0; i < 6; i++) {
      if (positions[i] && !newDiscoveredDigits.includes(guess[i])) {
        newDiscoveredDigits.push(guess[i]);
      }
    }

    // Update the appropriate player's state
    if (currentPlayer === 1) {
      setPlayer1({
        ...updatedPlayer,
        guesses: [...player1.guesses, newGuess],
        discoveredDigits: newDiscoveredDigits,
      });
      setPlayer1Guesses([...player1Guesses, newGuess]);
    } else {
      setPlayer2({
        ...updatedPlayer,
        guesses: [...player2.guesses, newGuess],
        discoveredDigits: newDiscoveredDigits,
      });
      setPlayer2Guesses([...player2Guesses, newGuess]);
    }

    // Check for win condition
    if (result === '++++++') {
      setGamePhase('finished');
      setWinner(currentPlayer);
      setGameResult(currentPlayer);
      if (timerId) {
        clearInterval(timerId);
      }
      
      const winnerName = currentPlayer === 1 ? player1.name : player2.name;
      toast({
        title: `${currentPlayer === 1 ? player1.icon : player2.icon} ${winnerName} Wins! 🎉`,
        description: `Congratulations! You found the number in ${currentPlayerState.stats.guessCount + 1} guesses!`,
        status: 'success',
        duration: 10000,
        isClosable: true,
        position: 'top',
      });
    } else {
      // Switch to other player
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setTimeLeft(timeLimit);
    }
  };

  const updatePlayerStats = (
    player: PlayerState,
    guess: string,
    result: string
  ): PlayerState => {
    const now = Date.now();
    const guessTime = player.stats.lastGuessTime ? (now - player.stats.lastGuessTime) / 1000 : 0;
    const correctDigits = (result.match(/\+/g) || []).length;
    
    return {
      ...player,
      stats: {
        guessCount: player.stats.guessCount + 1,
        correctDigits: Math.max(player.stats.correctDigits, correctDigits),
        averageTime: player.stats.guessCount === 0
          ? guessTime
          : (player.stats.averageTime * player.stats.guessCount + guessTime) / (player.stats.guessCount + 1),
        lastGuessTime: now,
      },
    };
  };

  const handlePlayerNumberSubmit = (player: Player, number: string) => {
    if (player === 1) {
      if (!player1Icon) {
        return; // Don't allow number submission without icon selection
      }
      setPlayer1Number(number);
      setPlayer1(prev => ({ ...prev, secretNumber: number }));
    } else {
      if (!player2Icon) {
        return; // Don't allow number submission without icon selection
      }
      setPlayer2Number(number);
      setPlayer2(prev => ({ ...prev, secretNumber: number }));
      setGameState('PLAYING');
      setGamePhase('playing');
    }
  };

  const renderIconSelection = (player: Player) => (
    <VStack spacing={4} w="100%" maxW="400px">
      <Text textAlign="center" fontSize={isMobile ? "md" : "lg"} fontWeight="bold">
        Player {player}, Choose Your Icon
      </Text>
      <HStack spacing={2} justify="center" wrap="wrap">
        {FRUIT_ICONS.map((fruit, index) => (
          <Tooltip key={index} label={fruit} placement="top">
            <IconButton
              aria-label={fruit}
              icon={<Text fontSize="2xl">{fruit}</Text>}
              size="lg"
              variant={
                (player === 1 && player1Icon === fruit) ||
                (player === 2 && player2Icon === fruit)
                  ? "solid"
                  : "outline"
              }
              colorScheme={
                (player === 1 && player1Icon === fruit) ||
                (player === 2 && player2Icon === fruit)
                  ? "blue"
                  : "gray"
              }
              isDisabled={
                (player === 1 && player2Icon === fruit) ||
                (player === 2 && player1Icon === fruit)
              }
              onClick={() => {
                if (player === 1) {
                  setPlayer1Icon(fruit);
                } else {
                  setPlayer2Icon(fruit);
                }
              }}
            />
          </Tooltip>
        ))}
      </HStack>
    </VStack>
  );

  const handleSetup = (number: string, isPlayer1: boolean) => {
    if (isPlayer1) {
      setPlayer1(prev => ({ ...prev, secretNumber: number }));
    } else {
      setPlayer2(prev => ({ ...prev, secretNumber: number }));
      setGamePhase('playing');
    }
  };

  const handleNameChange = (player: 1 | 2, name: string) => {
    if (player === 1) {
      setPlayer1Name(name);
      localStorage.setItem('player1Name', name);
      setPlayer1(prev => ({ ...prev, name }));
    } else {
      setPlayer2Name(name);
      localStorage.setItem('player2Name', name);
      setPlayer2(prev => ({ ...prev, name }));
    }
  };

  const handleReset = () => {
    setGamePhase('setup');
    setGameState('SETUP');
    setPlayer1({
      secretNumber: '',
      guesses: [],
      discoveredDigits: [],
      icon: '',
      name: player1Name,
      stats: {
        guessCount: 0,
        correctDigits: 0,
        averageTime: 0,
        lastGuessTime: 0,
      },
    });
    setPlayer2({
      secretNumber: '',
      guesses: [],
      discoveredDigits: [],
      icon: '',
      name: player2Name,
      stats: {
        guessCount: 0,
        correctDigits: 0,
        averageTime: 0,
        lastGuessTime: 0,
      },
    });
    setPlayer1Guesses([]);
    setPlayer2Guesses([]);
    setPlayer1Number('');
    setPlayer2Number('');
    setPlayer1Icon('');
    setPlayer2Icon('');
    setCurrentPlayer(1);
    setTimeLeft(timeLimit);
    setWinner(null);
    setGameResult(null);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  return (
    <ChakraProvider>
      <Box position="relative" minH="100vh" bg="gray.100" py={8} px={4}>
        <Box position="fixed" top={0} left={0} right={0} bottom={0} pointerEvents="none" zIndex={10}>
          <WinnerConfetti 
            isActive={Boolean(winner !== null)} 
            playerIcon={winner === 1 ? player1Icon : player2Icon} 
          />
        </Box>
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
                    {TIME_LIMITS.map(limit => (
                      <option key={limit} value={limit}>
                        {limit} seconds per turn
                      </option>
                    ))}
                  </Select>

                  <VStack spacing={2} w="100%">
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      Enter Player 1's Name
                    </Text>
                    <Input
                      value={player1Name}
                      onChange={(e) => handleNameChange(1, e.target.value)}
                      placeholder="Player 1's Name"
                      size={isMobile ? "md" : "lg"}
                      bg="white"
                    />
                  </VStack>

                  {renderIconSelection(1)}
                  {player1Icon && player1Name && (
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      {player1Name}, enter your 6-digit number
                    </Text>
                  )}
                </VStack>
              )}
              {player1Number && (
                <>
                  <VStack spacing={2} w="100%" maxW="400px">
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      Enter Player 2's Name
                    </Text>
                    <Input
                      value={player2Name}
                      onChange={(e) => handleNameChange(2, e.target.value)}
                      placeholder="Player 2's Name"
                      size={isMobile ? "md" : "lg"}
                      bg="white"
                    />
                  </VStack>
                  {renderIconSelection(2)}
                  {player2Icon && player2Name && (
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      {player2Name}, enter your 6-digit number
                    </Text>
                  )}
                </>
              )}
              <NumberInput 
                onSubmit={(number) => handlePlayerNumberSubmit(!player1Number ? 1 : 2, number)} 
                isSetup={true}
                isDisabled={(!player1Number && (!player1Icon || !player1Name)) || (player1Number && (!player2Icon || !player2Name))}
              />
            </>
          ) : (
            <>
              {gameResult ? (
                <VStack spacing={4} w="100%" maxW="600px">
                  <Heading size={isMobile ? "md" : "lg"} color="green.500">
                    {gameResult === 1 ? player1.name : player2.name} {gameResult === 1 ? player1Icon : player2Icon} Wins!
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
                              {player1.name} {player1Icon}
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
                              {player2.name} {player2Icon}
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
                              {player1.name} {player1Icon} correctly guessed {player2Number} in {player1Guesses.length} tries
                            </Text>
                          ) : (
                            <Text>
                              {player2.name} {player2Icon} correctly guessed {player1Number} in {player2Guesses.length} tries
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
                    onClick={handleReset}
                    mt={4}
                  >
                    Play Again
                  </Button>
                </VStack>
              ) : (
                <>
                  <VStack spacing={2} w="100%">
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"} color="blue.600">
                      {currentPlayer === 1 ? player1.name : player2.name} {currentPlayer === 1 ? player1Icon : player2Icon}'s turn to guess
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
                    player1DiscoveredDigits={player1.discoveredDigits}
                    player2DiscoveredDigits={player2.discoveredDigits}
                    timeLeft={timeLeft}
                    timeLimit={timeLimit}
                    player1Icon={player1Icon}
                    player2Icon={player2Icon}
                    player1Name={player1.name}
                    player2Name={player2.name}
                  />
                </>
              )}
            </>
          )}

          {gamePhase !== 'setup' && (
            <GameStats
              player1={{
                icon: player1.icon,
                guessCount: player1.stats.guessCount,
                correctDigits: player1.stats.correctDigits,
                averageTime: player1.stats.averageTime,
              }}
              player2={{
                icon: player2.icon,
                guessCount: player2.stats.guessCount,
                correctDigits: player2.stats.correctDigits,
                averageTime: player2.stats.averageTime,
              }}
            />
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App; 