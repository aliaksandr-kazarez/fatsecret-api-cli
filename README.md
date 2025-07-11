# FatSecret API Explorer

A Node.js terminal application for exploring the FatSecret API with an interactive terminal UI built using React and Ink.

## Prerequisites

- **Node.js ≥ 18**
- **FatSecret API credentials** (Consumer Key and Consumer Secret)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm start
   ```

3. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

4. **Use the interactive UI:**
   - **Enter**: Navigate to details screen
   - **H**: Return to home screen
   - **Q**: Exit the application

## Development with Live Reload

The app supports several development modes with automatic restart when you make changes:

### Standard Development (with TypeScript compilation)
```bash
npm run dev              # Full logging
npm run dev:clean        # No logging (clean UI)
npm run dev:file         # Log to file
npm run dev:debug        # Debug mode
```

### Fast Development (no compilation step)
```bash
npm run dev:fast         # Fast restart with full logging
npm run dev:fast:clean   # Fast restart with clean UI
```

### Features:
- **Auto-restart**: App restarts automatically when you save changes
- **File watching**: Monitors `.ts`, `.tsx`, `.js`, `.jsx`, and `.json` files
- **Smart restart**: Only restarts when necessary
- **Manual restart**: Type `rs` and press Enter to restart manually

### Tips for Development:
- Use `npm run dev:clean` for a clean UI during development
- Use `npm run dev:fast` for faster iteration (no TypeScript compilation)
- Check the terminal for restart notifications

## Troubleshooting

- **UI not rendering**: Make sure your terminal supports Unicode and colors
- **Import errors**: Ensure all dependencies are installed with `npm install`

## Features

- **Interactive Terminal UI**: Built with Ink and React for a modern CLI experience
- **Screen Navigation**: Multi-screen application with routing
- **Parameter Passing**: Pass data between screens
- **Clean Architecture**: Functional programming approach with barrel exports
- **TypeScript Support**: Full type safety throughout the application

## Project Structure

```
src/
├── createApplication.ts        # Application factory function
├── index.ts                    # Main application entry point
├── services/
│   └── index.ts                # Service exports
├── ui/
│   ├── Application.tsx         # Main React application component
│   ├── Router.tsx              # Screen routing and navigation
│   ├── ServiceProvider.tsx     # Context provider for services
│   ├── components/
│   │   ├── Home.tsx            # Home screen component
│   │   ├── Details.tsx         # Details screen component
│   │   └── index.ts            # Component barrel exports
│   ├── hooks/
│   │   └── index.ts            # Custom hooks exports
│   └── index.ts                # UI exports
└── utils/
    ├── args.ts                 # Command line argument parsing
    ├── help.ts                 # Help text generation
    ├── logger.ts               # Logging utilities
    ├── manufacturer.ts         # Manufacturer information
    └── index.ts                # Utility exports
```

### Module Responsibilities

- **Router**: Manages screen navigation and parameter passing between screens
- **Components**: React components for each screen (Home, Details)
- **Services**: Business logic and API integration (to be implemented)
- **Utils**: Utility functions for argument parsing, logging, and help text
- **Application**: Main application factory and lifecycle management

## Architecture

The application follows a functional programming approach with:

- **Barrel Exports**: All modules use named exports through index files
- **Functional Factories**: Application creation through factory functions
- **React Context**: State management through React Context API
- **Screen Routing**: Multi-screen navigation with parameter passing
- **Event-Driven**: Input handling through Ink's useInput hook

## Extending

- To add new screens, create components in `src/ui/components/` and add them to the router
- To add new services, create them in `src/services/` and export through the barrel file
- To add new utilities, create them in `src/utils/` and export through the barrel file
- To modify the UI layout, update the components in `src/ui/components/`

---

**This project is designed for clarity, maintainability, and extensibility with a modern interactive UI.**
If you have questions or want to contribute, please open an issue or PR! 