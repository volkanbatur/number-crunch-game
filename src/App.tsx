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
  Input,
  Container
} from '@chakra-ui/react';
import { GameBoard } from './components/GameBoard';
import { NumberInput } from './components/NumberInput';
import ServerInfo from './components/ServerInfo';
import { GameStats } from './components/GameStats';
import { WinnerConfetti } from './components/WinnerConfetti';
import { calculateHint, generateRandomNumber } from './utils/gameLogic';
import { GameState, PlayerState, GuessResult, Player } from './types';

interface GuessData {
  guess: string;
  result: string;
  positions: boolean[];
  timestamp: number;
}

const FRUIT_ICONS = ['🍎', '🍌', '🍇', '🍊', '🍓'];
const TIME_LIMITS = [30, 60, 90, 120];

interface Players {
  [key: string]: PlayerState;
}

const initialPlayers: Record<Player, PlayerState> = {
  '1': {
    name: 'Player 1',
    icon: '👤',
    guesses: [],
    discoveredDigits: {},
    state: GameState.SETUP,
  },
  '2': {
    name: 'Player 2',
    icon: '👤',
    guesses: [],
    discoveredDigits: {},
    state: GameState.SETUP,
  }
};

export function App() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [players, setPlayers] = useState<Players>(initialPlayers);
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [player1Number, setPlayer1Number] = useState<string>('');
  const [player2Number, setPlayer2Number] = useState<string>('');
  const [player1Name, setPlayer1Name] = useState<string>(localStorage.getItem('player1Name') || '');
  const [player2Name, setPlayer2Name] = useState<string>(localStorage.getItem('player2Name') || '');
  const [player1Guesses, setPlayer1Guesses] = useState<GuessData[]>([]);
  const [player2Guesses, setPlayer2Guesses] = useState<GuessData[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('1');
  const [gameResult, setGameResult] = useState<Player | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [player1Icon, setPlayer1Icon] = useState<string>('');
  const [player2Icon, setPlayer2Icon] = useState<string>('');
  const [gamePhase, setGamePhase] = useState<GameState>(GameState.SETUP);
  const [timerId, setTimerId] = useState<ReturnType<typeof setInterval> | null>(null);
  const toast = useToast();
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setPlayers(prev => ({
      ...prev,
      '1': {
        ...prev['1'],
        state: 'PLAYING' as GameState
      },
      '2': {
        ...prev['2'],
        state: 'PLAYING' as GameState
      }
    }));
  };

  useEffect(() => {
    if (gamePhase === GameState.PLAYING) {
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
    if (gameState === GameState.PLAYING) {
      setGameState(GameState.FINISHED);
      setWinner(currentPlayer === '1' ? '2' : '1');
    }
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    handleGuess(currentPlayer, '000000'); // Default guess when time is up
  };

  const handleGuess = (player: Player, guess: string) => {
    const targetPlayer: Player = player === '1' ? '2' : '1';
    const target = players[targetPlayer].secretNumber;
    
    if (!target) return; // Early return if target is undefined
    
    const positions: boolean[] = new Array(6).fill(false);
    const usedTargetPositions = new Array(6).fill(false);
    const usedGuessPositions = new Array(6).fill(false);
    let resultString = '';

    // First pass: check for exact matches
    for (let i = 0; i < 6; i++) {
      if (guess[i] === target[i]) {
        positions[i] = true;
        usedTargetPositions[i] = true;
        usedGuessPositions[i] = true;
        resultString += '+';
      }
    }

    // Second pass: check for correct digits in wrong positions
    for (let i = 0; i < 6; i++) {
      if (!usedGuessPositions[i]) {
        for (let j = 0; j < 6; j++) {
          if (!usedTargetPositions[j] && guess[i] === target[j]) {
            usedTargetPositions[j] = true;
            usedGuessPositions[i] = true;
            resultString += '-';
            break;
          }
        }
      }
    }

    const newGuess: GuessResult = {
      guess,
      result: resultString,
      positions,
      timestamp: Date.now()
    };

    const newDiscoveredDigits = { ...players[player].discoveredDigits };
    for (let i = 0; i < 6; i++) {
      if (positions[i]) {
        newDiscoveredDigits[guess[i]] = true;
      }
    }

    setPlayers(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        guesses: [...prev[player].guesses, newGuess],
        discoveredDigits: newDiscoveredDigits,
        state: resultString === '++++++' ? GameState.FINISHED : prev[player].state
      }
    }));

    if (resultString === '++++++') {
      toast({
        title: `${players[player].name} wins!`,
        description: `Congratulations! You found the number in ${players[player].guesses.length + 1} guesses!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setGameState(GameState.FINISHED);
    }
  };

  const handlePlayerNumberSubmit = (player: Player, number: string) => {
    if (player === '1') {
      if (!player1Icon) {
        return; // Don't allow number submission without icon selection
      }
      setPlayer1Number(number);
      setPlayers(prev => ({
        ...prev,
        '1': {
          ...prev['1'],
          secretNumber: number
        }
      }));
    } else {
      if (!player2Icon) {
        return; // Don't allow number submission without icon selection
      }
      setPlayer2Number(number);
      setPlayers(prev => ({
        ...prev,
        '2': {
          ...prev['2'],
          secretNumber: number
        }
      }));
      setGameState(GameState.PLAYING);
      setGamePhase(GameState.PLAYING);
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
                (player === '1' && player1Icon === fruit) ||
                (player === '2' && player2Icon === fruit)
                  ? "solid"
                  : "outline"
              }
              colorScheme={
                (player === '1' && player1Icon === fruit) ||
                (player === '2' && player2Icon === fruit)
                  ? "blue"
                  : "gray"
              }
              isDisabled={
                (player === '1' && player2Icon === fruit) ||
                (player === '2' && player1Icon === fruit)
              }
              onClick={() => {
                if (player === '1') {
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

  const handlePlayerSetup = (player: Player, name: string, icon: string) => {
    if (gameState !== GameState.SETUP) return;
    
    if (player === '1') {
      setPlayers(prev => ({
        ...prev,
        '1': {
          ...prev['1'],
          name,
          icon
        }
      }));
      setPlayer1Icon(icon);
    } else {
      setPlayers(prev => ({
        ...prev,
        '2': {
          ...prev['2'],
          name,
          icon
        }
      }));
      setPlayer2Icon(icon);
    }

    // If both players are set up, start the game
    if ((player === '1' && players['2'].name) || (player === '2' && players['1'].name)) {
      startGame();
    }
  };

  const handleNameChange = (player: Player, name: string) => {
    if (player === '1') {
      setPlayer1Name(name);
      localStorage.setItem('player1Name', name);
      setPlayers(prev => ({
        ...prev,
        '1': {
          ...prev['1'],
          name
        }
      }));
    } else {
      setPlayer2Name(name);
      localStorage.setItem('player2Name', name);
      setPlayers(prev => ({
        ...prev,
        '2': {
          ...prev['2'],
          name
        }
      }));
    }
  };

  const handleReset = () => {
    setPlayers(prev => ({
      ...prev,
      '1': {
        ...prev['1'],
        guesses: [],
        discoveredDigits: {},
        state: GameState.SETUP
      },
      '2': {
        ...prev['2'],
        guesses: [],
        discoveredDigits: {},
        state: GameState.SETUP
      }
    }));
    setGameState(GameState.SETUP);
    setGamePhase(GameState.SETUP);
    setPlayer1Guesses([]);
    setPlayer2Guesses([]);
    setPlayer1Number('');
    setPlayer2Number('');
    setPlayer1Icon('');
    setPlayer2Icon('');
    setCurrentPlayer('1');
    setTimeLeft(timeLimit);
    setWinner(null);
    setGameResult(null);
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setGamePhase(GameState.PLAYING);
    startTimer();
  };

  const startTimer = () => {
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
  };

  const handleStartGame = () => {
    setGameState(GameState.PLAYING);
    setPlayers(prev => ({
      '1': {
        ...prev['1'],
        secretNumber: generateRandomNumber(),
        state: GameState.PLAYING
      },
      '2': {
        ...prev['2'],
        secretNumber: generateRandomNumber(),
        state: GameState.PLAYING
      }
    }));
  };

  return (
    <ChakraProvider>
      <Box position="relative" minH="100vh" bg="gray.100" py={8} px={4}>
        <Box position="fixed" top={0} left={0} right={0} bottom={0} pointerEvents="none" zIndex={10}>
          <WinnerConfetti 
            isActive={Boolean(winner !== null)} 
            playerIcon={winner === '1' ? player1Icon : player2Icon} 
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
                      onChange={(e) => handleNameChange('1', e.target.value)}
                      placeholder="Player 1's Name"
                      size={isMobile ? "md" : "lg"}
                      bg="white"
                    />
                  </VStack>

                  {renderIconSelection('1')}
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
                      onChange={(e) => handleNameChange('2', e.target.value)}
                      placeholder="Player 2's Name"
                      size={isMobile ? "md" : "lg"}
                      bg="white"
                    />
                  </VStack>
                  {renderIconSelection('2')}
                  {player2Icon && player2Name && (
                    <Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      {player2Name}, enter your 6-digit number
                    </Text>
                  )}
                </>
              )}
              <NumberInput 
                onSubmit={(number) => handlePlayerNumberSubmit(!player1Number ? '1' : '2', number)} 
                isDisabled={Boolean((!player1Number && (!player1Icon || !player1Name)) || (player1Number && (!player2Icon || !player2Name)))}
                timeLeft={timeLeft}
                timeLimit={timeLimit}
              />
            </>
          ) : (
            <>
              {gameResult ? (
                <VStack spacing={4} w="100%" maxW="600px">
                  <Heading size={isMobile ? "md" : "lg"} color="green.500">
                    {gameResult === '1' ? players['1'].name : players['2'].name} {gameResult === '1' ? player1Icon : player2Icon} Wins!
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
                              {players['1'].name} {player1Icon}
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
                              {players['2'].name} {player2Icon}
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
                          {gameResult === '1' ? (
                            <Text>
                              {players['1'].name} {player1Icon} correctly guessed {player2Number} in {player1Guesses.length} tries
                            </Text>
                          ) : (
                            <Text>
                              {players['2'].name} {player2Icon} correctly guessed {player1Number} in {player2Guesses.length} tries
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
                      {currentPlayer === '1' ? players['1'].name : players['2'].name} {currentPlayer === '1' ? player1Icon : player2Icon}'s turn to guess
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
                    onGuess={(guess) => handleGuess(currentPlayer, guess)}
                    player1Guesses={player1Guesses}
                    player2Guesses={player2Guesses}
                    player1DiscoveredDigits={players['1'].discoveredDigits}
                    player2DiscoveredDigits={players['2'].discoveredDigits}
                    timeLeft={timeLeft}
                    timeLimit={timeLimit}
                    player1Icon={player1Icon}
                    player2Icon={player2Icon}
                    player1Name={players['1'].name}
                    player2Name={players['2'].name}
                  />
                </>
              )}
            </>
          )}

          {gamePhase !== GameState.SETUP && (
            <GameStats
              player1={{
                icon: players['1'].icon,
                guessCount: players['1'].guesses.length,
                correctDigits: Object.keys(players['1'].discoveredDigits).length,
                averageTime: players['1'].guesses.length === 0 ? 0 : players['1'].guesses.reduce((total, guess) => total + guess.timestamp, 0) / players['1'].guesses.length,
              }}
              player2={{
                icon: players['2'].icon,
                guessCount: players['2'].guesses.length,
                correctDigits: Object.keys(players['2'].discoveredDigits).length,
                averageTime: players['2'].guesses.length === 0 ? 0 : players['2'].guesses.reduce((total, guess) => total + guess.timestamp, 0) / players['2'].guesses.length,
              }}
            />
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App; 