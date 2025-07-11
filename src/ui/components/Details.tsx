import { Box, Text } from 'ink';
import { useRouter } from '../Router';

export function Details() {
  const { params } = useRouter();
  const helloMessage = params.hello || 'No hello message';

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="yellow" bold>Details Screen</Text>
      <Text color="cyan">Hello message: {helloMessage}</Text>
    </Box>
  );
} 