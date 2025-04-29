import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  VStack,
  Text,
  Progress,
  useToast,
} from '@chakra-ui/react';

interface NumberInputProps {
  onSubmit: (value: string) => void;
  isSetup?: boolean;
  timeLeft?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  onSubmit,
  isSetup = false,
  timeLeft = 30,
}) => {
  const [value, setValue] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (value.length !== 6 || !/^\d+$/.test(value)) {
      toast({
        title: 'Invalid input',
        description: 'Please enter exactly 6 digits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
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
      return;
    }

    onSubmit(value);
    setValue('');
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%">
      {!isSetup && (
        <>
          <Progress
            value={(timeLeft / 30) * 100}
            w="100%"
            colorScheme={timeLeft <= 5 ? "red" : timeLeft <= 10 ? "yellow" : "green"}
            size="sm"
            borderRadius="full"
          />
          <Text color={timeLeft <= 5 ? "red.500" : "gray.600"} fontWeight="bold">
            Time left: {timeLeft}s
          </Text>
        </>
      )}
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isSetup ? "Enter target number" : "Enter your guess"}
        maxLength={6}
        pattern="\d*"
        inputMode="numeric"
        autoFocus
      />
      <Button
        type="submit"
        colorScheme="blue"
        isDisabled={value.length !== 6 || !/^\d+$/.test(value)}
        w="100%"
      >
        {isSetup ? "Start Game" : "Submit Guess"}
      </Button>
    </VStack>
  );
};

export default NumberInput; 