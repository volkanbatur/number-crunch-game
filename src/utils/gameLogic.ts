export const calculateHint = (target: string, guess: string): string => {
  const targetArray = target.split('');
  const guessArray = guess.split('');
  const usedTargetPositions = new Array(target.length).fill(false);
  const usedGuessPositions = new Array(guess.length).fill(false);
  let result = '';

  // First pass: Check for exact matches
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === targetArray[i]) {
      result += '+';
      usedTargetPositions[i] = true;
      usedGuessPositions[i] = true;
    }
  }

  // Second pass: Check for correct digits in wrong positions
  for (let i = 0; i < guessArray.length; i++) {
    if (usedGuessPositions[i]) continue;
    
    for (let j = 0; j < targetArray.length; j++) {
      if (!usedTargetPositions[j] && guessArray[i] === targetArray[j]) {
        result += '-';
        usedTargetPositions[j] = true;
        usedGuessPositions[i] = true;
        break;
      }
    }
  }

  return result;
};

export const generateRandomNumber = (): string => {
  const digits = Array.from({ length: 10 }, (_, i) => i.toString());
  let result = '';
  
  // First digit shouldn't be 0
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  result += firstDigit;
  digits.splice(firstDigit, 1);
  
  // Generate remaining digits
  for (let i = 1; i < 6; i++) {
    const index = Math.floor(Math.random() * digits.length);
    result += digits[index];
    digits.splice(index, 1);
  }
  
  return result;
}; 