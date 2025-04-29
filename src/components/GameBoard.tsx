import React from 'react';
import { Box, VStack, Grid, Text, useToast, Flex } from '@chakra-ui/react';
import NumberInput from './NumberInput';
import { motion, AnimatePresence } from "framer-motion";
import useSound from 'use-sound';

interface GuessData {
  guess: string;
  result: string;
  positions: boolean[];
  timestamp: number;
}

interface GameBoardProps {
  player1Guesses: GuessData[];
  player2Guesses: GuessData[];
  currentPlayer: 1 | 2;
  onGuess: (guess: string) => void;
  player1Icon: string;
  player2Icon: string;
  player1Name: string;
  player2Name: string;
  player1DiscoveredDigits: string[];
  player2DiscoveredDigits: string[];
  timeLeft: number;
  timeLimit: number;
}

// Import sound effects
const correctSound = new URL('../assets/sounds/correct.mp3', import.meta.url).href;
const wrongSound = new URL('../assets/sounds/wrong.mp3', import.meta.url).href;
const winSound = new URL('../assets/sounds/win.mp3', import.meta.url).href;
const tickSound = new URL('../assets/sounds/tick.mp3', import.meta.url).href;

export function GameBoard({
  player1Guesses,
  player2Guesses,
  currentPlayer,
  onGuess,
  player1Icon,
  player2Icon,
  player1Name,
  player2Name,
  player1DiscoveredDigits,
  player2DiscoveredDigits,
  timeLeft,
  timeLimit
}: GameBoardProps) {
  const toast = useToast();
  
  // Initialize sound effects
  const [playCorrect] = useSound(correctSound, { volume: 0.5 });
  const [playWrong] = useSound(wrongSound, { volume: 0.3 });
  const [playWin] = useSound(winSound, { volume: 0.6 });
  const [playTick] = useSound(tickSound, { volume: 0.2 });

  // Play tick sound on player switch
  React.useEffect(() => {
    playTick();
  }, [currentPlayer, playTick]);

  const handleGuess = (guess: string) => {
    onGuess(guess);
    // Play appropriate sound based on the guess result
    const currentGuesses = currentPlayer === 1 ? player1Guesses : player2Guesses;
    const lastGuess = currentGuesses[currentGuesses.length - 1];
    
    if (lastGuess?.result === '++++++') {
      playWin();
    } else if (lastGuess?.result.includes('+')) {
      playCorrect();
    } else {
      playWrong();
    }
  };

  const formatResult = (result: string) => {
    return result.split('').map((char, i) => (
      <Text
        key={i}
        as="span"
        color={char === '+' ? "green.500" : "orange.500"}
        fontWeight="bold"
        mx="1px"
      >
        {char}
      </Text>
    ));
  };

  const renderGuessHistory = (
    guesses: GuessData[],
    discoveredDigits: string[],
    playerIcon: string
  ) => {
    return guesses.map((guessData, index) => {
      const isCorrect = guessData.result === '++++++';
      
      return (
        <AnimatePresence key={index} mode="wait">
          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            p={3}
            bg={isCorrect ? "green.100" : "gray.50"}
            borderRadius="md"
            mb={2}
            boxShadow="sm"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Flex alignItems="center" gap={3}>
              <Text fontSize="xl">{playerIcon}</Text>
              <Text fontFamily="monospace" fontSize="lg" flex="1">
                {guessData.guess.split('').map((digit, i) => {
                  // A digit should be highlighted if:
                  // 1. It's in the correct position in this guess (positions[i] is true)
                  // 2. It was previously discovered and is being used in the correct position
                  const wasDiscovered = discoveredDigits.includes(digit);
                  const isCorrectPosition = guessData.positions[i];
                  const shouldHighlight = isCorrectPosition;

                  return (
                    <Box
                      key={i}
                      as={motion.span}
                      display="inline-block"
                      color={shouldHighlight ? "green.500" : "inherit"}
                      fontWeight={shouldHighlight ? "bold" : "normal"}
                      whileHover={{ scale: 1.2 }}
                      mx="1px"
                    >
                      {digit}
                    </Box>
                  );
                })}
              </Text>
              <Flex alignItems="center" minWidth="80px" justifyContent="flex-end">
                {formatResult(guessData.result)}
              </Flex>
            </Flex>
          </Box>
        </AnimatePresence>
      );
    });
  };

  return (
    <Box w="100%" maxW="1200px" mx="auto" p={4}>
      <Grid
        templateColumns={["1fr", "1fr", "repeat(2, 1fr)"]}
        gap={8}
        mb={4}
      >
        <Box
          p={4}
          bg="blue.50"
          borderRadius="lg"
          borderWidth={currentPlayer === 1 ? "2px" : "1px"}
          borderColor={currentPlayer === 1 ? "blue.500" : "transparent"}
          transition="all 0.2s"
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={2}>
              {player1Icon} {player1Name}'s Guesses
            </Text>
            {renderGuessHistory(player1Guesses, player1DiscoveredDigits, player1Icon)}
            {currentPlayer === 1 && (
              <Box
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NumberInput
                  onSubmit={handleGuess}
                  isSetup={false}
                  isCompact={true}
                  timeLeft={timeLeft}
                  timeLimit={timeLimit}
                />
              </Box>
            )}
          </VStack>
        </Box>
        <Box
          p={4}
          bg="green.50"
          borderRadius="lg"
          borderWidth={currentPlayer === 2 ? "2px" : "1px"}
          borderColor={currentPlayer === 2 ? "green.500" : "transparent"}
          transition="all 0.2s"
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="bold" color="green.600" mb={2}>
              {player2Icon} {player2Name}'s Guesses
            </Text>
            {renderGuessHistory(player2Guesses, player2DiscoveredDigits, player2Icon)}
            {currentPlayer === 2 && (
              <Box
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NumberInput
                  onSubmit={handleGuess}
                  isSetup={false}
                  isCompact={true}
                  timeLeft={timeLeft}
                  timeLimit={timeLimit}
                />
              </Box>
            )}
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}

export default GameBoard; 