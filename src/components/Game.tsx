import { useState, useEffect, useCallback } from 'react';
import { VStack, Text, Button, useToast, Container, Heading } from '@chakra-ui/react';
import { NumberInput } from './NumberInput';
import { calculateHint } from '../utils/gameLogic';
import { GameState } from '../types';

const INITIAL_TIME = 30;

export function Game() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [targetNumber, setTargetNumber] = useState('');
  const [attempts, setAttempts] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const toast = useToast();

  const resetGame = () => {
    setGameState('setup');
    setTargetNumber('');
    setAttempts([]);
    setHints([]);
    setTimeLeft(INITIAL_TIME);
  };

  const validateNumber = (value: string): boolean => {
    if (value.length !== 6 || !/^\d+$/.test(value)) {
      toast({
        title: 'Invalid input',
        description: 'Please enter exactly 6 digits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check for duplicate digits
    if (new Set(value.split('')).size !== 6) {
      toast({
        title: 'Invalid input',
        description: 'All digits must be different',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleSetup = (value: string) => {
    if (!validateNumber(value)) return;
    setTargetNumber(value);
    setGameState('playing');
    setTimeLeft(INITIAL_TIME);
  };

  const handleGuess = (value: string) => {
    if (!validateNumber(value)) return;
    
    const hint = calculateHint(targetNumber, value);
    setAttempts(prev => [...prev, value]);
    setHints(prev => [...prev, hint]);

    if (hint === '🎯🎯🎯🎯🎯🎯') {
      setGameState('won');
      toast({
        title: 'Congratulations!',
        description: 'You won the game!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const renderGameContent = () => {
    switch (gameState) {
      case 'setup':
        return (
          <>
            <Text fontSize="lg" mb={4}>
              Enter a 6-digit target number. Each digit should be different.
            </Text>
            <NumberInput
              onSubmit={handleSetup}
              timeLeft={INITIAL_TIME}
              timeLimit={INITIAL_TIME}
            />
          </>
        );
      case 'playing':
        return (
          <>
            <NumberInput
              onSubmit={handleGuess}
              timeLeft={timeLeft}
              timeLimit={INITIAL_TIME}
            />
            {attempts.map((attempt, index) => (
              <Text key={index} fontSize="lg">
                {attempt} - {hints[index]}
              </Text>
            ))}
          </>
        );
      case 'won':
        return (
          <>
            <Heading size="lg" color="green.500" mb={4}>
              Congratulations! You won! 🎉
            </Heading>
            <Text fontSize="lg" mb={4}>
              You found the number: {targetNumber}
            </Text>
            <Text fontSize="lg" mb={4}>
              Attempts: {attempts.length}
            </Text>
            <Button onClick={resetGame} colorScheme="blue">
              Play Again
            </Button>
          </>
        );
      case 'lost':
        return (
          <>
            <Heading size="lg" color="red.500" mb={4}>
              Time's up! Game Over
            </Heading>
            <Text fontSize="lg" mb={4}>
              The target number was: {targetNumber}
            </Text>
            <Button onClick={resetGame} colorScheme="blue">
              Try Again
            </Button>
          </>
        );
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={6} align="stretch">
        {renderGameContent()}
      </VStack>
    </Container>
  );
} 