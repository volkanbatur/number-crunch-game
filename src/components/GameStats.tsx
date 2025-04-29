import React from 'react';
import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react';

interface PlayerStats {
  icon: string;
  guessCount: number;
  correctDigits: number;
  averageTime: number;
}

interface GameStatsProps {
  player1: PlayerStats;
  player2: PlayerStats;
}

export const GameStats: React.FC<GameStatsProps> = ({ player1, player2 }) => {
  return (
    <Box 
      w="100%" 
      maxW="600px" 
      bg="white" 
      p={3} 
      borderRadius="md" 
      boxShadow="sm"
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        <GridItem>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold" color="blue.600">
              {player1.icon} Player 1
            </Text>
            <Text fontSize="xs">Guesses: {player1.guessCount}</Text>
            <Text fontSize="xs">Found Digits: {player1.correctDigits}</Text>
            <Text fontSize="xs">Avg Time: {player1.averageTime.toFixed(1)}s</Text>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              {player2.icon} Player 2
            </Text>
            <Text fontSize="xs">Guesses: {player2.guessCount}</Text>
            <Text fontSize="xs">Found Digits: {player2.correctDigits}</Text>
            <Text fontSize="xs">Avg Time: {player2.averageTime.toFixed(1)}s</Text>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default GameStats; 