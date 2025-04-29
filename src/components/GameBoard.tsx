import React from 'react';
import { Box, VStack, Grid, GridItem, Text, useMediaQuery } from '@chakra-ui/react';
import NumberInput from './NumberInput';

interface GuessHistory {
  guess: string;
  result: string;
  timestamp: number;
  discoveredPositions: { [position: number]: string };
}

interface GameBoardProps {
  currentPlayer: 1 | 2;
  onGuess: (guess: string) => void;
  player1Guesses: GuessHistory[];
  player2Guesses: GuessHistory[];
  player1DiscoveredDigits: { [position: number]: string };
  player2DiscoveredDigits: { [position: number]: string };
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentPlayer,
  onGuess,
  player1Guesses,
  player2Guesses,
  player1DiscoveredDigits,
  player2DiscoveredDigits,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const renderGuessHistory = (guesses: GuessHistory[], playerNumber: number) => (
    <VStack spacing={2} align="stretch" w="100%">
      <Text fontWeight="bold" color={`${playerNumber === 1 ? 'blue' : 'green'}.600`}>
        Player {playerNumber}'s Guesses
      </Text>
      {guesses.map((guess, index) => (
        <Grid
          key={index}
          templateColumns="1fr auto"
          gap={4}
          p={2}
          bg="white"
          borderRadius="md"
          boxShadow="sm"
        >
          <GridItem>
            <Text fontSize={isMobile ? "sm" : "md"}>
              {guess.guess.split('').map((digit, i) => (
                <Text
                  key={i}
                  as="span"
                  color={
                    playerNumber === 1
                      ? player1DiscoveredDigits[i] === digit
                        ? 'green.500'
                        : 'inherit'
                      : player2DiscoveredDigits[i] === digit
                      ? 'green.500'
                      : 'inherit'
                  }
                  fontWeight={
                    (playerNumber === 1 && player1DiscoveredDigits[i] === digit) ||
                    (playerNumber === 2 && player2DiscoveredDigits[i] === digit)
                      ? 'bold'
                      : 'normal'
                  }
                >
                  {digit}
                </Text>
              ))}
            </Text>
          </GridItem>
          <GridItem>
            <Text fontSize={isMobile ? "sm" : "md"} color="gray.600">
              {guess.result}
            </Text>
          </GridItem>
        </Grid>
      ))}
    </VStack>
  );

  return (
    <Box w="100%" maxW="container.lg">
      <Grid
        templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
        gap={8}
        w="100%"
        mb={8}
      >
        <GridItem>
          {renderGuessHistory(player1Guesses, 1)}
        </GridItem>
        <GridItem>
          {renderGuessHistory(player2Guesses, 2)}
        </GridItem>
      </Grid>
      {currentPlayer && (
        <Box mt={4}>
          <NumberInput onSubmit={onGuess} isSetup={false} />
        </Box>
      )}
    </Box>
  );
};

export default GameBoard; 