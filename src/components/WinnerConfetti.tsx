import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Box, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

interface WinnerConfettiProps {
  isActive: boolean;
  playerIcon: string;
}

const fallAnimation = keyframes`
  0% { transform: translateY(-100vh) scale(2); }
  100% { transform: translateY(100vh) scale(2); }
`;

export const WinnerConfetti: React.FC<WinnerConfettiProps> = ({ isActive, playerIcon }) => {
  const { width, height } = useWindowSize();

  if (!isActive) return null;

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={true}
        gravity={0.3}
        initialVelocityY={10}
        tweenDuration={5000}
        confettiSource={{
          x: 0,
          y: 0,
          w: width,
          h: 0
        }}
        colors={['#FF6B6B', '#4EC5D5', '#FFE66D', '#4CD964', '#FF9500']}
        drawShape={ctx => {
          ctx.scale(2, 2);
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, 2 * Math.PI);
          ctx.fill();
        }}
      />
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        pointerEvents="none"
        zIndex={10}
      >
        <Text
          fontSize="8xl"
          textAlign="center"
          mt="20vh"
          as={motion.div}
          animation="fall 2s ease-in-out infinite"
        >
          {playerIcon}
        </Text>
      </Box>
    </>
  );
};

export default WinnerConfetti;