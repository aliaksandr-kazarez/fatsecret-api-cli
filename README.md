# FatSecret Food Tracker

A modern web application for tracking your daily food intake using the FatSecret API. Built with Node.js, Express, React, and TypeScript.

## Features

- 🔐 **OAuth Authentication** with FatSecret API
- 📊 **Daily Nutrition Dashboard** with calorie and macronutrient tracking
- 🔍 **Smart Food Search** with typeahead functionality
- 📝 **Food Diary** for adding and managing food entries
- 💡 **Nutrition Facts** display with serving size calculations
- 🎨 **Modern UI** with responsive design

## Prerequisites

- **Node.js ≥ 18**
- **FatSecret API credentials** (Consumer Key and Consumer Secret)

## Quick Start

1. **Get FatSecret API credentials:**
   - Visit https://platform.fatsecret.com/api/
   - Create a developer account
   - Create a new application to get your Consumer Key and Consumer Secret

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your FatSecret API credentials
   ```

4. **Run the application:**
   ```bash
   npm run dev:full
   ```
   This will start both the backend server (port 3000) and frontend development server (port 5173)

5. **Open your browser:**
   - Go to http://localhost:5173
   - Click "Login with FatSecret" to authenticate

## Development Scripts

- `npm run dev` - Start backend server with auto-restart
- `npm run dev:client` - Start frontend development server
- `npm run dev:full` - Start both backend and frontend servers
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## API Endpoints

### Authentication
- `GET /auth/login` - Initiate OAuth login flow
- `GET /auth/callback` - Handle OAuth callback
- `GET /auth/status` - Check authentication status
- `POST /auth/logout` - Logout user

### Food API
- `GET /api/foods/search?q=query` - Search for foods
- `GET /api/foods/:foodId` - Get food details
- `GET /api/diary` - Get today's diary entries
- `GET /api/diary/:date` - Get diary entries for specific date
- `POST /api/diary` - Add food to diary

## Project Structure

```
src/
├── server.ts                   # Express server setup
├── types/
│   └── express.d.ts           # Type definitions for Express
├── services/
│   ├── FatSecretAPI.ts        # FatSecret API client
│   └── index.ts               # Service exports
├── routes/
│   ├── auth.ts                # Authentication routes
│   └── api.ts                 # API routes
├── client/                    # React frontend
│   ├── main.tsx               # Frontend entry point
│   ├── App.tsx                # Main React component
│   ├── services/
│   │   └── api.ts             # Frontend API client
│   └── components/
│       ├── LoginPage.tsx      # Login page component
│       ├── Dashboard.tsx      # Dashboard component
│       └── FoodSearch.tsx     # Food search component
└── utils/                     # Utility functions
    ├── args.ts                # Command line argument parsing
    ├── help.ts                # Help text generation
    ├── logger.ts              # Logging utilities
    └── index.ts               # Utility exports
```

## How It Works

1. **OAuth Flow**: User clicks login → redirected to FatSecret → grants permissions → redirected back with tokens
2. **Dashboard**: Shows today's food entries with nutrition totals
3. **Food Search**: Typeahead search with debouncing → shows results on left, nutrition facts on right
4. **Add Food**: Select serving size → calculate nutrition → add to diary

## Architecture Features

- **Express Backend**: RESTful API with session management
- **React Frontend**: Modern SPA with component-based architecture
- **TypeScript**: Full type safety throughout the application
- **OAuth Integration**: Secure authentication with FatSecret API
- **Responsive Design**: Works on desktop and mobile devices

## Troubleshooting

- **Authentication Issues**: Check your FatSecret API credentials in `.env`
- **CORS Errors**: Make sure both servers are running on correct ports
- **Build Errors**: Run `npm install` to ensure all dependencies are installed

---

**This project is designed for clarity, maintainability, and extensibility with a modern interactive UI.**
If you have questions or want to contribute, please open an issue or PR! 