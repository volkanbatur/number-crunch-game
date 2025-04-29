declare module 'react-confetti' {
  import { FC } from 'react';

  interface ConfettiProps {
    width?: number;
    height?: number;
    numberOfPieces?: number;
    recycle?: boolean;
    gravity?: number;
    initialVelocityY?: number;
    tweenDuration?: number;
    confettiSource?: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    colors?: string[];
    drawShape?: (ctx: CanvasRenderingContext2D) => void;
  }

  const Confetti: FC<ConfettiProps>;
  export default Confetti;
} 