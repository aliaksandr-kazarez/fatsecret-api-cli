# FatSecret Food Diary CLI

A comprehensive command-line interface for tracking your daily nutrition using the FatSecret API. Built with Node.js, TypeScript, and Ink for a beautiful terminal experience.

## Features

🔐 **Secure Authentication**
- OAuth2 integration with FatSecret API
- Automatic token management and refresh
- Environment variable configuration

📊 **Nutrition Dashboard**
- View today's food entries and nutrition summary
- Track progress toward daily nutrition goals
- Visual progress indicators for calories, protein, carbs, and fat

🔍 **Smart Food Search**
- Real-time search with typeahead suggestions
- Access to FatSecret's comprehensive food database
- Detailed nutrition information for thousands of foods
- Support for branded and generic foods

📝 **Food Diary Management**
- Add foods to breakfast, lunch, dinner, or snacks
- Multiple serving size options
- Customizable serving amounts
- Automatic nutrition calculation

## Prerequisites

- Node.js 18.0.0 or higher
- FatSecret API credentials (free registration)

## Setup

1. **Get FatSecret API Credentials**
   - Visit [FatSecret Platform](https://platform.fatsecret.com/)
   - Register for a free developer account
   - Create a new application to get your Client ID and Client Secret

2. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd fatsecret-cli
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your FatSecret credentials
   ```

4. **Set Environment Variables**
   ```bash
   export FATSECRET_CLIENT_ID="your_client_id"
   export FATSECRET_CLIENT_SECRET="your_client_secret"
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Build and Run
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Run in development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Build and run the application
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix

## Application Flow

1. **Home Screen** - Welcome and instructions
2. **Authentication** - Secure login with FatSecret API
3. **Dashboard** - View today's nutrition summary and food entries
4. **Food Search** - Search for foods with real-time suggestions
5. **Nutrition Details** - View detailed nutrition information
6. **Add to Diary** - Select serving size, amount, and meal

## Navigation

### Global Controls
- `ESC` - Go back or exit
- `Q` - Quit application (from home screen)

### Home Screen
- `S` - Start the application
- `D` - View details/help
- `Q` - Quit

### Dashboard
- `A` - Add food to diary
- `R` - Refresh data
- `ESC` - Back to home

### Food Search
- Type to search (minimum 2 characters)
- `↑/↓` - Navigate search results
- `Enter` - View nutrition details
- `ESC` - Back to dashboard

### Nutrition Details
- `Enter` - Add food to diary
- `ESC` - Back to search results

### Add to Diary
- `↑/↓` - Navigate options
- `Enter` - Confirm selection/proceed
- `ESC` - Go back

## API Integration

This application uses the FatSecret Platform API with OAuth2 authentication. The following API endpoints are utilized:

- **Authentication**: `https://oauth.fatsecret.com/connect/token`
- **Food Search**: `foods.search`
- **Food Details**: `food.get.v4`
- **Autocomplete**: `foods.autocomplete` (Premier feature)

### API Limitations

- **Basic Tier**: Food search and details only
- **Premier Tier**: Includes autocomplete, barcode scanning, and advanced features
- **User Profiles**: Requires 3-legged OAuth for real user data storage

## Development

### Project Structure
```
src/
├── types/          # TypeScript type definitions
├── services/       # API integration and business logic
├── ui/            # React components for CLI interface
│   ├── components/ # Individual UI components
│   └── Router.tsx  # Main navigation router
├── utils/         # Utility functions
└── index.ts       # Application entry point
```

### Technology Stack
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Ink** - React for CLI applications
- **Axios** - HTTP client for API requests
- **ESLint** - Code linting and formatting

## Troubleshooting

### Authentication Issues
- Verify your FatSecret credentials are correct
- Check that environment variables are properly set
- Ensure your IP address is whitelisted (Premium accounts)

### API Rate Limits
- FatSecret enforces rate limits on API calls
- The application includes automatic retry logic
- Consider upgrading to Premium for higher limits

### Network Issues
- Check your internet connection
- Verify firewall settings allow HTTPS requests
- Try running with debug logging: `npm run dev:debug`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is not officially affiliated with FatSecret. It's an independent project that uses the FatSecret API to provide nutrition tracking functionality. Please respect FatSecret's terms of service when using their API. 