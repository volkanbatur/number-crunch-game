"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinnerConfetti = WinnerConfetti;
const react_1 = __importDefault(require("react"));
const react_confetti_1 = __importDefault(require("react-confetti"));
const react_use_1 = require("react-use");
const react_2 = require("@chakra-ui/react");
const react_3 = require("@emotion/react");
const fallAnimation = (0, react_3.keyframes) `
  0% { transform: translateY(-100vh) scale(2); }
  100% { transform: translateY(100vh) scale(2); }
`;
function WinnerConfetti({ isActive, playerIcon }) {
    const { width, height } = (0, react_use_1.useWindowSize)();
    return (<>
      {isActive && (<>
          <react_confetti_1.default width={width} height={height} numberOfPieces={200} recycle={true} gravity={0.3} initialVelocityY={10} tweenDuration={5000} confettiSource={{
                x: 0,
                y: 0,
                w: width,
                h: 0
            }} colors={['#FF6B6B', '#4EC5D5', '#FFE66D', '#4CD964', '#FF9500']} drawShape={ctx => {
                ctx.scale(2, 2);
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, 2 * Math.PI);
                ctx.fill();
            }}/>
          <react_2.Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1000} pointerEvents="none">
            <react_2.Text fontSize="8xl" animation={`${fallAnimation} 2s infinite`} textAlign="center" style={{ animationDelay: '0.5s' }}>
              {playerIcon}
            </react_2.Text>
          </react_2.Box>
        </>)}
    </>);
}
exports.default = WinnerConfetti;
