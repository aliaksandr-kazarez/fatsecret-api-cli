import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import { FatSecretService } from '../../services/index.js';

interface AuthProps {
  onAuthSuccess: (service: FatSecretService) => void;
  onBack: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps): React.JSX.Element {
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    setStatus('authenticating');
    setError(null);

    try {
      // For demo purposes, we'll use environment variables or default demo credentials
      const clientId = process.env.FATSECRET_CLIENT_ID || 'demo_client_id';
      const clientSecret = process.env.FATSECRET_CLIENT_SECRET || 'demo_client_secret';

      if (clientId === 'demo_client_id' || clientSecret === 'demo_client_secret') {
        setError('Please set FATSECRET_CLIENT_ID and FATSECRET_CLIENT_SECRET environment variables');
        setStatus('error');
        return;
      }

      const service = new FatSecretService({
        clientId,
        clientSecret
      });

      await service.authenticate();
      setStatus('success');
      onAuthSuccess(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStatus('error');
    }
  };

  // const retry = () => {
  //   authenticate();
  // };

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        🔐 FatSecret API Authentication
      </Text>
      <Newline />

      {status === 'authenticating' && (
        <Text color="yellow">
          ⏳ Authenticating with FatSecret API...
        </Text>
      )}

      {status === 'success' && (
        <Text color="green">
          ✅ Authentication successful! Loading dashboard...
        </Text>
      )}

      {status === 'error' && (
        <Box flexDirection="column">
          <Text color="red">
            ❌ Authentication failed:
          </Text>
          <Text color="red">
            {error}
          </Text>
          <Newline />
          <Text color="gray">
            To get FatSecret API credentials:
          </Text>
          <Text color="gray">
            1. Visit https://platform.fatsecret.com/
          </Text>
          <Text color="gray">
            2. Sign up and register an application
          </Text>
          <Text color="gray">
            3. Set environment variables:
          </Text>
          <Text color="gray">
               export FATSECRET_CLIENT_ID="your_client_id"
          </Text>
          <Text color="gray">
               export FATSECRET_CLIENT_SECRET="your_client_secret"
          </Text>
          <Newline />
          <Text color="blue">
            Press R to retry • Press ESC to go back
          </Text>
        </Box>
      )}

      {status === 'idle' && (
        <Text color="gray">
          Initializing authentication...
        </Text>
      )}
    </Box>
  );
}