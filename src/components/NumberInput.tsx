import React, { useState } from 'react';
import {
  Input,
  Button,
  VStack,
  Text,
  Progress,
  HStack,
} from '@chakra-ui/react';

interface NumberInputProps {
  onSubmit: (value: string) => void;
  isDisabled?: boolean;
  isCompact?: boolean;
  timeLeft: number;
  timeLimit: number;
}

export function NumberInput({ onSubmit, isDisabled = false, isCompact = false, timeLeft, timeLimit }: NumberInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && !isDisabled) {
      onSubmit(value);
      setValue('');
    }
  };

  if (isCompact) {
    return (
      <VStack as="form" onSubmit={handleSubmit} spacing={2} w="100%">
        <Progress
          value={(timeLeft / timeLimit) * 100}
          size="xs"
          colorScheme={timeLeft <= timeLimit/3 ? "red" : "blue"}
          w="100%"
          borderRadius="full"
        />
        <HStack w="100%" spacing={2}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter number..."
            type="number"
            isDisabled={isDisabled}
            bg="white"
            size="sm"
          />
          <Button
            type="submit"
            colorScheme="blue"
            isDisabled={!value || isDisabled}
            size="sm"
            flexShrink={0}
          >
            Submit
          </Button>
        </HStack>
        <Text 
          fontSize="xs" 
          color={timeLeft <= timeLimit/3 ? "red.500" : "gray.600"} 
          alignSelf="flex-end"
        >
          {timeLeft}s
        </Text>
      </VStack>
    );
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%">
      {timeLimit > 0 && (
        <>
          <Progress
            value={(timeLeft / timeLimit) * 100}
            colorScheme={timeLeft <= timeLimit/3 ? "red" : "blue"}
            w="100%"
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
        placeholder="Enter your guess..."
        type="number"
        size="lg"
        bg="white"
        isDisabled={isDisabled}
      />
      <Button
        type="submit"
        colorScheme="blue"
        isDisabled={!value || isDisabled}
        w="100%"
      >
        Submit Guess
      </Button>
    </VStack>
  );
} 