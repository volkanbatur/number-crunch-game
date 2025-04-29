import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, useToast } from '@chakra-ui/react';
import QRCode from 'qrcode';

const ServerInfo: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [localUrl, setLocalUrl] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const getLocalIpUrl = async () => {
      try {
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        const url = `${protocol}//${hostname}:${port}`;
        setLocalUrl(url);
        
        const qr = await QRCode.toDataURL(url);
        setQrCode(qr);
      } catch (error) {
        toast({
          title: 'Error generating QR code',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    getLocalIpUrl();
  }, [toast]);

  return (
    <VStack spacing={4} p={4} bg="white" borderRadius="lg" shadow="md">
      <Text fontSize="lg" fontWeight="bold">
        Play with Friends
      </Text>
      <Text fontSize="sm" color="gray.600" textAlign="center">
        Connect to the same WiFi network and scan this QR code or visit:
      </Text>
      <Text fontSize="md" fontWeight="semibold" color="blue.500">
        {localUrl}
      </Text>
      {qrCode && (
        <Box p={4} bg="white" borderRadius="md">
          <img src={qrCode} alt="QR Code" style={{ maxWidth: '200px' }} />
        </Box>
      )}
    </VStack>
  );
};

export default ServerInfo; 