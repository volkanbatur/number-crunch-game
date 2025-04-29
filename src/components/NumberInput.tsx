import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  VStack,
  Text,
  Progress,
  useToast,
  HStack,
} from '@chakra-ui/react';

interface NumberInputProps {
  onSubmit: (value: string) => void;
  isSetup?: boolean;
  timeLeft?: number;
  timeLimit?: number;
  isDisabled?: boolean;
  isCompact?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  onSubmit,
  isSetup = false,
  timeLeft = 30,
  timeLimit = 30,
  isDisabled = false,
  isCompact = false,
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

  if (isCompact) {
    return (
      <VStack as="form" onSubmit={handleSubmit} spacing={2} w="100%">
        <Progress
          value={(timeLeft / timeLimit) * 100}
          w="100%"
          colorScheme={timeLeft <= timeLimit/3 ? "red" : timeLeft <= timeLimit/2 ? "yellow" : "green"}
          size="xs"
          borderRadius="full"
        />
        <HStack w="100%" spacing={2}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter guess"
            maxLength={6}
            pattern="\d*"
            inputMode="numeric"
            autoFocus
            isDisabled={isDisabled}
            size="sm"
          />
          <Button
            type="submit"
            colorScheme="blue"
            isDisabled={isDisabled || value.length !== 6 || !/^\d+$/.test(value)}
            size="sm"
            flexShrink={0}
          >
            Submit
          </Button>
        </HStack>
        <Text fontSize="xs" color={timeLeft <= timeLimit/3 ? "red.500" : "gray.600"} alignSelf="flex-end">
          {timeLeft}s
        </Text>
      </VStack>
    );
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%">
      {!isSetup && (
        <>
          <Progress
            value={(timeLeft / timeLimit) * 100}
            w="100%"
            colorScheme={timeLeft <= timeLimit/3 ? "red" : timeLeft <= timeLimit/2 ? "yellow" : "green"}
            size="sm"
            borderRadius="full"
          />
          <Text color={timeLeft <= timeLimit/3 ? "red.500" : "gray.600"} fontWeight="bold">
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
        isDisabled={isDisabled}
      />
      <Button
        type="submit"
        colorScheme="blue"
        isDisabled={isDisabled || value.length !== 6 || !/^\d+$/.test(value)}
        w="100%"
      >
        {isSetup ? "Start Game" : "Submit Guess"}
      </Button>
    </VStack>
  );
};

export default NumberInput; 