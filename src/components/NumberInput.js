"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const NumberInput = ({ onSubmit, isSetup = false, timeLeft = 30, timeLimit = 30, isDisabled = false, isCompact = false, }) => {
    const [value, setValue] = (0, react_1.useState)('');
    const toast = (0, react_2.useToast)();
    const handleSubmit = (e) => {
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
        return (<react_2.VStack as="form" onSubmit={handleSubmit} spacing={2} w="100%">
        <react_2.Progress value={(timeLeft / timeLimit) * 100} w="100%" colorScheme={timeLeft <= timeLimit / 3 ? "red" : timeLeft <= timeLimit / 2 ? "yellow" : "green"} size="xs" borderRadius="full"/>
        <react_2.HStack w="100%" spacing={2}>
          <react_2.Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter guess" maxLength={6} pattern="\d*" inputMode="numeric" autoFocus isDisabled={isDisabled} size="sm"/>
          <react_2.Button type="submit" colorScheme="blue" isDisabled={isDisabled || value.length !== 6 || !/^\d+$/.test(value)} size="sm" flexShrink={0}>
            Submit
          </react_2.Button>
        </react_2.HStack>
        <react_2.Text fontSize="xs" color={timeLeft <= timeLimit / 3 ? "red.500" : "gray.600"} alignSelf="flex-end">
          {timeLeft}s
        </react_2.Text>
      </react_2.VStack>);
    }
    return (<react_2.VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%">
      {!isSetup && (<>
          <react_2.Progress value={(timeLeft / timeLimit) * 100} w="100%" colorScheme={timeLeft <= timeLimit / 3 ? "red" : timeLeft <= timeLimit / 2 ? "yellow" : "green"} size="sm" borderRadius="full"/>
          <react_2.Text color={timeLeft <= timeLimit / 3 ? "red.500" : "gray.600"} fontWeight="bold">
            Time left: {timeLeft}s
          </react_2.Text>
        </>)}
      <react_2.Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={isSetup ? "Enter target number" : "Enter your guess"} maxLength={6} pattern="\d*" inputMode="numeric" autoFocus isDisabled={isDisabled}/>
      <react_2.Button type="submit" colorScheme="blue" isDisabled={isDisabled || value.length !== 6 || !/^\d+$/.test(value)} w="100%">
        {isSetup ? "Start Game" : "Submit Guess"}
      </react_2.Button>
    </react_2.VStack>);
};
exports.default = NumberInput;
