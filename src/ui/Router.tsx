import React, { useState } from 'react';
import { useInput } from 'ink';
import { FatSecretService } from '../services/index.js';
import { Food, FoodDetails } from '../types/fatsecret.js';
import { 
  Home, 
  Details, 
  Auth, 
  Dashboard, 
  FoodSearch, 
  AddToDiary 
} from './components/index.js';

type Screen = 
  | 'home' 
  | 'details' 
  | 'auth' 
  | 'dashboard' 
  | 'food-search' 
  | 'add-to-diary';

interface RouterState {
  screen: Screen;
  service?: FatSecretService;
  selectedFood?: Food;
  selectedFoodDetails?: FoodDetails;
}

export function Router(): React.JSX.Element {
  const [state, setState] = useState<RouterState>({ screen: 'home' });

  useInput((input, key) => {
    // Global navigation handlers
    if (key.escape && state.screen === 'home') {
      process.exit(0);
    }

    // Screen-specific navigation handlers
    switch (state.screen) {
      case 'home':
        if (input.toLowerCase() === 's' || input.toLowerCase() === '1') {
          setState(prev => ({ ...prev, screen: 'auth' }));
        } else if (input.toLowerCase() === 'q') {
          process.exit(0);
        }
        break;

      case 'dashboard':
        if (input.toLowerCase() === 'a') {
          setState(prev => ({ ...prev, screen: 'food-search' }));
        } else if (input.toLowerCase() === 'r') {
          // Refresh dashboard - handled by Dashboard component
        } else if (key.escape) {
          setState(prev => ({ ...prev, screen: 'home' }));
        }
        break;

      case 'auth':
        if (input.toLowerCase() === 'r') {
          // Retry authentication - handled by Auth component
        } else if (key.escape) {
          setState(prev => ({ ...prev, screen: 'home' }));
        }
        break;

      case 'food-search':
        if (key.escape) {
          setState(prev => ({ ...prev, screen: 'dashboard' }));
        }
        break;

      case 'add-to-diary':
        if (key.escape) {
          setState(prev => ({ ...prev, screen: 'food-search' }));
        }
        break;

      case 'details':
        if (key.escape) {
          setState(prev => ({ ...prev, screen: 'home' }));
        }
        break;
    }
  });

  const handleAuthSuccess = (service: FatSecretService) => {
    setState(prev => ({ 
      ...prev, 
      service, 
      screen: 'dashboard' 
    }));
  };

  const handleBackToHome = () => {
    setState(prev => ({ ...prev, screen: 'home' }));
  };

  const handleBackToDashboard = () => {
    setState(prev => ({ ...prev, screen: 'dashboard' }));
  };

  const handleFoodSelected = (food: Food, details?: FoodDetails) => {
    setState(prev => ({ 
      ...prev, 
      selectedFood: food,
      ...(details && { selectedFoodDetails: details }),
      screen: 'add-to-diary' 
    }));
  };

  const handleFoodAdded = () => {
    setState(prev => {
      const newState: RouterState = { 
        ...prev, 
        screen: 'dashboard' 
      };
      delete newState.selectedFood;
      delete newState.selectedFoodDetails;
      return newState;
    });
  };

  const handleBackToSearch = () => {
    setState(prev => {
      const newState: RouterState = { 
        ...prev, 
        screen: 'food-search' 
      };
      delete newState.selectedFood;
      delete newState.selectedFoodDetails;
      return newState;
    });
  };

  const handleAddFood = () => {
    setState(prev => ({ ...prev, screen: 'food-search' }));
  };

  switch (state.screen) {
    case 'home':
      return (
        <Home 
          onStartApp={() => setState(prev => ({ ...prev, screen: 'auth' }))}
          onViewDetails={() => setState(prev => ({ ...prev, screen: 'details' }))}
        />
      );

    case 'details':
      return <Details />;

    case 'auth':
      return (
        <Auth 
          onAuthSuccess={handleAuthSuccess}
          onBack={handleBackToHome}
        />
      );

    case 'dashboard':
      if (!state.service) {
        setState(prev => ({ ...prev, screen: 'auth' }));
        return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToHome} />;
      }
      return (
        <Dashboard 
          service={state.service}
          onAddFood={handleAddFood}
          onBack={handleBackToHome}
        />
      );

    case 'food-search':
      if (!state.service) {
        setState(prev => ({ ...prev, screen: 'auth' }));
        return <Auth onAuthSuccess={handleAuthSuccess} onBack={handleBackToHome} />;
      }
      return (
        <FoodSearch 
          service={state.service}
          onSelectFood={handleFoodSelected}
          onBack={handleBackToDashboard}
        />
      );

    case 'add-to-diary':
      if (!state.service || !state.selectedFood) {
        setState(prev => ({ ...prev, screen: 'dashboard' }));
        return (
          <Dashboard 
            service={state.service!}
            onAddFood={handleAddFood}
            onBack={handleBackToHome}
          />
        );
      }
             return (
         <AddToDiary 
           service={state.service}
           food={state.selectedFood}
           {...(state.selectedFoodDetails && { foodDetails: state.selectedFoodDetails })}
           onAdded={handleFoodAdded}
           onCancel={handleBackToSearch}
         />
       );

    default:
      return <Home onStartApp={() => {}} onViewDetails={() => {}} />;
  }
}
