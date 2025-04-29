"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const GameBoard_1 = __importDefault(require("./components/GameBoard"));
const NumberInput_1 = __importDefault(require("./components/NumberInput"));
const ServerInfo_1 = __importDefault(require("./components/ServerInfo"));
const GameStats_1 = require("./components/GameStats");
const WinnerConfetti_1 = require("./components/WinnerConfetti");
const FRUIT_ICONS = ['🍎', '🍌', '🍇', '🍊', '🍓'];
const TIME_LIMITS = [30, 60, 90, 120];
function App() {
    var _a;
    const [isMobile] = (0, react_2.useMediaQuery)("(max-width: 768px)");
    const [gameState, setGameState] = (0, react_1.useState)('SETUP');
    const [player1Number, setPlayer1Number] = (0, react_1.useState)('');
    const [player2Number, setPlayer2Number] = (0, react_1.useState)('');
    const [player1Name, setPlayer1Name] = (0, react_1.useState)(localStorage.getItem('player1Name') || '');
    const [player2Name, setPlayer2Name] = (0, react_1.useState)(localStorage.getItem('player2Name') || '');
    const [player1Guesses, setPlayer1Guesses] = (0, react_1.useState)([]);
    const [player2Guesses, setPlayer2Guesses] = (0, react_1.useState)([]);
    const [currentPlayer, setCurrentPlayer] = (0, react_1.useState)(1);
    const [gameResult, setGameResult] = (0, react_1.useState)(null);
    const [timeLimit, setTimeLimit] = (0, react_1.useState)(60);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)(60);
    const [player1Icon, setPlayer1Icon] = (0, react_1.useState)('');
    const [player2Icon, setPlayer2Icon] = (0, react_1.useState)('');
    const [player1, setPlayer1] = (0, react_1.useState)({
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
    const [player2, setPlayer2] = (0, react_1.useState)({
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
    const [gamePhase, setGamePhase] = (0, react_1.useState)('setup');
    const [timerId, setTimerId] = (0, react_1.useState)(null);
    const toast = (0, react_2.useToast)();
    const [winner, setWinner] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
    const handleGuess = (guess) => {
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
        const newGuess = {
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
            setPlayer1(Object.assign(Object.assign({}, updatedPlayer), { guesses: [...player1.guesses, newGuess], discoveredDigits: newDiscoveredDigits }));
            setPlayer1Guesses([...player1Guesses, newGuess]);
        }
        else {
            setPlayer2(Object.assign(Object.assign({}, updatedPlayer), { guesses: [...player2.guesses, newGuess], discoveredDigits: newDiscoveredDigits }));
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
        }
        else {
            // Switch to other player
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
            setTimeLeft(timeLimit);
        }
    };
    const updatePlayerStats = (player, guess, result) => {
        const now = Date.now();
        const guessTime = player.stats.lastGuessTime ? (now - player.stats.lastGuessTime) / 1000 : 0;
        const correctDigits = (result.match(/\+/g) || []).length;
        return Object.assign(Object.assign({}, player), { stats: {
                guessCount: player.stats.guessCount + 1,
                correctDigits: Math.max(player.stats.correctDigits, correctDigits),
                averageTime: player.stats.guessCount === 0
                    ? guessTime
                    : (player.stats.averageTime * player.stats.guessCount + guessTime) / (player.stats.guessCount + 1),
                lastGuessTime: now,
            } });
    };
    const handlePlayerNumberSubmit = (player, number) => {
        if (player === 1) {
            if (!player1Icon) {
                return; // Don't allow number submission without icon selection
            }
            setPlayer1Number(number);
            setPlayer1(prev => (Object.assign(Object.assign({}, prev), { secretNumber: number })));
        }
        else {
            if (!player2Icon) {
                return; // Don't allow number submission without icon selection
            }
            setPlayer2Number(number);
            setPlayer2(prev => (Object.assign(Object.assign({}, prev), { secretNumber: number })));
            setGameState('PLAYING');
            setGamePhase('playing');
        }
    };
    const renderIconSelection = (player) => (<react_2.VStack spacing={4} w="100%" maxW="400px">
      <react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"} fontWeight="bold">
        Player {player}, Choose Your Icon
      </react_2.Text>
      <react_2.HStack spacing={2} justify="center" wrap="wrap">
        {FRUIT_ICONS.map((fruit, index) => (<react_2.Tooltip key={index} label={fruit} placement="top">
            <react_2.IconButton aria-label={fruit} icon={<react_2.Text fontSize="2xl">{fruit}</react_2.Text>} size="lg" variant={(player === 1 && player1Icon === fruit) ||
                (player === 2 && player2Icon === fruit)
                ? "solid"
                : "outline"} colorScheme={(player === 1 && player1Icon === fruit) ||
                (player === 2 && player2Icon === fruit)
                ? "blue"
                : "gray"} isDisabled={(player === 1 && player2Icon === fruit) ||
                (player === 2 && player1Icon === fruit)} onClick={() => {
                if (player === 1) {
                    setPlayer1Icon(fruit);
                }
                else {
                    setPlayer2Icon(fruit);
                }
            }}/>
          </react_2.Tooltip>))}
      </react_2.HStack>
    </react_2.VStack>);
    const handleSetup = (number, isPlayer1) => {
        if (isPlayer1) {
            setPlayer1(prev => (Object.assign(Object.assign({}, prev), { secretNumber: number })));
        }
        else {
            setPlayer2(prev => (Object.assign(Object.assign({}, prev), { secretNumber: number })));
            setGamePhase('playing');
        }
    };
    const handleNameChange = (player, name) => {
        if (player === 1) {
            setPlayer1Name(name);
            localStorage.setItem('player1Name', name);
            setPlayer1(prev => (Object.assign(Object.assign({}, prev), { name })));
        }
        else {
            setPlayer2Name(name);
            localStorage.setItem('player2Name', name);
            setPlayer2(prev => (Object.assign(Object.assign({}, prev), { name })));
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
    return (<react_2.ChakraProvider>
      <react_2.Box position="relative" minH="100vh" bg="gray.100" py={8} px={4}>
        <react_2.Box position="fixed" top={0} left={0} right={0} bottom={0} pointerEvents="none" zIndex={10}>
          <WinnerConfetti_1.WinnerConfetti isActive={Boolean(winner !== null)} playerIcon={winner === 1 ? player1Icon : player2Icon}/>
        </react_2.Box>
        <react_2.VStack spacing={8} maxW="container.xl" mx="auto">
          <react_2.Heading color="blue.600" fontSize={isMobile ? "2xl" : "4xl"}>
            Number Crunch
          </react_2.Heading>
          
          <ServerInfo_1.default />
          
          {gameState === 'SETUP' ? (<>
              {!player1Number && (<react_2.VStack spacing={4} w="100%" maxW="400px">
                  <react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                    Select Turn Time Limit
                  </react_2.Text>
                  <react_2.Select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} bg="white" size={isMobile ? "md" : "lg"}>
                    {TIME_LIMITS.map(limit => (<option key={limit} value={limit}>
                        {limit} seconds per turn
                      </option>))}
                  </react_2.Select>

                  <react_2.VStack spacing={2} w="100%">
                    <react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      Enter Player 1's Name
                    </react_2.Text>
                    <react_2.Input value={player1Name} onChange={(e) => handleNameChange(1, e.target.value)} placeholder="Player 1's Name" size={isMobile ? "md" : "lg"} bg="white"/>
                  </react_2.VStack>

                  {renderIconSelection(1)}
                  {player1Icon && player1Name && (<react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      {player1Name}, enter your 6-digit number
                    </react_2.Text>)}
                </react_2.VStack>)}
              {player1Number && (<>
                  <react_2.VStack spacing={2} w="100%" maxW="400px">
                    <react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      Enter Player 2's Name
                    </react_2.Text>
                    <react_2.Input value={player2Name} onChange={(e) => handleNameChange(2, e.target.value)} placeholder="Player 2's Name" size={isMobile ? "md" : "lg"} bg="white"/>
                  </react_2.VStack>
                  {renderIconSelection(2)}
                  {player2Icon && player2Name && (<react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"}>
                      {player2Name}, enter your 6-digit number
                    </react_2.Text>)}
                </>)}
              <NumberInput_1.default onSubmit={(number) => handlePlayerNumberSubmit(!player1Number ? 1 : 2, number)} isSetup={true} isDisabled={(!player1Number && (!player1Icon || !player1Name)) || (player1Number && (!player2Icon || !player2Name))}/>
            </>) : (<>
              {gameResult ? (<react_2.VStack spacing={4} w="100%" maxW="600px">
                  <react_2.Heading size={isMobile ? "md" : "lg"} color="green.500">
                    {gameResult === 1 ? player1.name : player2.name} {gameResult === 1 ? player1Icon : player2Icon} Wins!
                  </react_2.Heading>
                  
                  <react_2.Box w="100%" bg="white" p={6} borderRadius="lg" boxShadow="md">
                    <react_2.VStack spacing={4} align="stretch">
                      <react_2.Text fontSize="lg" fontWeight="bold" color="blue.600" textAlign="center">
                        Game Summary
                      </react_2.Text>
                      
                      <react_2.Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <react_2.GridItem>
                          <react_2.VStack align="stretch" spacing={2}>
                            <react_2.Text fontWeight="bold" color="blue.500">
                              {player1.name} {player1Icon}
                            </react_2.Text>
                            <react_2.Box p={3} bg="gray.50" borderRadius="md">
                              <react_2.Text>Secret Number: {player1Number}</react_2.Text>
                              <react_2.Text>Total Guesses: {player1Guesses.length}</react_2.Text>
                            </react_2.Box>
                          </react_2.VStack>
                        </react_2.GridItem>
                        
                        <react_2.GridItem>
                          <react_2.VStack align="stretch" spacing={2}>
                            <react_2.Text fontWeight="bold" color="green.500">
                              {player2.name} {player2Icon}
                            </react_2.Text>
                            <react_2.Box p={3} bg="gray.50" borderRadius="md">
                              <react_2.Text>Secret Number: {player2Number}</react_2.Text>
                              <react_2.Text>Total Guesses: {player2Guesses.length}</react_2.Text>
                            </react_2.Box>
                          </react_2.VStack>
                        </react_2.GridItem>
                      </react_2.Grid>

                      <react_2.Box>
                        <react_2.Text fontWeight="bold" mb={2}>Winning Move:</react_2.Text>
                        <react_2.Box p={3} bg="green.50" borderRadius="md">
                          {gameResult === 1 ? (<react_2.Text>
                              {player1.name} {player1Icon} correctly guessed {player2Number} in {player1Guesses.length} tries
                            </react_2.Text>) : (<react_2.Text>
                              {player2.name} {player2Icon} correctly guessed {player1Number} in {player2Guesses.length} tries
                            </react_2.Text>)}
                        </react_2.Box>
                      </react_2.Box>

                      <react_2.Box>
                        <react_2.Text fontWeight="bold" mb={2}>Game Settings:</react_2.Text>
                        <react_2.Box p={3} bg="blue.50" borderRadius="md">
                          <react_2.Text>Time Limit per Turn: {timeLimit} seconds</react_2.Text>
                          <react_2.Text>Total Game Duration: {Math.floor((Date.now() - ((_a = player1Guesses[0]) === null || _a === void 0 ? void 0 : _a.timestamp) || 0) / 1000)} seconds</react_2.Text>
                        </react_2.Box>
                      </react_2.Box>
                    </react_2.VStack>
                  </react_2.Box>

                  <react_2.Button colorScheme="blue" size={isMobile ? "md" : "lg"} onClick={handleReset} mt={4}>
                    Play Again
                  </react_2.Button>
                </react_2.VStack>) : (<>
                  <react_2.VStack spacing={2} w="100%">
                    <react_2.Text textAlign="center" fontSize={isMobile ? "md" : "lg"} color="blue.600">
                      {currentPlayer === 1 ? player1.name : player2.name} {currentPlayer === 1 ? player1Icon : player2Icon}'s turn to guess
                    </react_2.Text>
                    <react_2.Box w="100%" maxW="400px">
                      <react_2.Progress value={(timeLeft * (100 / timeLimit))} colorScheme={timeLeft <= timeLimit / 3 ? "red" : "blue"} height="8px" borderRadius="full"/>
                      <react_2.Text textAlign="center" fontSize="sm" color={timeLeft <= timeLimit / 3 ? "red.500" : "gray.600"}>
                        {timeLeft} seconds left
                      </react_2.Text>
                    </react_2.Box>
                  </react_2.VStack>
                  <GameBoard_1.default currentPlayer={currentPlayer} onGuess={handleGuess} player1Guesses={player1Guesses} player2Guesses={player2Guesses} player1DiscoveredDigits={player1.discoveredDigits} player2DiscoveredDigits={player2.discoveredDigits} timeLeft={timeLeft} timeLimit={timeLimit} player1Icon={player1Icon} player2Icon={player2Icon} player1Name={player1.name} player2Name={player2.name}/>
                </>)}
            </>)}

          {gamePhase !== 'setup' && (<GameStats_1.GameStats player1={{
                icon: player1.icon,
                guessCount: player1.stats.guessCount,
                correctDigits: player1.stats.correctDigits,
                averageTime: player1.stats.averageTime,
            }} player2={{
                icon: player2.icon,
                guessCount: player2.stats.guessCount,
                correctDigits: player2.stats.correctDigits,
                averageTime: player2.stats.averageTime,
            }}/>)}
        </react_2.VStack>
      </react_2.Box>
    </react_2.ChakraProvider>);
}
exports.default = App;
