import { createContext, useCallback, useContext, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Home, Details } from './components';

export type Screens = 'home' | 'details';

export interface RouterState {
  screen: Screens;
  params: Record<string, any>;
  navigateTo: (screen: Screens, params?: Record<string, any>) => void;
}

export const RouterContext = createContext<RouterState>({ screen: 'home', params: {}, navigateTo: () => { } });

export function useRouter(): RouterState {
  return useContext(RouterContext);
}

function useRouterProvider() {
  const [screen, setScreen] = useState<Screens>('home');
  const [params, setParams] = useState<Record<string, any>>({});

  const navigateTo = useCallback(function navigateTo(screen: Screens, params: Record<string, any> = {}) {
    setScreen(screen);
    setParams(params);
  }, []);

  return { screen, params, navigateTo };
}

export function useExit() {
  return {
    exit: useCallback((code: number = 0) => {
      process.exit(code);
    }, [])
  };
}

export function Router() {
  const { screen, params, navigateTo } = useRouterProvider();
  const { exit } = useExit();

  useInput((input, key) => {
    if (input === 'h') {
      navigateTo('home');
    } else if (input === 'q') {
      exit()
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box>
        <Text color="cyan" bold>⚖️ Gourmetmiles Smart Scale BLE Client</Text>
      </Box>

      <RouterContext.Provider value={{ screen, params, navigateTo }}>
        {renderScreen(screen)}
      </RouterContext.Provider>

      <Box>
        <Text color="gray">{renderHelpText(screen)}</Text>
      </Box>
    </Box>
  );
}

function renderHelpText(screen: Screens): string {
  switch (screen) {
    case 'home':
      return 'Q Exit';
    case 'details':
      return 'Q Exit';
    default:
      return '';
  }
};


function renderScreen(screen: Screens): React.ReactNode {
  switch (screen) {
    case 'home':
      return <Home />;
    case 'details':
      return <Details />;
  }
};
