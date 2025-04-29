"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameBoard = GameBoard;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const NumberInput_1 = __importDefault(require("./NumberInput"));
const framer_motion_1 = require("framer-motion");
const use_sound_1 = __importDefault(require("use-sound"));
// Import sound effects
const correctSound = new URL('../assets/sounds/correct.mp3', import.meta.url).href;
const wrongSound = new URL('../assets/sounds/wrong.mp3', import.meta.url).href;
const winSound = new URL('../assets/sounds/win.mp3', import.meta.url).href;
const tickSound = new URL('../assets/sounds/tick.mp3', import.meta.url).href;
function GameBoard({ player1Guesses, player2Guesses, currentPlayer, onGuess, player1Icon, player2Icon, player1Name, player2Name, player1DiscoveredDigits, player2DiscoveredDigits, timeLeft, timeLimit }) {
    const toast = (0, react_2.useToast)();
    // Initialize sound effects
    const [playCorrect] = (0, use_sound_1.default)(correctSound, { volume: 0.5 });
    const [playWrong] = (0, use_sound_1.default)(wrongSound, { volume: 0.3 });
    const [playWin] = (0, use_sound_1.default)(winSound, { volume: 0.6 });
    const [playTick] = (0, use_sound_1.default)(tickSound, { volume: 0.2 });
    // Play tick sound on player switch
    react_1.default.useEffect(() => {
        playTick();
    }, [currentPlayer, playTick]);
    const handleGuess = (guess) => {
        onGuess(guess);
        // Play appropriate sound based on the guess result
        const currentGuesses = currentPlayer === 1 ? player1Guesses : player2Guesses;
        const lastGuess = currentGuesses[currentGuesses.length - 1];
        if ((lastGuess === null || lastGuess === void 0 ? void 0 : lastGuess.result) === '++++++') {
            playWin();
        }
        else if (lastGuess === null || lastGuess === void 0 ? void 0 : lastGuess.result.includes('+')) {
            playCorrect();
        }
        else {
            playWrong();
        }
    };
    const formatResult = (result) => {
        return result.split('').map((char, i) => (<react_2.Text key={i} as="span" color={char === '+' ? "green.500" : "orange.500"} fontWeight="bold" mx="1px">
        {char}
      </react_2.Text>));
    };
    const renderGuessHistory = (guesses, discoveredDigits, playerIcon) => {
        return guesses.map((guessData, index) => {
            const isCorrect = guessData.result === '++++++';
            return (<framer_motion_1.AnimatePresence key={index} mode="wait">
          <react_2.Box as={framer_motion_1.motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} p={3} bg={isCorrect ? "green.100" : "gray.50"} borderRadius="md" mb={2} boxShadow="sm" _hover={{ transform: "translateY(-2px)" }} transition="all 0.2s">
            <react_2.Flex alignItems="center" gap={3}>
              <react_2.Text fontSize="xl">{playerIcon}</react_2.Text>
              <react_2.Text fontFamily="monospace" fontSize="lg" flex="1">
                {guessData.guess.split('').map((digit, i) => {
                    // A digit should be highlighted if:
                    // 1. It's in the correct position in this guess (positions[i] is true)
                    // 2. It was previously discovered and is being used in the correct position
                    const wasDiscovered = discoveredDigits.includes(digit);
                    const isCorrectPosition = guessData.positions[i];
                    const shouldHighlight = isCorrectPosition;
                    return (<react_2.Box key={i} as={framer_motion_1.motion.span} display="inline-block" color={shouldHighlight ? "green.500" : "inherit"} fontWeight={shouldHighlight ? "bold" : "normal"} whileHover={{ scale: 1.2 }} mx="1px">
                      {digit}
                    </react_2.Box>);
                })}
              </react_2.Text>
              <react_2.Flex alignItems="center" minWidth="80px" justifyContent="flex-end">
                {formatResult(guessData.result)}
              </react_2.Flex>
            </react_2.Flex>
          </react_2.Box>
        </framer_motion_1.AnimatePresence>);
        });
    };
    return (<react_2.Box w="100%" maxW="1200px" mx="auto" p={4}>
      <react_2.Grid templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]} gap={8} mb={4}>
        <react_2.Box p={4} bg="blue.50" borderRadius="lg" borderWidth={currentPlayer === 1 ? "2px" : "1px"} borderColor={currentPlayer === 1 ? "blue.500" : "transparent"} transition="all 0.2s">
          <react_2.VStack spacing={4} align="stretch">
            <react_2.Text fontSize="lg" fontWeight="bold" color="blue.600" mb={2}>
              {player1Icon} {player1Name}'s Guesses
            </react_2.Text>
            {renderGuessHistory(player1Guesses, player1DiscoveredDigits, player1Icon)}
            {currentPlayer === 1 && (<react_2.Box as={framer_motion_1.motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <NumberInput_1.default onSubmit={handleGuess} isSetup={false} isCompact={true} timeLeft={timeLeft} timeLimit={timeLimit}/>
              </react_2.Box>)}
          </react_2.VStack>
        </react_2.Box>
        <react_2.Box p={4} bg="green.50" borderRadius="lg" borderWidth={currentPlayer === 2 ? "2px" : "1px"} borderColor={currentPlayer === 2 ? "green.500" : "transparent"} transition="all 0.2s">
          <react_2.VStack spacing={4} align="stretch">
            <react_2.Text fontSize="lg" fontWeight="bold" color="green.600" mb={2}>
              {player2Icon} {player2Name}'s Guesses
            </react_2.Text>
            {renderGuessHistory(player2Guesses, player2DiscoveredDigits, player2Icon)}
            {currentPlayer === 2 && (<react_2.Box as={framer_motion_1.motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <NumberInput_1.default onSubmit={handleGuess} isSetup={false} isCompact={true} timeLeft={timeLeft} timeLimit={timeLimit}/>
              </react_2.Box>)}
          </react_2.VStack>
        </react_2.Box>
      </react_2.Grid>
    </react_2.Box>);
}
exports.default = GameBoard;
