import { useInput } from 'ink';
import { Box, Text } from 'ink';
import { useRouter } from '../Router';

export function Home() {
  const { navigateTo } = useRouter();

  useInput((input, key) => {
    if (key.return) {
      navigateTo('details', { hello: 'Hello' });
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="green" bold>Welcome to FatSecret API Explorer</Text>
      <Text color="gray">Press Enter to continue...</Text>
    </Box>
  );
} 