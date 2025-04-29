// Generate a valid 6-digit number with unique digits
export const generateBotNumber = (): string => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    result += digits[randomIndex];
    digits.splice(randomIndex, 1);
  }
  return result;
};

// Bot's memory of previous guesses and their results
interface BotMemory {
  guesses: string[];
  results: string[];
  possibleDigits: Set<string>[];
  confirmedPositions: Map<number, string>;
}

const botMemory: BotMemory = {
  guesses: [],
  results: [],
  possibleDigits: Array(6).fill(null).map(() => new Set(['1','2','3','4','5','6','7','8','9'])),
  confirmedPositions: new Map()
};

// Update bot's memory based on guess result
const updateBotMemory = (guess: string, result: string) => {
  botMemory.guesses.push(guess);
  botMemory.results.push(result);

  const guessDigits = guess.split('');
  const resultArray = result.split('');

  // Update confirmed positions
  resultArray.forEach((r, i) => {
    if (r === '+') {
      botMemory.confirmedPositions.set(i, guessDigits[i]);
      // Remove this digit from all other possible positions
      botMemory.possibleDigits.forEach((pos, index) => {
        if (index !== i) {
          pos.delete(guessDigits[i]);
        }
      });
    } else if (r === '-') {
      // Remove digit from current position but keep it as possible for other positions
      botMemory.possibleDigits[i].delete(guessDigits[i]);
    } else {
      // Remove digit from all positions if it's not in the number
      botMemory.possibleDigits.forEach(pos => pos.delete(guessDigits[i]));
    }
  });
};

// Generate bot's next guess based on previous results
export const generateBotGuess = (previousGuess?: string, previousResult?: string): string => {
  if (previousGuess && previousResult) {
    updateBotMemory(previousGuess, previousResult);
  }

  let guess = '';
  const usedDigits = new Set<string>();

  // First, use confirmed positions
  const tempGuess = Array(6).fill('');
  botMemory.confirmedPositions.forEach((digit, pos) => {
    tempGuess[pos] = digit;
    usedDigits.add(digit);
  });

  // Fill remaining positions
  for (let i = 0; i < 6; i++) {
    if (!tempGuess[i]) {
      const availableDigits = Array.from(botMemory.possibleDigits[i])
        .filter(d => !usedDigits.has(d));
      
      if (availableDigits.length > 0) {
        const digit = availableDigits[Math.floor(Math.random() * availableDigits.length)];
        tempGuess[i] = digit;
        usedDigits.add(digit);
      } else {
        // Fallback: use any unused digit
        const unusedDigits = ['1','2','3','4','5','6','7','8','9']
          .filter(d => !usedDigits.has(d));
        const digit = unusedDigits[Math.floor(Math.random() * unusedDigits.length)];
        tempGuess[i] = digit;
        usedDigits.add(digit);
      }
    }
  }

  guess = tempGuess.join('');
  return guess;
}; 