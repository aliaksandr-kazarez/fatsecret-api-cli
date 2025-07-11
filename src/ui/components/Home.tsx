import React from 'react';
import { Box, Text, Newline } from 'ink';

interface HomeProps {
  onStartApp: () => void;
  onViewDetails: () => void;
}

export function Home({ onStartApp, onViewDetails }: HomeProps): React.JSX.Element {
  // Navigation is handled by the parent Router component based on key input
  void onStartApp; void onViewDetails;
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        🍎 FatSecret Food Diary CLI
      </Text>
      <Newline />
      
      <Text color="green">
        Welcome to your personal food tracking assistant!
      </Text>
      <Text color="gray">
        Track your daily nutrition with the power of the FatSecret API.
      </Text>
      <Newline />
      
      <Text color="cyan" bold>Features:</Text>
      <Text>• 📊 Daily nutrition dashboard</Text>
      <Text>• 🔍 Smart food search with typeahead</Text>
      <Text>• 📱 Detailed nutrition information</Text>
      <Text>• 📝 Easy food diary management</Text>
      <Text>• 🎯 Track progress toward nutrition goals</Text>
      <Newline />
      
      <Text color="yellow" bold>Getting Started:</Text>
      <Text>Before using the app, you'll need FatSecret API credentials.</Text>
      <Text color="gray">Visit https://platform.fatsecret.com/ to register for free.</Text>
      <Newline />
      
      <Text color="blue" bold>Quick Actions:</Text>
      <Text color="green">Press S to Start the App</Text>
      <Text color="cyan">Press D for Details</Text>
      <Text color="red">Press Q to Quit</Text>
    </Box>
  );
} 