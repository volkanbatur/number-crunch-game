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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const qrcode_1 = __importDefault(require("qrcode"));
const ServerInfo = () => {
    const [qrCode, setQrCode] = (0, react_1.useState)('');
    const [localUrl, setLocalUrl] = (0, react_1.useState)('');
    const toast = (0, react_2.useToast)();
    (0, react_1.useEffect)(() => {
        const getLocalIpUrl = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const hostname = window.location.hostname;
                const port = window.location.port;
                const protocol = window.location.protocol;
                const url = `${protocol}//${hostname}:${port}`;
                setLocalUrl(url);
                const qr = yield qrcode_1.default.toDataURL(url);
                setQrCode(qr);
            }
            catch (error) {
                toast({
                    title: 'Error generating QR code',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        });
        getLocalIpUrl();
    }, [toast]);
    return (<react_2.VStack spacing={4} p={4} bg="white" borderRadius="lg" shadow="md">
      <react_2.Text fontSize="lg" fontWeight="bold">
        Play with Friends
      </react_2.Text>
      <react_2.Text fontSize="sm" color="gray.600" textAlign="center">
        Connect to the same WiFi network and scan this QR code or visit:
      </react_2.Text>
      <react_2.Text fontSize="md" fontWeight="semibold" color="blue.500">
        {localUrl}
      </react_2.Text>
      {qrCode && (<react_2.Box p={4} bg="white" borderRadius="md">
          <img src={qrCode} alt="QR Code" style={{ maxWidth: '200px' }}/>
        </react_2.Box>)}
    </react_2.VStack>);
};
exports.default = ServerInfo;
