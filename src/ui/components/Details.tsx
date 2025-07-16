import React from 'react';
import { Box, Text, Newline } from 'ink';

// interface DetailsProps {
//   onBack: () => void;
// }

export function Details(): React.JSX.Element {
  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        📋 App Details & Information
      </Text>
      <Newline />
      
      <Text color="cyan" bold>About FatSecret Food Diary CLI</Text>
      <Text>
        This application provides a command-line interface to track your daily 
        food intake using the comprehensive FatSecret nutrition database.
      </Text>
      <Newline />
      
      <Text color="yellow" bold>Features Overview:</Text>
      <Newline />
      
      <Text color="green" bold>🔐 Authentication</Text>
      <Text>• Secure OAuth2 integration with FatSecret API</Text>
      <Text>• Token management and automatic refresh</Text>
      <Text>• Environment variable configuration</Text>
      <Newline />
      
      <Text color="green" bold>📊 Dashboard</Text>
      <Text>• View today's nutrition summary</Text>
      <Text>• Track progress toward daily goals</Text>
      <Text>• Visual progress indicators</Text>
      <Text>• List of all food entries by meal</Text>
      <Newline />
      
      <Text color="green" bold>🔍 Food Search</Text>
      <Text>• Real-time search with typeahead suggestions</Text>
      <Text>• Comprehensive food database with brands</Text>
      <Text>• Detailed nutrition information per serving</Text>
      <Text>• Multiple serving size options</Text>
      <Newline />
      
      <Text color="green" bold>📝 Food Diary</Text>
      <Text>• Add foods to breakfast, lunch, dinner, or snacks</Text>
      <Text>• Customizable serving amounts</Text>
      <Text>• Automatic nutrition calculation</Text>
      <Text>• Easy meal categorization</Text>
      <Newline />
      
      <Text color="cyan" bold>Technical Information:</Text>
      <Text>• Built with Node.js and TypeScript</Text>
      <Text>• Uses Ink for CLI interface components</Text>
      <Text>• Integrates with FatSecret Platform API</Text>
      <Text>• Cross-platform compatibility</Text>
      <Newline />
      
      <Text color="red">Press ESC to go back to main menu</Text>
    </Box>
  );
} 