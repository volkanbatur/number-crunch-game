"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStats = void 0;
const react_1 = __importDefault(require("react"));
const react_2 = require("@chakra-ui/react");
const GameStats = ({ player1, player2 }) => {
    return (<react_2.Box w="100%" maxW="600px" bg="white" p={3} borderRadius="md" boxShadow="sm">
      <react_2.Grid templateColumns="repeat(2, 1fr)" gap={3}>
        <react_2.GridItem>
          <react_2.VStack align="start" spacing={1}>
            <react_2.Text fontSize="sm" fontWeight="bold" color="blue.600">
              {player1.icon} Player 1
            </react_2.Text>
            <react_2.Text fontSize="xs">Guesses: {player1.guessCount}</react_2.Text>
            <react_2.Text fontSize="xs">Found Digits: {player1.correctDigits}</react_2.Text>
            <react_2.Text fontSize="xs">Avg Time: {player1.averageTime.toFixed(1)}s</react_2.Text>
          </react_2.VStack>
        </react_2.GridItem>
        <react_2.GridItem>
          <react_2.VStack align="start" spacing={1}>
            <react_2.Text fontSize="sm" fontWeight="bold" color="green.600">
              {player2.icon} Player 2
            </react_2.Text>
            <react_2.Text fontSize="xs">Guesses: {player2.guessCount}</react_2.Text>
            <react_2.Text fontSize="xs">Found Digits: {player2.correctDigits}</react_2.Text>
            <react_2.Text fontSize="xs">Avg Time: {player2.averageTime.toFixed(1)}s</react_2.Text>
          </react_2.VStack>
        </react_2.GridItem>
      </react_2.Grid>
    </react_2.Box>);
};
exports.GameStats = GameStats;
exports.default = exports.GameStats;
